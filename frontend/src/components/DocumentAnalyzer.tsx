"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ShieldCheck,
  Brain,
  CreditCard,
  ArrowRight,
  AlertCircle,
  LayoutDashboard,
  Upload,
  History,
  Cpu,
} from "lucide-react";

import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import type { Page } from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import UploadCard from "@/components/UploadCard";
import ValidationResult from "@/components/ValidationResult";
import type { AnalysisResponse } from "@/components/ValidationResult";

// ─── Constants ────────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

const ANALYSIS_STAGES = [
  "Reading agreement document…",
  "Extracting invoice information…",
  "Comparing financial terms…",
  "Evaluating discrepancies…",
] as const;

const PAGE_META: Record<Page, { title: string; description: string }> = {
  overview: { title: "Overview", description: "ScopeLock AI workspace" },
  validate: { title: "Validate Documents", description: "AI-powered payment validation" },
  history: { title: "Validation History", description: "Past validation records" },
  settings: { title: "Settings", description: "Workspace configuration" },
};

const WORKFLOW_STEPS = [
  { step: 1, label: "Upload Documents", icon: Upload },
  { step: 2, label: "AI Analysis", icon: Brain },
  { step: 3, label: "Payment Decision", icon: ShieldCheck },
];

// ─── File validation helper ────────────────────────────────────────────────────

function validateFile(file: File): string {
  const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "");
  if (![".pdf", ".txt"].includes(ext)) return "Only PDF and TXT files are accepted.";
  if (file.size > 5 * 1024 * 1024) return "File must be under 5 MB.";
  return "";
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E9E2EF",
        boxShadow: "0 1px 3px rgba(41,32,57,0.06), 0 4px 12px rgba(41,32,57,0.04)",
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({ left, right }: { left: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-between px-6 py-4"
      style={{ borderBottom: "1px solid #F0EBF5" }}
    >
      <div>{left}</div>
      {right && <div>{right}</div>}
    </div>
  );
}

// ─── Validate Page ─────────────────────────────────────────────────────────────
// CRITICAL: defined at module scope (not inside DocumentAnalyzer) because it uses hooks.

