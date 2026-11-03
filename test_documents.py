from ai_service import ExtractedDocument
from documents import compare_documents


def make_document(
    document_type,
    amount=20000,
    currency="INR",
    milestone="Backend API Development",
    uncertainties=None,
    missing_fields=None,
):
    return ExtractedDocument(
        document_type=document_type,
        amount=amount,
        currency=currency,
        milestone=milestone,
        amount_evidence=f"INR {amount}" if amount is not None else None,
        currency_evidence=currency,
        milestone_evidence=milestone,
        uncertainties=uncertainties or [],
        missing_fields=missing_fields or [],
    )


def test_matching_documents_return_pass():
    agreement = make_document("AGREEMENT")
    invoice = make_document("INVOICE")

    result = compare_documents(agreement, invoice)

    assert result["result"] == "PASS"


def test_amount_mismatch_returns_block():
    agreement = make_document("AGREEMENT")
    invoice = make_document("INVOICE", amount=25000)

    result = compare_documents(agreement, invoice)

    assert result["result"] == "BLOCK"


def test_currency_mismatch_returns_block():
    agreement = make_document("AGREEMENT")
    invoice = make_document("INVOICE", currency="USD")

    result = compare_documents(agreement, invoice)

    assert result["result"] == "BLOCK"


def test_milestone_mismatch_returns_block():
    agreement = make_document("AGREEMENT")
    invoice = make_document(
        "INVOICE",
        milestone="Frontend Design",
    )

    result = compare_documents(agreement, invoice)

    assert result["result"] == "BLOCK"


def test_missing_evidence_returns_review():
    agreement = make_document("AGREEMENT")
    invoice = make_document("INVOICE")
    invoice.amount_evidence = None

    result = compare_documents(agreement, invoice)

    assert result["result"] == "REVIEW"


def test_extraction_uncertainty_returns_review():
    agreement = make_document("AGREEMENT")
    invoice = make_document(
        "INVOICE",
        uncertainties=["Amount evidence could not be verified."],
    )

    result = compare_documents(agreement, invoice)

    assert result["result"] == "REVIEW"


def test_mismatch_takes_priority_over_review():
    agreement = make_document("AGREEMENT")
    invoice = make_document(
        "INVOICE",
        amount=25000,
        uncertainties=["Some evidence is uncertain."],
    )

    result = compare_documents(agreement, invoice)

    assert result["result"] == "BLOCK"
