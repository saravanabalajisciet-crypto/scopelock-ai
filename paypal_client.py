
import os
from decimal import Decimal

import httpx
from dotenv import load_dotenv

load_dotenv()

PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
PAYPAL_BASE_URL = os.getenv(
    "PAYPAL_BASE_URL",
    "https://api-m.sandbox.paypal.com",
)

BACKEND_PUBLIC_URL = os.getenv(
    "BACKEND_PUBLIC_URL",
    "http://127.0.0.1:8000",
).strip().rstrip("/")

PAYPAL_RETURN_URL = os.getenv(
    "PAYPAL_RETURN_URL",
    f"{BACKEND_PUBLIC_URL}/paypal/return",
)

PAYPAL_CANCEL_URL = os.getenv(
    "PAYPAL_CANCEL_URL",
    f"{BACKEND_PUBLIC_URL}/paypal/cancel",
)


async def get_access_token() -> dict:
    if not PAYPAL_CLIENT_ID or not PAYPAL_CLIENT_SECRET:
        raise RuntimeError("PayPal credentials are not configured.")

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(
            f"{PAYPAL_BASE_URL}/v1/oauth2/token",
            auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET),
            data={"grant_type": "client_credentials"},
            headers={"Accept": "application/json"},
        )

        if response.is_error:
            raise RuntimeError(
                f"PayPal authentication failed (HTTP {response.status_code})."
            )

        data = response.json()

        if "access_token" not in data:
            raise RuntimeError("PayPal did not return an access token.")

        return data


async def create_order(
    amount: Decimal,
    currency: str,
    description: str,
) -> dict:
    if amount <= 0:
        raise ValueError("Payment amount must be greater than zero.")

    if not currency or len(currency) != 3:
        raise ValueError("A valid three-letter currency code is required.")

    token_data = await get_access_token()
    access_token = token_data["access_token"]

    payload = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "description": description[:127],
                "amount": {
                    "currency_code": currency.upper(),
                    "value": format(amount, ".2f"),
                },
            }
        ],
        "application_context": {
            "brand_name": "ScopeLock AI",
            "user_action": "PAY_NOW",
            "return_url": PAYPAL_RETURN_URL,
            "cancel_url": PAYPAL_CANCEL_URL,
        },
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{PAYPAL_BASE_URL}/v2/checkout/orders",
            json=payload,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
                "Prefer": "return=representation",
            },
        )

        if response.is_error:
            raise RuntimeError(
                f"PayPal order creation failed (HTTP {response.status_code}). "
                f"PayPal response: {response.text[:1000]}"
            )

        data = response.json()

        if not data.get("id"):
            raise RuntimeError("PayPal did not return an order ID.")

        return data

async def get_order(order_id: str) -> dict:
    """Fetch the latest PayPal order details."""
    token_data = await get_access_token()

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(
            f"{PAYPAL_BASE_URL}/v2/checkout/orders/{order_id}",
            headers={
                "Authorization": f"Bearer {token_data['access_token']}",
                "Accept": "application/json",
            },
        )

        if response.is_error:
            raise RuntimeError(
                f"PayPal order lookup failed (HTTP {response.status_code}): "
                f"{response.text[:1000]}"
            )

        return response.json()


async def capture_order(order_id: str) -> dict:
    """Capture a buyer-approved PayPal order."""
    token_data = await get_access_token()

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{PAYPAL_BASE_URL}/v2/checkout/orders/{order_id}/capture",
            headers={
                "Authorization": f"Bearer {token_data['access_token']}",
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Prefer": "return=representation",
            },
            json={},
        )

        if response.is_error:
            raise RuntimeError(
                f"PayPal capture failed (HTTP {response.status_code}): "
                f"{response.text[:1000]}"
            )

        return response.json()
