import logging
import os
import sqlite3
from decimal import Decimal
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from documents import router as documents_router
from paypal_client import (
    create_order,
    get_access_token,
    get_order,
    capture_order,
)

logger = logging.getLogger(__name__)

DB_PATH = Path(
    os.getenv(
        "DATABASE_PATH",
        str(Path(__file__).with_name("scopelock_orders.db")),
    )
).expanduser()
DB_PATH.parent.mkdir(parents=True, exist_ok=True)


def init_order_store():
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS payment_orders (
                order_id TEXT PRIMARY KEY,
                amount TEXT NOT NULL,
                currency TEXT NOT NULL,
                milestone TEXT NOT NULL,
                status TEXT NOT NULL
            )
            """
        )


init_order_store()

app = FastAPI(
    title="ScopeLock AI",
    description="AI-powered agreement and invoice validation with PayPal.",
    version="0.6.0",
)

# CORS: Local development plus the configured deployed frontend.
frontend_url = os.getenv("FRONTEND_URL", "").strip().rstrip("/")
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if frontend_url and frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents_router)


class PaymentValidationRequest(BaseModel):
    agreed_amount: Decimal = Field(gt=0)
    requested_amount: Decimal = Field(gt=0)
    agreed_milestone: str
    requested_milestone: str
    agreed_currency: str = Field(min_length=3, max_length=3)
    requested_currency: str = Field(min_length=3, max_length=3)


class PaymentValidationResponse(BaseModel):
    result: Literal["PASS", "BLOCK", "REVIEW"]
    reasons: list[str]
    agreed_amount: Decimal
    requested_amount: Decimal


@app.get("/")
def home():
    return {
        "message": "Welcome to ScopeLock AI",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


def validate_payment(data: PaymentValidationRequest):
    reasons = []
    needs_review = False

    agreed_milestone = data.agreed_milestone.strip()
    requested_milestone = data.requested_milestone.strip()

    if not agreed_milestone:
        reasons.append("Agreement milestone is missing.")
        needs_review = True

    if not requested_milestone:
        reasons.append("Invoice milestone is missing.")
        needs_review = True

    if data.agreed_amount != data.requested_amount:
        reasons.append("Invoice amount does not match the agreement.")

    if (
        agreed_milestone
        and requested_milestone
        and agreed_milestone.casefold() != requested_milestone.casefold()
    ):
        reasons.append("Invoice milestone does not match the agreement.")

    if data.agreed_currency.upper() != data.requested_currency.upper():
        reasons.append("Invoice currency does not match the agreement.")

    has_mismatch = any("does not match" in reason for reason in reasons)

    if has_mismatch:
        result = "BLOCK"
    elif needs_review:
        result = "REVIEW"
    else:
        result = "PASS"

    return PaymentValidationResponse(
        result=result,
        reasons=reasons,
        agreed_amount=data.agreed_amount,
        requested_amount=data.requested_amount,
    )


@app.post("/validate", response_model=PaymentValidationResponse)
def validate_payment_endpoint(data: PaymentValidationRequest):
    return validate_payment(data)


@app.get("/paypal/connection")
async def paypal_connection():
    try:
        token_data = await get_access_token()

        return {
            "status": "CONNECTED",
            "provider": "PayPal Sandbox",
            "token_type": token_data.get("token_type"),
            "expires_in": token_data.get("expires_in"),
        }

    except Exception:
        logger.exception("PayPal authentication failed")
        raise HTTPException(
            status_code=502,
            detail="PayPal Sandbox authentication failed. Check server logs.",
        )


@app.post("/paypal/create-order")
async def paypal_create_order(data: PaymentValidationRequest):
    validation = validate_payment(data)

    if validation.result != "PASS":
        raise HTTPException(
            status_code=409,
            detail={
                "message": "Payment blocked by ScopeLock validation.",
                "validation_result": validation.result,
                "reasons": validation.reasons,
            },
        )

    try:
        currency = data.requested_currency.upper()
        amount = data.requested_amount.quantize(Decimal("0.01"))

        order = await create_order(
            amount=amount,
            currency=currency,
            description=f"ScopeLock milestone: {data.requested_milestone}",
        )

        order_id = order.get("id")

        if not order_id:
            raise RuntimeError("PayPal did not return an order ID.")

        approval_url = next(
            (
                link["href"]
                for link in order.get("links", [])
                if link.get("rel") in ("approve", "payer-action")
            ),
            None,
        )

        if not approval_url:
            raise RuntimeError("PayPal approval URL was not returned.")

        with sqlite3.connect(DB_PATH) as connection:
            connection.execute(
                """
                INSERT INTO payment_orders
                (order_id, amount, currency, milestone, status)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    order_id,
                    format(amount, ".2f"),
                    currency,
                    data.requested_milestone,
                    "CREATED",
                ),
            )

        return {
            "status": "ORDER_CREATED",
            "validation_result": validation.result,
            "provider": "PayPal Sandbox",
            "order_id": order_id,
            "approval_url": approval_url,
            "message": "Payment order created. Buyer approval is required.",
        }

    except Exception:
        logger.exception("PayPal order creation failed")
        raise HTTPException(
            status_code=502,
            detail="PayPal order creation failed. Check Uvicorn terminal logs.",
        )


