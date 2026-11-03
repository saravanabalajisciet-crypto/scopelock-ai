"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Loader2,
  ShieldCheck,
  FileText,
  Hash,
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

interface Props {
  result: AnalysisResponse;
  onProceedToPayment?: () => void;
  paypalLoading?: boolean;
}

const STATUS = {
  PASS: {
    Icon: CheckCircle2,
    label: "PASS",
    headline: "Validation Passed",
    body: "All checks passed. Documents are consistent and eligible for payment authorization.",
    topBar: "#4D7958",
    bannerBg: "#F2FAF4",
    bannerBorder: "#B8D9BE",
    textColor: "#1E4A2A",
    labelBg: "#D9EFE0",
    iconBg: "#E6F4EB",
  },
  REVIEW: {
    Icon: AlertTriangle,
    label: "REVIEW",
    headline: "Manual Review Required",
    body: "Some information requires human verification before this payment can proceed.",
    topBar: "#B7791F",
    bannerBg: "#FFFCF0",
    bannerBorder: "#EDD898",
    textColor: "#B7791F",
    labelBg: "#FFF3D6",
    iconBg: "#FFF8E6",
  },
  BLOCK: {
    Icon: XCircle,
    label: "BLOCK",
    headline: "Payment Blocked",
    body: "A critical mismatch was detected. This payment cannot proceed until discrepancies are resolved.",
    topBar: "#C34E5A",
    bannerBg: "#FFF1F2",
    bannerBorder: "#F4BCBF",
    textColor: "#C34E5A",
    labelBg: "#FDE8EA",
    iconBg: "#FDE8EA",
  },
} as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] font-bold uppercase tracking-[0.14em]"
      style={{ color: "#A89BB0" }}
    >
      {children}
    </p>
  );
}

function money(amount: number, currency: string): string {
  return `${amount} ${currency ?? ""}`.trim();
}

