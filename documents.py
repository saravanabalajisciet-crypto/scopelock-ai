import asyncio
import json
import logging
import re
import sqlite3
import uuid

from decimal import Decimal, InvalidOperation
from io import BytesIO
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from pypdf import PdfReader

from ai_service import extract_document

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/documents", tags=["Documents"])

MAX_FILE_SIZE = 5 * 1024 * 1024
ALLOWED_EXTENSIONS = {".pdf", ".txt"}

REQUIRED_FIELDS = ("amount", "currency", "milestone")

# Use the same SQLite database as main.py.
DB_PATH = Path(__file__).with_name("scopelock_orders.db")


def store_validation_record(validation_id: str, validation: dict):
    """Persist the server-generated document validation result."""

    with sqlite3.connect(DB_PATH) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS validation_records (
                validation_id TEXT PRIMARY KEY,
                result TEXT NOT NULL,
                validation_json TEXT NOT NULL
            )
            """
        )

        connection.execute(
            """
            INSERT INTO validation_records
            (validation_id, result, validation_json)
            VALUES (?, ?, ?)
            """,
            (
                validation_id,
                validation["result"],
                json.dumps(validation),
            ),
        )


async def read_document(file: UploadFile):
    filename = (file.filename or "").strip()
    extension = Path(filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"{filename or 'File'}: Only PDF and TXT files are supported.",
        )

    content = await file.read(MAX_FILE_SIZE + 1)

    if not content:
        raise HTTPException(
            status_code=400,
            detail=f"{filename}: Uploaded file is empty.",
        )

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"{filename}: File size must not exceed 5 MB.",
        )

    try:
        if extension == ".txt":
            extracted_text = content.decode("utf-8-sig")
        else:
            reader = PdfReader(BytesIO(content))

            if reader.is_encrypted:
                raise HTTPException(
                    status_code=400,
                    detail=f"{filename}: Encrypted PDFs are not supported.",
                )

            extracted_text = "\n".join(
                page.extract_text() or "" for page in reader.pages
            )

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=400,
            detail=f"{filename}: Unable to read this document.",
        )

    extracted_text = extracted_text.strip()

    if not extracted_text:
        raise HTTPException(
            status_code=400,
            detail=f"{filename}: No readable text found.",
        )

    return filename, extracted_text


def compare_documents(agreement, invoice):
    reasons = []
    needs_review = False

    # Check required values and their supporting evidence.
    for document_name, document in (
        ("Agreement", agreement),
        ("Invoice", invoice),
    ):
        for field in REQUIRED_FIELDS:
            value = getattr(document, field)
            evidence = getattr(document, f"{field}_evidence")

            if value is None or (
                isinstance(value, str) and not value.strip()
            ):
                reasons.append(
                    f"{document_name} is missing the {field} field."
                )
                needs_review = True

            if evidence is None or (
                isinstance(evidence, str) and not evidence.strip()
            ):
                reasons.append(
                    f"{document_name} {field} evidence is unavailable or unverified."
                )
                needs_review = True

        # Any extraction uncertainty requires manual review.
        for uncertainty in document.uncertainties:
            reasons.append(
                f"{document_name} extraction uncertainty: {uncertainty}"
            )
            needs_review = True

        # Only missing required fields affect payment validation.
        for missing_field in document.missing_fields:
            if missing_field in REQUIRED_FIELDS:
                message = (
                    f"{document_name} extraction reports "
                    f"{missing_field} as missing."
                )

                if message not in reasons:
                    reasons.append(message)

                needs_review = True

    # Compare amounts only when both values are available.
    if agreement.amount is not None and invoice.amount is not None:
        try:
            agreed_amount = Decimal(str(agreement.amount))
            invoice_amount = Decimal(str(invoice.amount))

            if not agreed_amount.is_finite() or not invoice_amount.is_finite():
                raise InvalidOperation

            if agreed_amount != invoice_amount:
                reasons.append(
                    "Invoice amount does not match the agreement."
                )

        except (InvalidOperation, ValueError):
            reasons.append("Unable to compare document amounts.")
            needs_review = True

    # Compare currencies.
    if agreement.currency and invoice.currency:
        if (
            agreement.currency.strip().upper()
            != invoice.currency.strip().upper()
        ):
            reasons.append(
                "Invoice currency does not match the agreement."
            )

    # Compare milestone names, ignoring case and extra whitespace.
    if agreement.milestone and invoice.milestone:
        agreed_milestone = re.sub(
            r"\s+", " ", agreement.milestone
        ).strip().casefold()

        invoice_milestone = re.sub(
            r"\s+", " ", invoice.milestone
        ).strip().casefold()

        if agreed_milestone != invoice_milestone:
            reasons.append(
                "Invoice milestone does not match the agreement."
            )

    # Definite mismatches always take priority over REVIEW.
    has_mismatch = any(
        "does not match" in reason for reason in reasons
    )

    if has_mismatch:
        result = "BLOCK"

    elif needs_review:
        result = "REVIEW"

    else:
        result = "PASS"
        reasons.append(
            "Agreement and invoice amounts, currencies, and milestones match. "
            "Required supporting evidence is verified."
        )

    return {
        "result": result,
        "reasons": reasons,
        "agreed_amount": agreement.amount,
        "requested_amount": invoice.amount,
        "agreed_currency": agreement.currency,
        "requested_currency": invoice.currency,
        "agreed_milestone": agreement.milestone,
        "requested_milestone": invoice.milestone,
    }


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    filename, extracted_text = await read_document(file)

    extension = Path(filename).suffix.lower()

    return {
        "filename": filename,
        "document_type": extension.lstrip(".").upper(),
        "extracted_text": extracted_text,
        "character_count": len(extracted_text),
    }


@router.post("/analyze")
async def analyze_documents(
    agreement_file: UploadFile = File(...),
    invoice_file: UploadFile = File(...),
):
    agreement_name, agreement_text = await read_document(agreement_file)
    invoice_name, invoice_text = await read_document(invoice_file)

    try:
        # Gemini SDK calls are synchronous, so run them outside
        # FastAPI's asynchronous event loop.
        agreement, invoice = await asyncio.gather(
            asyncio.to_thread(
                extract_document,
                agreement_text,
                "AGREEMENT",
            ),
            asyncio.to_thread(
                extract_document,
                invoice_text,
                "INVOICE",
            ),
        )

        if agreement.document_type != "AGREEMENT":
            raise ValueError(
                "Agreement extraction returned the wrong document type."
            )

        if invoice.document_type != "INVOICE":
            raise ValueError(
                "Invoice extraction returned the wrong document type."
            )

        validation = compare_documents(agreement, invoice)

        # Generate a unique ID for this server-side validation.
        validation_id = str(uuid.uuid4())

        # Save the validation result for PayPal checkout authorization.
        await asyncio.to_thread(
            store_validation_record,
            validation_id,
            validation,
        )

        return {
            "status": "ANALYZED",
            "validation_id": validation_id,
            "agreement_file": agreement_name,
            "invoice_file": invoice_name,
            "validation": validation,
            "agreement_extraction": agreement.model_dump(),
            "invoice_extraction": invoice.model_dump(),
        }

    except Exception:
        logger.exception("Agreement and invoice analysis failed")
        raise HTTPException(
            status_code=502,
            detail="Document analysis failed. Check the server logs.",
        )