function ValidatePage({
  agreement,
  setAgreement,
  invoice,
  setInvoice,
  loading,
  error,
  result,
  agreementDragOver,
  setAgreementDragOver,
  invoiceDragOver,
  setInvoiceDragOver,
  agreementError,
  setAgreementError,
  invoiceError,
  setInvoiceError,
  analyzeDocuments,
  handleProceedToPayment,
  paypalLoading,
}: {
  agreement: File | null;
  setAgreement: (f: File | null) => void;
  invoice: File | null;
  setInvoice: (f: File | null) => void;
  loading: boolean;
  error: string;
  result: AnalysisResponse | null;
  agreementDragOver: boolean;
  setAgreementDragOver: (v: boolean) => void;
  invoiceDragOver: boolean;
  setInvoiceDragOver: (v: boolean) => void;
  agreementError: string;
  setAgreementError: (v: string) => void;
  invoiceError: string;
  setInvoiceError: (v: string) => void;
  analyzeDocuments: () => void;
  handleProceedToPayment: () => void;
  paypalLoading: boolean;
}) {
  // canAnalyze computed locally from props — NOT a prop
  const canAnalyze = !!agreement && !!invoice && !loading && !agreementError && !invoiceError;
  const filesSelected = [agreement, invoice].filter(Boolean).length;

  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!loading) {
      const id = setTimeout(() => setStageIndex(0), 0);
      return () => clearTimeout(id);
    }
    const id = setInterval(
      () => setStageIndex((s) => Math.min(s + 1, ANALYSIS_STAGES.length - 1)),
      1100
    );
    return () => clearInterval(id);
  }, [loading]);

  function handleAgreementChange(file: File | null) {
    if (file) {
      const err = validateFile(file);
      if (err) { setAgreementError(err); return; }
    }
    setAgreementError("");
    setAgreement(file);
  }

  function handleInvoiceChange(file: File | null) {
    if (file) {
      const err = validateFile(file);
      if (err) { setInvoiceError(err); return; }
    }
    setInvoiceError("");
    setInvoice(file);
  }

  function handleAgreementDrop(e: React.DragEvent) {
    e.preventDefault();
    setAgreementDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleAgreementChange(file);
  }

  function handleInvoiceDrop(e: React.DragEvent) {
    e.preventDefault();
    setInvoiceDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleInvoiceChange(file);
  }

  // Active workflow step: loading=2, result=3, filesSelected>0=1, else 0
  const activeStep = loading ? 2 : result ? 3 : filesSelected > 0 ? 1 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Page heading */}
      <div>
        <h1
          className="text-[30px] sm:text-[34px] font-bold tracking-[-0.04em] leading-tight"
          style={{ color: "#292039" }}
        >
          Verify before you pay.
        </h1>
        <p
          className="mt-2.5 text-[14px] leading-relaxed max-w-xl"
          style={{ color: "#83778F" }}
        >
          Compare agreements and invoices with AI-powered intelligence before authorizing payment.
        </p>
      </div>

      {/* 3-step progress strip */}
      <div
        className="flex items-center gap-2 rounded-xl px-4 py-3.5 sm:px-5"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E9E2EF",
          boxShadow: "0 1px 3px rgba(41,32,57,0.06)",
        }}
      >
        {WORKFLOW_STEPS.map(({ step, label, icon: Icon }, i) => {
          const reached = activeStep >= step;
          const active = activeStep === step;
          return (
            <div key={step} className="flex flex-1 items-center gap-2.5">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-200"
                  style={{
                    backgroundColor: reached ? "#55416E" : "#EEE7F3",
                    color: reached ? "#FFFFFF" : "#A89BB0",
                    boxShadow: active ? "0 0 0 3px #F1EBF7" : "none",
                  }}
                >
                  {reached && step < activeStep ? "✓" : step}
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon size={13} style={{ color: reached ? "#55416E" : "#A89BB0" }} />
                  <span
                    className="text-[12.5px] font-semibold whitespace-nowrap"
                    style={{ color: reached ? "#292039" : "#A89BB0" }}
                  >
                    {label}
                  </span>
                </div>
              </div>
              {i < WORKFLOW_STEPS.length - 1 && (
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: activeStep > step ? "#D8CCE4" : "#EFE9F4" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Upload workspace card */}
      <SectionCard>
        <CardHeader
          left={
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
              >
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="text-[14px] font-semibold" style={{ color: "#292039" }}>
                  Document Upload
                </p>
                <p className="text-[11px]" style={{ color: "#A89BB0" }}>
                  PDF or TXT · Max 5 MB per file
                </p>
              </div>
            </div>
          }
          right={
            <span className="text-[12px] font-medium" style={{ color: "#83778F" }}>
              {filesSelected} / 2 uploaded
            </span>
          }
        />

        <div className="p-5 sm:p-7">
          {/* Upload grid */}
          <div className="grid gap-5 sm:grid-cols-2">
            <UploadCard
              title="Agreement Document"
              description="The original signed agreement or contract"
              accentColor="#55416E"
              accentBg="#F1EBF7"
              file={agreement}
              onChange={handleAgreementChange}
              dragOver={agreementDragOver}
              onDragOver={(e) => { e.preventDefault(); setAgreementDragOver(true); }}
              onDragLeave={() => setAgreementDragOver(false)}
              onDrop={handleAgreementDrop}
              error={agreementError}
              uploading={loading}
            />
            <UploadCard
              title="Invoice Document"
              description="The corresponding invoice to compare"
              accentColor="#4D7958"
              accentBg="#EDF7F0"
              file={invoice}
              onChange={handleInvoiceChange}
              dragOver={invoiceDragOver}
              onDragOver={(e) => { e.preventDefault(); setInvoiceDragOver(true); }}
              onDragLeave={() => setInvoiceDragOver(false)}
              onDrop={handleInvoiceDrop}
              error={invoiceError}
              uploading={loading}
            />
          </div>

          {/* Progress indicator dots */}
          <div className="mt-5 flex items-center gap-3">
            {[
              { label: "Agreement", filled: !!agreement && !agreementError },
              { label: "Invoice", filled: !!invoice && !invoiceError },
            ].map(({ label, filled }, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black transition-all duration-200"
                  style={{
                    backgroundColor: filled ? "#55416E" : "#EEE7F3",
                    color: filled ? "#FFFFFF" : "#A89BB0",
                  }}
                >
                  {filled ? "✓" : i + 1}
                </div>
                <span
                  className="text-[12px] font-medium"
                  style={{ color: filled ? "#55416E" : "#A89BB0" }}
                >
                  {label}
                </span>
                {i === 0 && (
                  <span className="text-[12px]" style={{ color: "#D8CCE2" }}>
                    →
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Analysis progress panel — visible only when loading=true */}
          <AnimatePresence>
            {loading && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div
                  className="rounded-xl p-5"
                  style={{ backgroundColor: "#F9F7FC", border: "1px solid #E9E2EF" }}
                >
                  <p
                    className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: "#A89BB0" }}
                  >
                    Analyzing
                  </p>
                  <ul className="space-y-3">
                    {ANALYSIS_STAGES.map((stage, i) => (
                      <li
                        key={stage}
                        className="flex items-center gap-3 text-[13px]"
                        style={{ color: i <= stageIndex ? "#292039" : "#C2B7CE" }}
                      >
                        {/* current = Loader2 spinner; past = dim gray dot (NOT CheckCircle2); future = empty circle border */}
                        {i < stageIndex ? (
                          <span
                            className="h-3.5 w-3.5 shrink-0 rounded-full"
                            style={{ backgroundColor: "#C2B7CE" }}
                          />
                        ) : i === stageIndex ? (
                          <Loader2 size={14} className="shrink-0 animate-spin" style={{ color: "#55416E" }} />
                        ) : (
                          <span
                            className="h-3.5 w-3.5 shrink-0 rounded-full border-2"
                            style={{ borderColor: "#DDD4EB" }}
                          />
                        )}
                        {stage}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze button — full width, plum gradient when active */}
          <button
            type="button"
            onClick={analyzeDocuments}
            disabled={!canAnalyze}
            className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl py-4 text-[14px] font-semibold text-white transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-35"
            style={{
              background: canAnalyze
                ? "linear-gradient(135deg, #6B4F87 0%, #403052 100%)"
                : "#C2B7CE",
              boxShadow: canAnalyze ? "0 4px 16px rgba(85,65,110,0.35)" : "none",
            }}
            onMouseEnter={(e) => {
              if (canAnalyze) e.currentTarget.style.opacity = "0.92";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Analyzing documents…
              </>
            ) : (
              <>
                <ShieldCheck size={17} />
                Analyze and Validate
                <ArrowRight size={15} />
              </>
            )}
          </button>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-3 rounded-xl border p-4 text-[13px]"
              style={{ backgroundColor: "#FDE8EA", borderColor: "#F4BCBF", color: "#B03545" }}
            >
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}
        </div>
      </SectionCard>

      {/* Validation result */}
      {result && (
        <ValidationResult
          result={result}
          onProceedToPayment={handleProceedToPayment}
          paypalLoading={paypalLoading}
        />
      )}
    </motion.div>
  );
}

// ─── Overview Page ─────────────────────────────────────────────────────────────

function OverviewPage({
  healthStatus,
  onNavigateToValidate,
}: {
  healthStatus: "loading" | "healthy" | "unhealthy";
  onNavigateToValidate: () => void;
}) {
  const isOnline = healthStatus === "healthy";
  const isLoading = healthStatus === "loading";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="space-y-7"
    >
      <div>
        <h1
          className="text-[28px] sm:text-[32px] font-bold tracking-[-0.03em] leading-tight"
          style={{ color: "#292039" }}
        >
          Payment Intelligence
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "#83778F" }}>
          Powered by Gemini AI and secured by ScopeLock validation engine.
        </p>
      </div>

      {/* System status cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Validation Engine */}
        <SectionCard>
          <div className="p-5">
            <div className="flex items-start justify-between mb-5">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
              >
                <Cpu size={19} />
              </div>
              {isLoading ? (
                <div className="h-6 w-14 animate-pulse rounded-full" style={{ backgroundColor: "#EEE7F3" }} />
              ) : (
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-bold"
                  style={
                    isOnline
                      ? { backgroundColor: "#E8F5EB", color: "#2E6641" }
                      : { backgroundColor: "#FDE8EA", color: "#B03545" }
                  }
                >
                  {isOnline ? "Online" : "Offline"}
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "#A89BB0" }}>
              Validation Engine
            </p>
            <p className="mt-1.5 text-[17px] font-bold tracking-tight" style={{ color: "#292039" }}>
              ScopeLock AI
            </p>
            <p className="mt-1 text-[12px]" style={{ color: "#83778F" }}>
              Agreement ↔ Invoice comparator
            </p>
          </div>
        </SectionCard>

        {/* AI Provider */}
        <SectionCard>
          <div className="p-5">
            <div className="flex items-start justify-between mb-5">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
              >
                <Brain size={19} />
              </div>
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-bold"
                style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
              >
                Active
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "#A89BB0" }}>
              AI Provider
            </p>
            <p className="mt-1.5 text-[17px] font-bold tracking-tight" style={{ color: "#292039" }}>
              Gemini AI
            </p>
            <p className="mt-1 text-[12px]" style={{ color: "#83778F" }}>
              Document extraction &amp; analysis
            </p>
          </div>
        </SectionCard>

        {/* Payment Gateway */}
        <SectionCard>
          <div className="p-5">
            <div className="flex items-start justify-between mb-5">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
              >
                <CreditCard size={19} />
              </div>
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-bold"
                style={{ backgroundColor: "#FEF3C7", color: "#78510C" }}
              >
                Sandbox
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "#A89BB0" }}>
              Payment Gateway
            </p>
            <p className="mt-1.5 text-[17px] font-bold tracking-tight" style={{ color: "#292039" }}>
              PayPal
            </p>
            <p className="mt-1 text-[12px]" style={{ color: "#83778F" }}>
              Sandbox mode · Test environment
            </p>
          </div>
        </SectionCard>
      </div>

      {/* Start Validation CTA banner */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: "linear-gradient(150deg, #5A4375 0%, #3E2B55 100%)",
          boxShadow: "0 12px 36px rgba(41,32,57,0.16)",
        }}
      >
        <div className="relative flex flex-col items-center px-6 py-12 text-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <LayoutDashboard size={26} color="#FFFFFF" />
          </div>
          <p className="mt-5 text-[19px] font-bold" style={{ color: "#FFFFFF" }}>
            Ready to validate
          </p>
          <p
            className="mt-2 max-w-sm text-[13.5px] leading-relaxed"
            style={{ color: "rgba(255,255,255,0.82)" }}
          >
            Upload an agreement and invoice to run AI-powered document validation and authorize payments safely.
          </p>
          <button
            type="button"
            onClick={onNavigateToValidate}
            className="mt-6 flex items-center gap-2.5 rounded-xl px-6 py-3 text-[14px] font-semibold transition-all hover:opacity-90"
            style={{
              backgroundColor: "#FFFFFF",
              color: "#3E2B55",
              boxShadow: "0 6px 18px rgba(0,0,0,0.16)",
            }}
          >
            Start Validation
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── History Page ─────────────────────────────────────────────────────────────

function HistoryPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="space-y-7"
    >
      <div>
        <h1 className="text-[28px] font-bold tracking-[-0.03em]" style={{ color: "#292039" }}>
          Validation History
        </h1>
        <p className="mt-2 text-[14px]" style={{ color: "#83778F" }}>
          Review past document validations and their outcomes.
        </p>
      </div>

      <SectionCard>
        <CardHeader
          left={<p className="text-[14px] font-semibold" style={{ color: "#292039" }}>All Validations</p>}
        />
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "#F1EBF7", boxShadow: "0 0 0 6px #F7F3FB" }}
          >
            <History size={26} style={{ color: "#7B6191" }} />
          </div>
          <p className="mt-5 text-[15px] font-semibold" style={{ color: "#292039" }}>
            History API not yet available
          </p>
          <p className="mt-2 max-w-sm text-[13px] leading-relaxed" style={{ color: "#83778F" }}>
            Validation records are stored in SQLite but no GET endpoint exists yet. This feature will be available in a future API version.
          </p>
        </div>
      </SectionCard>
    </motion.div>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────

