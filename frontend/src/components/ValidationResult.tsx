"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Fingerprint,
  Hash,
  Loader2,
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

type Props = {
  result: AnalysisResponse;
  onProceedToPayment?: () => void;
  paypalLoading?: boolean;
};

const statusConfig = {
  PASS: {
    Icon: CheckCircle2,
    label: "PASS",
    title: "Validation passed",
    description:
      "All required checks passed. This document pair is eligible for the next authorization step.",
    bannerBg: "#F0F8F2",
    bannerBorder: "#B8DABD",
    bannerText: "#2E5E3A",
    accentBar: "#4D7958",
    labelBg: "#E2F1E5",
    labelText: "#2E5E3A",
  },
  REVIEW: {
    Icon: AlertTriangle,
    label: "REVIEW",
    title: "Manual review required",
    description:
      "Some information requires human verification before this payment can proceed.",
    bannerBg: "#FFFBF0",
    bannerBorder: "#F0D98C",
    bannerText: "#7A5210",
    accentBar: "#B7791F",
    labelBg: "#FEF3C7",
    labelText: "#7A5210",
  },
  BLOCK: {
    Icon: XCircle,
    label: "BLOCK",
    title: "Payment blocked",
    description:
      "A critical mismatch was detected. This payment must not proceed until resolved.",
    bannerBg: "#FEF1F2",
    bannerBorder: "#F4BCBF",
    bannerText: "#8C1D25",
    accentBar: "#C34E5A",
    labelBg: "#FDE8EA",
    labelText: "#8C1D25",
  },
} as const;

