from ai_service import ExtractedDocument, verify_evidence


def test_valid_amount_evidence_is_preserved():
    result = ExtractedDocument(
        document_type="INVOICE",
        amount=20000,
        amount_evidence="INR 20000",
    )

    verified = verify_evidence(
        result, "Invoice Amount: INR 20000"
    )

    assert verified.amount_evidence == "INR 20000"
    assert not verified.uncertainties


def test_amount_evidence_mismatch_is_rejected():
    result = ExtractedDocument(
        document_type="INVOICE",
        amount=20000,
        amount_evidence="INR 25000",
    )

    verified = verify_evidence(
        result, "Invoice Amount: INR 25000"
    )

    assert verified.amount_evidence is None
    assert any(
        "amount" in item.lower()
        for item in verified.uncertainties
    )


def test_currency_evidence_mismatch_is_rejected():
    result = ExtractedDocument(
        document_type="INVOICE",
        currency="INR",
        currency_evidence="USD",
    )

    verified = verify_evidence(
        result, "Invoice Currency: USD"
    )

    assert verified.currency_evidence is None


def test_milestone_evidence_mismatch_is_rejected():
    result = ExtractedDocument(
        document_type="INVOICE",
        milestone="Backend API Development",
        milestone_evidence="Frontend Design",
    )

    verified = verify_evidence(
        result, "Milestone: Frontend Design"
    )

    assert verified.milestone_evidence is None


def test_evidence_not_found_in_original_document():
    result = ExtractedDocument(
        document_type="INVOICE",
        amount=20000,
        amount_evidence="INR 20000",
    )

    verified = verify_evidence(
        result, "Invoice Amount: INR 25000"
    )

    assert verified.amount_evidence is None