export default function ValidationResult({ result, onProceedToPayment, paypalLoading }: Props) {
  const [rawOpen, setRawOpen] = useState(false);
  const { validation } = result;
  const cfg = STATUS[validation.result];
  const { Icon } = cfg;
  const isPass = validation.result === "PASS";
  const isBlock = validation.result === "BLOCK";

  return (
    <div className="space-y-3">
      {/* ── Decision banner ── */}
      <div
        className="overflow-hidden rounded-xl"
        style={{
          border: `1px solid ${cfg.bannerBorder}`,
          backgroundColor: cfg.bannerBg,
          boxShadow: isBlock
            ? "0 4px 18px rgba(195,78,90,0.12)"
            : "0 2px 12px rgba(41,32,57,0.06)",
        }}
      >
        {/* Accent bar */}
        <div className="h-1.5" style={{ backgroundColor: cfg.topBar }} />

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
              style={{ backgroundColor: cfg.iconBg, color: cfg.topBar }}
            >
              <Icon size={28} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className="text-[12px] font-black tracking-[0.12em] px-3 py-1 rounded-md"
                  style={{ backgroundColor: cfg.labelBg, color: cfg.textColor }}
                >
                  {cfg.label}
                </span>
                <h3
                  className="text-[18px] font-bold tracking-tight"
                  style={{ color: cfg.textColor }}
                >
                  {cfg.headline}
                </h3>
              </div>
              <p
                className="mt-2 text-[13.5px] leading-relaxed max-w-2xl"
                style={{ color: cfg.textColor, opacity: 0.82 }}
              >
                {cfg.body}
              </p>

              {/* Approved amount — PASS only */}
              {isPass && (
                <div
                  className="mt-4 flex items-end gap-2 rounded-xl px-4 py-3"
                  style={{ backgroundColor: cfg.iconBg }}
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.14em] pb-0.5"
                    style={{ color: cfg.textColor, opacity: 0.7 }}
                  >
                    Approved amount
                  </span>
                  <span
                    className="text-[22px] font-bold tracking-tight leading-none"
                    style={{ color: cfg.textColor }}
                  >
                    {money(validation.agreed_amount, validation.agreed_currency)}
                  </span>
                </div>
              )}

              {/* Block emphasis */}
              {isBlock && (
                <p
                  className="mt-3.5 flex items-center gap-2 text-[12px] font-semibold"
                  style={{ color: cfg.textColor }}
                >
                  <ShieldCheck size={13} />
                  Payment authorization is disabled for this validation.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Comparison table ── */}
      <div
        className="overflow-hidden rounded-xl"
        style={{
          border: "1px solid #E9E2EF",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 1px 4px rgba(41,32,57,0.05)",
        }}
      >
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid #F0EBF5" }}
        >
          <FileText size={14} style={{ color: "#78628F" }} />
          <SectionLabel>Document Comparison</SectionLabel>
        </div>

        {/* Column headers */}
        <div
          className="grid grid-cols-3 px-5 py-2.5"
          style={{ borderBottom: "1px solid #F0EBF5", backgroundColor: "#FBFAFC" }}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "#A89BB0" }}>
            Field
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "#A89BB0" }}>
            Agreement
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "#A89BB0" }}>
            Invoice
          </span>
        </div>

        <div>
          <ComparisonRow
            label="Amount"
            agreed={money(validation.agreed_amount, validation.agreed_currency)}
            requested={money(validation.requested_amount, validation.requested_currency)}
            highlight={!isPass}
          />
          <div style={{ borderTop: "1px solid #F0EBF5" }} />
          <ComparisonRow
            label="Milestone"
            agreed={validation.agreed_milestone || "—"}
            requested={validation.requested_milestone || "—"}
            highlight={!isPass}
          />
        </div>
      </div>

      {/* ── Reasons ── */}
      <div
        className="overflow-hidden rounded-xl"
        style={{
          border: "1px solid #E9E2EF",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 1px 4px rgba(41,32,57,0.05)",
        }}
      >
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid #F0EBF5" }}
        >
          <ShieldCheck size={14} style={{ color: "#78628F" }} />
          <SectionLabel>Validation Evidence</SectionLabel>
        </div>
        <ul className="divide-y" style={{ borderColor: "#F0EBF5" }}>
          {validation.reasons.map((reason, i) => {
            // PASS → CheckCircle2 (green), BLOCK → XCircle (red), REVIEW → AlertTriangle (amber)
            const Icon2 = isPass ? CheckCircle2 : isBlock ? XCircle : AlertTriangle;
            const color = isPass ? "#4D7958" : isBlock ? "#C34E5A" : "#B7791F";
            return (
              <li
                key={i}
                className="flex items-start gap-3 px-5 py-3.5 text-[13px] leading-relaxed"
                style={{ color: "#292039", borderColor: "#F0EBF5" }}
              >
                <Icon2 size={14} className="mt-0.5 shrink-0" style={{ color }} />
                {reason}
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Validation ID ── */}
      <div
        className="overflow-hidden rounded-xl"
        style={{
          border: "1px solid #E9E2EF",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 1px 4px rgba(41,32,57,0.05)",
        }}
      >
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid #F0EBF5" }}>
          <Hash size={13} style={{ color: "#78628F" }} />
          <SectionLabel>Validation Reference</SectionLabel>
        </div>
        <div className="px-5 py-4">
          <p
            className="break-all font-mono text-[12px] leading-relaxed"
            style={{ color: "#55416E" }}
          >
            {result.validation_id}
          </p>
        </div>
      </div>

      {/* ── PayPal CTA — PASS only ── */}
      {isPass && onProceedToPayment && (
        <div
          className="overflow-hidden rounded-xl p-5"
          style={{
            border: "1px solid #B8D9BE",
            backgroundColor: "#F2FAF4",
            boxShadow: "0 2px 10px rgba(77,121,88,0.08)",
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-[14px] font-bold" style={{ color: "#1E4A2A" }}>
                Payment Authorization
              </p>
              <p className="mt-0.5 text-[12px]" style={{ color: "#4D7958" }}>
                Validated amount · PayPal Sandbox · Backend-controlled
              </p>
            </div>
            <button
              type="button"
              onClick={onProceedToPayment}
              disabled={paypalLoading}
              className="flex items-center gap-2.5 rounded-xl px-6 py-3 text-[14px] font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#4D7958",
                boxShadow: paypalLoading ? "none" : "0 4px 14px rgba(77,121,88,0.35)",
              }}
              onMouseEnter={(e) => {
                if (!paypalLoading) {
                  e.currentTarget.style.backgroundColor = "#3A5E45";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#4D7958";
              }}
            >
              {paypalLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  Proceed to Payment
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Raw extraction (collapsible) ── */}
      <div
        className="overflow-hidden rounded-xl"
        style={{ border: "1px solid #E9E2EF" }}
      >
        <button
          type="button"
          onClick={() => setRawOpen((o) => !o)}
          aria-expanded={rawOpen}
          className="flex w-full items-center justify-between px-5 py-3.5 text-[12px] font-semibold transition-colors"
          style={{ backgroundColor: "#FAFAFA", color: "#83778F" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F7F4FA")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FAFAFA")}
        >
          <span>Raw Extraction Data</span>
          {rawOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {rawOpen && (
          <div className="space-y-4 border-t p-5" style={{ borderColor: "#E9E2EF" }}>
            {[
              { label: "Agreement", data: result.agreement_extraction },
              { label: "Invoice", data: result.invoice_extraction },
            ].map(({ label, data }) => (
              <div key={label}>
                <SectionLabel>{label} Extraction</SectionLabel>
                <pre
                  className="mt-2 overflow-x-auto rounded-lg p-3 text-[11px] leading-relaxed"
                  style={{
                    backgroundColor: "#F7F5F9",
                    color: "#292039",
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
    </div>
  );
}

/* ── Comparison row ─────────────────────────────────────────────── */

function ComparisonRow({
  label,
  agreed,
  requested,
  highlight,
}: {
  label: string;
  agreed: string;
  requested: string;
  highlight: boolean;
}) {
  const mismatch = highlight && agreed !== requested && agreed !== "—" && requested !== "—";
  return (
    <div className="grid grid-cols-3 px-5 py-4">
      <span className="text-[12px] font-semibold" style={{ color: "#83778F" }}>
        {label}
      </span>
      <span
        className="text-[14px] font-semibold break-words"
        style={{ color: "#292039" }}
      >
        {agreed}
      </span>
      <span
        className="text-[14px] font-semibold break-words flex items-center gap-1.5"
        style={{ color: mismatch ? "#C34E5A" : "#292039" }}
      >
        {mismatch && <AlertTriangle size={13} className="shrink-0" style={{ color: "#C34E5A" }} />}
        {requested}
      </span>
    </div>
  );
}
