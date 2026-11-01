
from decimal import Decimal
from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(
    title="ScopeLock AI",
    description="Validate milestone payments before checkout.",
    version="0.2.0",
)


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



@app.post("/validate", response_model=PaymentValidationResponse)
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