export default function ValidationResult({ result, onProceedToPayment, paypalLoading }: Props) {
  const [rawOpen, setRawOpen] = useState(false);

  const { validation } = result;
  const cfg = statusConfig[validation.result];
  const { Icon } = cfg;

  const comparisonItems = [
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="space-y-4"
    >
      {/* ── Status banner card ── */}
      <div
        className="overflow-hidden rounded-xl border"
        style={{
          backgroundColor: cfg.bannerBg,
          borderColor: cfg.bannerBorder,
          boxShadow: "0 1px 4px rgba(41,32,57,0.06), 0 4px 16px rgba(41,32,57,0.04)",
        }}
      >
        {/* Accent top bar */}
        <div className="h-1 w-full" style={{ backgroundColor: cfg.accentBar }} />

        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(255,255,255,0.7)", color: cfg.bannerText }}
          >
            <Icon size={24} />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2.5">
              <span
                className="rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wider"
                style={{ backgroundColor: cfg.labelBg, color: cfg.labelText }}
              >
                {cfg.label}
              </span>
              <p className="text-[15px] font-bold" style={{ color: cfg.bannerText }}>
                {cfg.title}
              </p>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: cfg.bannerText, opacity: 0.85 }}>
              {cfg.description}
            </p>
          </div>
        </div>
      </div>

      {/* ── Document comparison ── */}
      <div
        className="rounded-xl border"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#E9E2EF",
          boxShadow: "0 1px 4px rgba(41,32,57,0.06), 0 4px 16px rgba(41,32,57,0.04)",
        }}
      >
        <div
          className="flex items-center gap-2 border-b px-5 py-4"
          style={{ borderColor: "#F0EBF5" }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-[0.12em]"
            style={{ color: "#A89BB0" }}
          >
            Document Comparison
          </p>
        </div>
        <div className="grid gap-px sm:grid-cols-2" style={{ backgroundColor: "#F0EBF5" }}>
          {comparisonItems.map(({ label, value }) => (
            <div
              key={label}
              className="p-4"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{ color: "#A89BB0" }}
              >
                {label}
              </p>
              <p
                className="mt-2 break-words text-[15px] font-semibold"
                style={{ color: "#292039" }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Decision evidence ── */}
      <div
        className="rounded-xl border"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#E9E2EF",
          boxShadow: "0 1px 4px rgba(41,32,57,0.06), 0 4px 16px rgba(41,32,57,0.04)",
        }}
      >
        <div
          className="flex items-center gap-2.5 border-b px-5 py-4"
          style={{ borderColor: "#F0EBF5" }}
        >
          <Fingerprint size={15} style={{ color: "#7B6191" }} />
          <p
            className="text-[11px] font-bold uppercase tracking-[0.12em]"
            style={{ color: "#A89BB0" }}
          >
            Decision Evidence
          </p>
        </div>
        <ul className="divide-y p-2" style={{ borderColor: "#F7F3FB" }}>
          {validation.reasons.map((reason, i) => {
            const isPass = validation.result === "PASS";
            const iconColor = isPass ? "#3D6647" : validation.result === "BLOCK" ? "#B03545" : "#92580F";
            return (
              <li
                key={i}
                className="flex items-start gap-3 px-3 py-3 text-[13px] leading-relaxed"
                style={{ color: "#4A3F54" }}
              >
                {isPass ? (
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color: iconColor }} />
                ) : (
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" style={{ color: iconColor }} />
                )}
                {reason}
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Validation reference ── */}
      <div
        className="rounded-xl border"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#E9E2EF",
          boxShadow: "0 1px 4px rgba(41,32,57,0.06), 0 4px 16px rgba(41,32,57,0.04)",
        }}
      >
        <div
          className="flex items-center gap-2.5 border-b px-5 py-4"
          style={{ borderColor: "#F0EBF5" }}
        >
          <Hash size={13} style={{ color: "#7B6191" }} />
          <p
            className="text-[11px] font-bold uppercase tracking-[0.12em]"
            style={{ color: "#A89BB0" }}
          >
            Validation Reference
          </p>
        </div>
        <div className="px-5 py-4">
          <p
            className="break-all font-mono text-[12px]"
            style={{ color: "#55416E" }}
          >
            {result.validation_id}
          </p>
        </div>
      </div>

      {/* ── Proceed to payment (PASS only) ── */}
      {validation.result === "PASS" && onProceedToPayment && (
        <button
          type="button"
          onClick={onProceedToPayment}
          disabled={paypalLoading}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-[14px] font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-70"
          style={{
            backgroundColor: "#4D7958",
            boxShadow: paypalLoading ? "none" : "0 4px 14px rgba(77,121,88,0.3)",
          }}
          onMouseEnter={(e) => {
            if (!paypalLoading) {
              e.currentTarget.style.backgroundColor = "#3A5E45";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(58,94,69,0.35)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#4D7958";
            e.currentTarget.style.boxShadow = paypalLoading
              ? "none"
              : "0 4px 14px rgba(77,121,88,0.3)";
          }}
        >
          {paypalLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              Proceed to Payment
              <ArrowRight size={15} />
            </>
          )}
        </button>
      )}

      {/* ── Raw extraction data (collapsible) ── */}
      <div
        className="overflow-hidden rounded-xl border"
        style={{
          borderColor: "#E9E2EF",
          boxShadow: "0 1px 4px rgba(41,32,57,0.04)",
        }}
      >
        <button
          type="button"
          className="flex w-full items-center justify-between px-5 py-3.5 text-[12px] font-semibold transition-colors"
          style={{ backgroundColor: "#FAFAFA", color: "#83778F" }}
          onClick={() => setRawOpen((o) => !o)}
          aria-expanded={rawOpen}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F5F0F8")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FAFAFA")}
        >
          <span>Raw Extraction Data</span>
          {rawOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {rawOpen && (
          <div
            className="space-y-4 border-t p-5"
            style={{ borderColor: "#E9E2EF" }}
          >
            {[
              { label: "Agreement Extraction", data: result.agreement_extraction },
              { label: "Invoice Extraction", data: result.invoice_extraction },
            ].map(({ label, data }) => (
              <div key={label}>
                <p
                  className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em]"
                  style={{ color: "#A89BB0" }}
                >
                  {label}
                </p>
                <pre
                  className="overflow-x-auto rounded-lg p-3 text-[11px] leading-relaxed"
                  style={{
                    backgroundColor: "#F7F5F9",
                    color: "#403052",
                    fontFamily: "var(--font-geist-mono, monospace)",
                  }}
                >
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