@app.get("/paypal/return")
async def paypal_return(token: str):
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        saved_order = connection.execute(
            "SELECT * FROM payment_orders WHERE order_id = ?",
            (token,),
        ).fetchone()

    if saved_order is None:
        raise HTTPException(
            status_code=404,
            detail="Order not found in ScopeLock records.",
        )

    if saved_order["status"] == "COMPLETED":
        return {
            "status": "COMPLETED",
            "order_id": token,
            "message": "This payment has already been captured.",
        }

    try:
        paypal_order = await get_order(token)

        if paypal_order.get("id") != token:
            raise HTTPException(
                status_code=400,
                detail="PayPal order ID verification failed.",
            )

        if paypal_order.get("status") != "APPROVED":
            raise HTTPException(
                status_code=409,
                detail={
                    "message": "PayPal order has not been approved.",
                    "paypal_status": paypal_order.get("status"),
                },
            )

        purchase_units = paypal_order.get("purchase_units", [])

        if not purchase_units:
            raise HTTPException(
                status_code=400,
                detail="PayPal order has no purchase unit.",
            )

        paypal_amount = purchase_units[0].get("amount", {})

        if (
            paypal_amount.get("value") != saved_order["amount"]
            or paypal_amount.get("currency_code", "").upper()
            != saved_order["currency"]
        ):
            raise HTTPException(
                status_code=400,
                detail="PayPal amount or currency does not match the saved order.",
            )

        capture = await capture_order(token)

        if capture.get("status") != "COMPLETED":
            logger.error(
                "PayPal capture did not complete for order %s. Status: %s",
                token,
                capture.get("status"),
            )
            raise HTTPException(
                status_code=409,
                detail={
                    "message": "PayPal capture is not completed.",
                    "capture_status": capture.get("status"),
                },
            )

        with sqlite3.connect(DB_PATH) as connection:
            connection.execute(
                """
                UPDATE payment_orders
                SET status = ?
                WHERE order_id = ?
                """,
                ("COMPLETED", token),
            )

        return {
            "status": "COMPLETED",
            "provider": "PayPal Sandbox",
            "order_id": token,
            "capture_id": (
                capture.get("purchase_units", [{}])[0]
                .get("payments", {})
                .get("captures", [{}])[0]
                .get("id")
            ),
            "message": "Payment successfully captured by PayPal.",
        }

    except HTTPException:
        raise

    except Exception:
        logger.exception("PayPal return/capture processing failed")
        raise HTTPException(
            status_code=502,
            detail="Unable to verify or capture PayPal payment. Check server logs.",
        )


@app.get("/paypal/cancel")
def paypal_cancel(token: str | None = None):
    if token:
        with sqlite3.connect(DB_PATH) as connection:
            connection.execute(
                """
                UPDATE payment_orders
                SET status = ?
                WHERE order_id = ? AND status = ?
                """,
                ("CANCELLED", token, "CREATED"),
            )

    return {
        "status": "CANCELLED",
        "message": "Payment approval was cancelled. No capture was requested.",
    }