function SettingsPage({ apiUrl }: { apiUrl: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="space-y-7"
    >
      <div>
        <h1 className="text-[28px] font-bold tracking-[-0.03em]" style={{ color: "#292039" }}>
          Settings
        </h1>
        <p className="mt-2 text-[14px]" style={{ color: "#83778F" }}>
          Workspace configuration is managed via environment variables.
        </p>
      </div>

      <SectionCard>
        <CardHeader
          left={<p className="text-[14px] font-semibold" style={{ color: "#292039" }}>Configuration</p>}
        />
        <div className="space-y-5 p-6">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: "#A89BB0" }}
            >
              API Endpoint
            </p>
            <p className="mt-2 font-mono text-[13px]" style={{ color: "#292039" }}>
              {apiUrl}
            </p>
          </div>
          <div
            className="rounded-lg border p-4 text-[13px]"
            style={{ backgroundColor: "#F9F7FC", borderColor: "#EEE7F3", color: "#83778F" }}
          >
            Set{" "}
            <code
              className="rounded px-1.5 py-0.5 font-mono text-[11px]"
              style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
            >
              NEXT_PUBLIC_API_BASE_URL
            </code>{" "}
            in your <code className="font-mono text-[11px]">.env.local</code> to change the backend endpoint.
          </div>
        </div>
      </SectionCard>
    </motion.div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function DocumentAnalyzer() {
  const [activePage, setActivePage] = useState<Page>("validate");
  const [agreement, setAgreement] = useState<File | null>(null);
  const [invoice, setInvoice] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [healthStatus, setHealthStatus] = useState<"loading" | "healthy" | "unhealthy">("loading");
  const [agreementDragOver, setAgreementDragOver] = useState(false);
  const [invoiceDragOver, setInvoiceDragOver] = useState(false);
  const [agreementError, setAgreementError] = useState("");
  const [invoiceError, setInvoiceError] = useState("");
  const [paypalLoading, setPaypalLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((r) => r.json())
      .then((d) => setHealthStatus(d.status === "healthy" ? "healthy" : "unhealthy"))
      .catch(() => setHealthStatus("unhealthy"));
  }, []);

  async function analyzeDocuments() {
    if (!agreement || !invoice) { setError("Please select both files."); return; }
    setLoading(true); setError(""); setResult(null);
    const formData = new FormData();
    formData.append("agreement_file", agreement);
    formData.append("invoice_file", invoice);
    try {
      const response = await fetch(`${API_URL}/documents/analyze`, { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : data.detail?.message || "Document analysis failed.");
      setResult(data as AnalysisResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to connect to the backend.");
    } finally { setLoading(false); }
  }

  async function handleProceedToPayment() {
    if (!result || result.validation.result !== "PASS") return;
    const v = result.validation;
    setPaypalLoading(true);
    try {
      const response = await fetch(`${API_URL}/paypal/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agreed_amount: v.agreed_amount, requested_amount: v.requested_amount,
          agreed_milestone: v.agreed_milestone, requested_milestone: v.requested_milestone,
          agreed_currency: v.agreed_currency, requested_currency: v.requested_currency,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : data.detail?.message || "Order creation failed.");
      if (data.approval_url) window.location.href = data.approval_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "PayPal order creation failed.");
    } finally { setPaypalLoading(false); }
  }

  const { title, description } = PAGE_META[activePage];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F5F9]">
      <Sidebar activePage={activePage} onNavigate={setActivePage} healthStatus={healthStatus} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar title={title} description={description} healthStatus={healthStatus} />
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          <div className="mx-auto w-full max-w-[1060px] px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
            {activePage === "validate" && (
              <ValidatePage
                agreement={agreement}
                setAgreement={setAgreement}
                invoice={invoice}
                setInvoice={setInvoice}
                loading={loading}
                error={error}
                result={result}
                agreementDragOver={agreementDragOver}
                setAgreementDragOver={setAgreementDragOver}
                invoiceDragOver={invoiceDragOver}
                setInvoiceDragOver={setInvoiceDragOver}
                agreementError={agreementError}
                setAgreementError={setAgreementError}
                invoiceError={invoiceError}
                setInvoiceError={setInvoiceError}
                analyzeDocuments={analyzeDocuments}
                handleProceedToPayment={handleProceedToPayment}
                paypalLoading={paypalLoading}
              />
            )}
            {activePage === "overview" && (
              <OverviewPage
                healthStatus={healthStatus}
                onNavigateToValidate={() => setActivePage("validate")}
              />
            )}
            {activePage === "history" && <HistoryPage />}
            {activePage === "settings" && <SettingsPage apiUrl={API_URL} />}
          </div>
        </main>
      </div>
      <MobileNav activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
}
