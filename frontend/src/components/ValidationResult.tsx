"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ValidationData {
  result: "PASS" | "REVIEW" | "BLOCK";
  reasons: string[];
  agreed_amount: number;
  requested_amount: number;
  agreed_currency: string;
  requested_currency: string;
  agreed_milestone: string;
  requested_milestone: string;
}

export interface AnalysisResponse {
  status: string;
  validation_id: string;
  agreement_file: string;
  invoice_file: string;
  validation: ValidationData;
  agreement_extraction: Record<string, unknown>;
  invoice_extraction: Record<string, unknown>;
}

type ValidationResultProps = {
  result: AnalysisResponse;
  onProceedToPayment?: () => void;
};

const statusConfig = {
  PASS: {
    Icon: CheckCircle2,
    title: "Validation passed",
    description:
      "All required checks passed. This document pair is eligible for the next authorization step.",
    bg: "#DCEDDF",
    border: "#B8D9BE",
    text: "#4D7958",
  },
  REVIEW: {
    Icon: AlertTriangle,
    title: "Manual review required",
    description:
      "Some information needs attention before proceeding. Review the reasons below.",
    bg: "#FEF3C7",
    border: "#FDE68A",
    text: "#B7791F",
  },
  BLOCK: {
    Icon: XCircle,
    title: "Payment blocked",
    description:
      "A critical mismatch was detected. Payment must not proceed until resolved.",
    bg: "#FDE8EA",
    border: "#F9C5CA",
    text: "#C34E5A",
  },
} as const;

export default function ValidationResult({
  result,
  onProceedToPayment,
}: ValidationResultProps) {
  const [rawOpen, setRawOpen] = useState(false);

  const { validation } = result;
  const cfg = statusConfig[validation.result];
  const { Icon } = cfg;

  const comparisonCards = [
    {
      label: "Agreement amount",
      value:
        validation.agreed_amount != null
          ? `${validation.agreed_amount} ${validation.agreed_currency ?? ""}`.trim()
          : "Not available",
    },
    {
      label: "Invoice amount",
      value:
        validation.requested_amount != null
          ? `${validation.requested_amount} ${validation.requested_currency ?? ""}`.trim()
          : "Not available",
    },
    {
      label: "Agreement milestone",
      value: validation.agreed_milestone ?? "Not available",
    },
    {
      label: "Invoice milestone",
      value: validation.requested_milestone ?? "Not available",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4 rounded-xl border p-5"
      style={{ borderColor: "#E9E2EF", backgroundColor: "#FFFFFF" }}
    >
      {/* Status banner */}
      <div
        className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"
        style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
      >
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/70"
          style={{ color: cfg.text }}
        >
          <Icon size={24} />
        </div>
        <div>
          <p className="text-base font-bold" style={{ color: cfg.text }}>
            {cfg.title}
          </p>
          <p className="mt-0.5 text-sm leading-6" style={{ color: cfg.text }}>
            {cfg.description}
          </p>
        </div>
      </div>

      {/* Document comparison */}
      <div>
        <p
          className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ color: "#83778F" }}
        >
          Document Comparison
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {comparisonCards.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg border p-4"
              style={{ borderColor: "#E9E2EF", backgroundColor: "#FCFBFD" }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ color: "#83778F" }}
              >
                {label}
              </p>
              <p
                className="mt-2 break-words text-sm font-semibold"
                style={{ color: "#403052" }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Decision evidence */}
      <div
        className="rounded-lg border p-4"
        style={{ borderColor: "#E9E2EF" }}
      >
        <p
          className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ color: "#83778F" }}
        >
          Decision Evidence
        </p>
        <ul className="space-y-2">
          {validation.reasons.map((reason, i) => {
            const isPositive = validation.result === "PASS";
            return (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-6">
                {isPositive ? (
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0"
                    style={{ color: "#4D7958" }}
                  />
                ) : (
                  <AlertTriangle
                    size={16}
                    className="mt-0.5 shrink-0"
                    style={{ color: validation.result === "BLOCK" ? "#C34E5A" : "#B7791F" }}
                  />
                )}
                <span style={{ color: "#6F6479" }}>{reason}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Validation reference */}
      <div
        className="rounded-lg p-3"
        style={{ backgroundColor: "#F6F2F8" }}
      >
        <p
          className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ color: "#83778F" }}
        >
          Validation Reference
        </p>
        <p className="break-all font-mono text-xs" style={{ color: "#55416E" }}>
          {result.validation_id}
        </p>
      </div>

      {/* Proceed to payment — PASS only */}
      {validation.result === "PASS" && onProceedToPayment && (
        <button
          type="button"
          onClick={onProceedToPayment}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: "#55416E" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#403052")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#55416E")
          }
        >
          Proceed to Payment
        </button>
      )}

      {/* Collapsible raw extraction data */}
      <div
        className="rounded-lg border"
        style={{ borderColor: "#E9E2EF" }}
      >
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 text-xs font-semibold transition-colors"
          style={{ color: "#83778F" }}
          onClick={() => setRawOpen((o) => !o)}
          aria-expanded={rawOpen}
        >
          <span>Raw Extraction Data</span>
          {rawOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {rawOpen && (
          <div className="space-y-3 border-t px-4 pb-4 pt-3" style={{ borderColor: "#E9E2EF" }}>
            <div>
              <p
                className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ color: "#83778F" }}
              >
                Agreement Extraction
              </p>
              <pre
                className="overflow-x-auto rounded-lg p-3 text-xs"
                style={{
                  backgroundColor: "#F7F5F9",
                  color: "#403052",
                  fontFamily: "var(--font-geist-mono, monospace)",
                }}
              >
                {JSON.stringify(result.agreement_extraction, null, 2)}
              </pre>
            </div>
            <div>
              <p
                className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ color: "#83778F" }}
              >
                Invoice Extraction
              </p>
              <pre
                className="overflow-x-auto rounded-lg p-3 text-xs"
                style={{
                  backgroundColor: "#F7F5F9",
                  color: "#403052",
                  fontFamily: "var(--font-geist-mono, monospace)",
                }}
              >
                {JSON.stringify(result.invoice_extraction, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
