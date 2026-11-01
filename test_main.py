
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_matching_payment_returns_pass():
    response = client.post(
        "/validate",
        json={
            "agreed_amount": 20000,
            "requested_amount": 20000,
            "agreed_milestone": "Backend API",
            "requested_milestone": "Backend API",
            "agreed_currency": "INR",
            "requested_currency": "INR",
        },
    )

    assert response.status_code == 200
    assert response.json()["result"] == "PASS"
    assert response.json()["reasons"] == []


def test_amount_mismatch_returns_block():
    response = client.post(
        "/validate",
        json={
            "agreed_amount": 20000,
            "requested_amount": 25000,
            "agreed_milestone": "Backend API",
            "requested_milestone": "Backend API",
            "agreed_currency": "INR",
            "requested_currency": "INR",
        },
    )

    assert response.status_code == 200
    assert response.json()["result"] == "BLOCK"
    assert any(
        "amount" in reason.lower()
        for reason in response.json()["reasons"]
    )


def test_milestone_mismatch_returns_block():
    response = client.post(
        "/validate",
        json={
            "agreed_amount": 20000,
            "requested_amount": 20000,
            "agreed_milestone": "Backend API",
            "requested_milestone": "Frontend Design",
            "agreed_currency": "INR",
            "requested_currency": "INR",
        },
    )

    assert response.status_code == 200
    assert response.json()["result"] == "BLOCK"
    assert any(
        "milestone" in reason.lower()
        for reason in response.json()["reasons"]
    )


def test_currency_mismatch_returns_block():
    response = client.post(
        "/validate",
        json={
            "agreed_amount": 20000,
            "requested_amount": 20000,
            "agreed_milestone": "Backend API",
            "requested_milestone": "Backend API",
            "agreed_currency": "INR",
            "requested_currency": "USD",
        },
    )

    assert response.status_code == 200
    assert response.json()["result"] == "BLOCK"
    assert any(
        "currency" in reason.lower()
        for reason in response.json()["reasons"]
    )


def test_empty_milestone_returns_review():
    response = client.post(
        "/validate",
        json={
            "agreed_amount": 20000,
            "requested_amount": 20000,
            "agreed_milestone": "",
            "requested_milestone": "Backend API",
            "agreed_currency": "INR",
            "requested_currency": "INR",
        },
    )

    print(response.status_code, response.json())
    assert response.status_code == 200
    assert response.json()["result"] == "REVIEW"
    assert any(
        "missing" in reason.lower()
        for reason in response.json()["reasons"]
    )