"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Receipt,
  Loader2,
  ShieldCheck,
  Sparkles,
  History,
  Cpu,
  Brain,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import UploadCard from "@/components/UploadCard";
import ValidationResult from "@/components/ValidationResult";

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface AnalysisResponse {
  status: string;
  validation_id: string;
  agreement_file: string;
  invoice_file: string;
  validation: ValidationData;
  agreement_extraction: Record<string, unknown>;
  invoice_extraction: Record<string, unknown>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

const pageMeta: Record<
  "overview" | "validate" | "history" | "settings",
  { title: string; description: string }
> = {
  overview: { title: "Overview", description: "Your payment validation workspace" },
  validate: { title: "Validate Documents", description: "Compare agreements and invoices with AI-powered intelligence." },
  history: { title: "Validation History", description: "Past validation records" },
  settings: { title: "Settings", description: "Workspace configuration" },
};

function validateFile(file: File): string {
  const allowedExt = [".pdf", ".txt"];
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!allowedExt.includes(ext)) return "Only PDF and TXT files are accepted.";
  if (file.size > 5 * 1024 * 1024) return "File must be under 5 MB.";
  return "";
}

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.18, ease: "easeOut" },
} as const;

const ANALYSIS_STAGES = [
  "Reading agreement…",
  "Extracting invoice information…",
  "Comparing financial terms…",
  "Evaluating discrepancies…",
] as const;

// ─── Shared primitives ────────────────────────────────────────────────────────

function Breadcrumb({ path }: { path: string[] }) {
  return (
    <div className="flex items-center gap-1.5">
      {path.map((seg, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && (
            <span className="text-[11px]" style={{ color: "#C2B7CE" }}>/</span>
          )}
          <span
            className="text-[12px] font-medium"
            style={{ color: i === path.length - 1 ? "#55416E" : "#A89BB0" }}
          >
            {seg}
          </span>
        </span>
      ))}
    </div>
  );
}

function PageHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h1
        className="text-[28px] font-bold tracking-[-0.03em] leading-tight"
        style={{ color: "#292039" }}
      >
        {title}
      </h1>
      <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "#83778F" }}>
        {subtitle}
      </p>
    </div>
  );
}

function Card({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-xl border ${className}`}
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#E9E2EF",
        boxShadow: "0 1px 4px rgba(41,32,57,0.06), 0 4px 16px rgba(41,32,57,0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between border-b px-6 py-4 ${className}`}
      style={{ borderColor: "#F0EBF5" }}
    >
      {children}
    </div>
  );
}

// ─── Overview page ────────────────────────────────────────────────────────────

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
    <motion.div {...motionProps} className="space-y-7">
      <Breadcrumb path={["Workspace", "Overview"]} />

      {/* Heading + status row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeading
          title="Good to see you."
          subtitle="Review agreements and invoices before authorizing a payment."
        />

        <div className="shrink-0 pt-1">
          {isLoading ? (
            <div
              className="h-8 w-48 animate-pulse rounded-full"
              style={{ backgroundColor: "#EEE7F3" }}
            />
          ) : isOnline ? (
            <div
              className="flex items-center gap-2 rounded-full border px-4 py-2"
              style={{
                backgroundColor: "#F0F8F2",
                borderColor: "#B8DABD",
                color: "#3D6647",
              }}
            >
              <CheckCircle2 size={13} strokeWidth={2.5} />
              <span className="text-[12px] font-semibold">All systems operational</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 rounded-full border px-4 py-2"
              style={{
                backgroundColor: "#FDE8EA",
                borderColor: "#F4BCBF",
                color: "#B03545",
              }}
            >
              <AlertCircle size={13} strokeWidth={2.5} />
              <span className="text-[12px] font-semibold">Service unavailable</span>
            </div>
          )}
        </div>
      </div>

      {/* System status cards — lg:3-col so they never break before 1024px */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Validation Engine */}
        <Card>
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
              >
                <Cpu size={21} />
              </div>
              {isLoading ? (
                <div
                  className="h-6 w-16 animate-pulse rounded-full"
                  style={{ backgroundColor: "#EEE7F3" }}
                />
              ) : isOnline ? (
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-bold"
                  style={{ backgroundColor: "#F0F8F2", color: "#3D6647" }}
                >
                  Online
                </span>
              ) : (
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-bold"
                  style={{ backgroundColor: "#FDE8EA", color: "#B03545" }}
                >
                  Offline
                </span>
              )}
            </div>
            <div className="mt-5">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{ color: "#A89BB0" }}
              >
                Validation Engine
              </p>
              <p
                className="mt-1.5 text-[18px] font-bold tracking-tight"
                style={{ color: "#292039" }}
              >
                ScopeLock AI
              </p>
              <p className="mt-1 text-[12px]" style={{ color: "#83778F" }}>
                Agreement ↔ Invoice comparator
              </p>
            </div>
          </div>
        </Card>

        {/* AI Provider */}
        <Card>
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
              >
                <Brain size={21} />
              </div>
              <span
                className="rounded-full px-3 py-1 text-[11px] font-bold"
                style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
              >
                Active
              </span>
            </div>
            <div className="mt-5">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{ color: "#A89BB0" }}
              >
                AI Provider
              </p>
              <p
                className="mt-1.5 text-[18px] font-bold tracking-tight"
                style={{ color: "#292039" }}
              >
                Gemini AI
              </p>
              <p className="mt-1 text-[12px]" style={{ color: "#83778F" }}>
                Document extraction &amp; analysis
              </p>
            </div>
          </div>
        </Card>

        {/* Payment Gateway */}
        <Card>
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
              >
                <CreditCard size={21} />
              </div>
              <span
                className="rounded-full px-3 py-1 text-[11px] font-bold"
                style={{ backgroundColor: "#FEF3C7", color: "#92580F" }}
              >
                Sandbox
              </span>
            </div>
            <div className="mt-5">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{ color: "#A89BB0" }}
              >
                Payment Gateway
              </p>
              <p
                className="mt-1.5 text-[18px] font-bold tracking-tight"
                style={{ color: "#292039" }}
              >
                PayPal
              </p>
              <p className="mt-1 text-[12px]" style={{ color: "#83778F" }}>
                Sandbox mode · Test environment
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <div>
            <p className="text-[14px] font-semibold" style={{ color: "#292039" }}>
              Recent Activity
            </p>
            <p className="mt-0.5 text-[12px]" style={{ color: "#83778F" }}>
              Your latest validation runs
            </p>
          </div>
        </CardHeader>

        <div className="flex flex-col items-center px-6 py-16 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: "#F1EBF7",
              boxShadow: "0 0 0 6px #F7F3FB",
            }}
          >
            <History size={30} style={{ color: "#7B6191" }} />
          </div>

          <p
            className="mt-5 text-[15px] font-semibold"
            style={{ color: "#292039" }}
          >
            No validations yet
          </p>
          <p
            className="mt-2 max-w-xs text-[13px] leading-relaxed"
            style={{ color: "#83778F" }}
          >
            Upload an agreement and invoice to run your first AI-powered document validation.
          </p>

          <button
            type="button"
            onClick={onNavigateToValidate}
            className="mt-6 flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-all"
            style={{ backgroundColor: "#55416E", boxShadow: "0 4px 12px rgba(85,65,110,0.25)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#403052";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(64,48,82,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#55416E";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(85,65,110,0.25)";
            }}
          >
            Start Validation
            <ArrowRight size={14} />
          </button>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Validate page ────────────────────────────────────────────────────────────

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

  const filesSelected = [agreement, invoice].filter(Boolean).length;
  const canAnalyze = !!agreement && !!invoice && !loading && !agreementError && !invoiceError;

  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!loading) {
      // Reset via a zero-delay timeout to avoid synchronous setState inside effect body
      const resetId = setTimeout(() => setStageIndex(0), 0);
      return () => clearTimeout(resetId);
    }
    const id = setInterval(
      () => setStageIndex((s) => Math.min(s + 1, ANALYSIS_STAGES.length - 1)),
      1100
    );
    return () => clearInterval(id);
  }, [loading]);

  return (
    <motion.div {...motionProps} className="space-y-7">
      <Breadcrumb path={["Workspace", "Validate Documents"]} />

      <PageHeading
        title="Verify before you pay."
        subtitle="Compare agreements and invoices with AI-powered intelligence. Detect discrepancies before money moves."
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
            >
              <Sparkles size={17} />
            </div>
            <div>
              <p className="text-[14px] font-semibold" style={{ color: "#292039" }}>
                Upload Documents
              </p>
              <p className="text-[12px]" style={{ color: "#83778F" }}>
                PDF or TXT · Max 5 MB each
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[12px]" style={{ color: "#83778F" }}>
            <ShieldCheck size={14} style={{ color: "#55416E" }} />
            Secure processing
          </div>
        </CardHeader>

        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <UploadCard
              title="Agreement Document"
              subtitle="Contract / Agreement"
              description="Upload the signed agreement or contract"
              icon={<FileText size={20} />}
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
              subtitle="Invoice / Bill"
              description="Upload the invoice to compare against the agreement"
              icon={<Receipt size={20} />}
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

          <div className="mt-5 space-y-3">
            <AnimatePresence>
              {loading && (
                <motion.div
                  key="analysis-progress"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-xl border p-5"
                  style={{ backgroundColor: "#FAFAFA", borderColor: "#E9E2EF" }}
                >
                  <p
                    className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: "#A89BB0" }}
                  >
                    Analysis in progress
                  </p>
                  <ul className="space-y-2.5">
                    {ANALYSIS_STAGES.map((stage, i) => (
                      <li
                        key={stage}
                        className="flex items-center gap-3 text-[13px]"
                        style={{ color: i <= stageIndex ? "#292039" : "#C2B7CE" }}
                      >
                        {i < stageIndex ? (
                          /* Past stage: neutral dim filled dot — NOT a check mark (FR-3.2) */
                          <span
                            className="h-3.5 w-3.5 shrink-0 rounded-full"
                            style={{ backgroundColor: "#C2B7CE" }}
                          />
                        ) : i === stageIndex ? (
                          /* Active stage: spinner */
                          <Loader2
                            size={14}
                            className="shrink-0 animate-spin"
                            style={{ color: "#55416E" }}
                          />
                        ) : (
                          /* Future stage: empty circle */
                          <span
                            className="h-3.5 w-3.5 shrink-0 rounded-full border-2"
                            style={{ borderColor: "#D8CCE2" }}
                          />
                        )}
                        {stage}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {[0, 1].map((i) => {
                  const filled = i < filesSelected;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-all"
                        style={{
                          backgroundColor: filled ? "#55416E" : "#EEE7F3",
                          color: filled ? "#FFFFFF" : "#A89BB0",
                        }}
                      >
                        {filled ? "✓" : i + 1}
                      </div>
                      <span className="text-[12px]" style={{ color: filled ? "#55416E" : "#A89BB0" }}>
                        {i === 0 ? "Agreement" : "Invoice"}
                      </span>
                    </div>
                  );
                })}
              </div>
              <span className="text-[12px]" style={{ color: "#83778F" }}>
                {filesSelected} of 2 files ready
              </span>
            </div>

            {/* Analyze button */}
            <button
              type="button"
              onClick={analyzeDocuments}
              disabled={!canAnalyze}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-[14px] font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                backgroundColor: "#55416E",
                boxShadow: canAnalyze
                  ? "0 4px 14px rgba(85,65,110,0.3)"
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (canAnalyze) {
                  e.currentTarget.style.backgroundColor = "#403052";
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(64,48,82,0.35)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#55416E";
                e.currentTarget.style.boxShadow = canAnalyze
                  ? "0 4px 14px rgba(85,65,110,0.3)"
                  : "none";
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
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-3 rounded-xl border p-4 text-[13px]"
              style={{
                backgroundColor: "#FDE8EA",
                borderColor: "#F4BCBF",
                color: "#B03545",
              }}
            >
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}
        </div>
      </Card>

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

// ─── History page ─────────────────────────────────────────────────────────────

function HistoryPage() {
  return (
    <motion.div {...motionProps} className="space-y-7">
      <Breadcrumb path={["Workspace", "Validation History"]} />

      <PageHeading
        title="Validation History"
        subtitle="Review past document validations and their outcomes."
      />

      <Card>
        <CardHeader>
          <div>
            <p className="text-[14px] font-semibold" style={{ color: "#292039" }}>
              All Validations
            </p>
          </div>
        </CardHeader>
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "#F1EBF7", boxShadow: "0 0 0 6px #F7F3FB" }}
          >
            <History size={30} style={{ color: "#7B6191" }} />
          </div>
          <p className="mt-5 text-[15px] font-semibold" style={{ color: "#292039" }}>
            History API not yet available
          </p>
          <p
            className="mt-2 max-w-sm text-[13px] leading-relaxed"
            style={{ color: "#83778F" }}
          >
            The backend does not yet expose a history endpoint. Completed records are stored in the SQLite database but are not yet retrievable through the API.
          </p>
          <p className="mt-3 text-[11px]" style={{ color: "#A89BB0" }}>
            This feature will be available in a future API version.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Settings page ────────────────────────────────────────────────────────────

function SettingsPage({ apiUrl }: { apiUrl: string }) {
  return (
    <motion.div {...motionProps} className="space-y-7">
      <Breadcrumb path={["Workspace", "Settings"]} />

      <PageHeading
        title="Settings"
        subtitle="Workspace configuration is managed via environment variables."
      />

      <Card>
        <CardHeader>
          <p className="text-[14px] font-semibold" style={{ color: "#292039" }}>
            Configuration
          </p>
        </CardHeader>
        <div className="space-y-5 p-6">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.12em]"
              style={{ color: "#A89BB0" }}
            >
              API Endpoint
            </p>
            <p
              className="mt-2 font-mono text-[13px] font-medium"
              style={{ color: "#292039" }}
            >
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
            in your{" "}
            <code className="font-mono text-[11px]">.env.local</code> file to change the backend endpoint.
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DocumentAnalyzer() {
  const [activePage, setActivePage] = useState<
    "overview" | "validate" | "history" | "settings"
  >("overview");
  const [agreement, setAgreement] = useState<File | null>(null);
  const [invoice, setInvoice] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [healthStatus, setHealthStatus] = useState<
    "loading" | "healthy" | "unhealthy"
  >("loading");
  const [agreementDragOver, setAgreementDragOver] = useState(false);
  const [invoiceDragOver, setInvoiceDragOver] = useState(false);
  const [agreementError, setAgreementError] = useState("");
  const [invoiceError, setInvoiceError] = useState("");
  const [paypalLoading, setPaypalLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((r) => r.json())
      .then((d) =>
        setHealthStatus(d.status === "healthy" ? "healthy" : "unhealthy")
      )
      .catch(() => setHealthStatus("unhealthy"));
  }, []);

  async function analyzeDocuments() {
    if (!agreement || !invoice) {
      setError("Please select both files.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    const formData = new FormData();
    formData.append("agreement_file", agreement);
    formData.append("invoice_file", invoice);
    try {
      const response = await fetch(`${API_URL}/documents/analyze`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : data.detail?.message || "Document analysis failed."
        );
      setResult(data as AnalysisResponse);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
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
          agreed_amount: v.agreed_amount,
          requested_amount: v.requested_amount,
          agreed_milestone: v.agreed_milestone,
          requested_milestone: v.requested_milestone,
          agreed_currency: v.agreed_currency,
          requested_currency: v.requested_currency,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail?.message || "Order creation failed.");
      if (data.approval_url) window.location.href = data.approval_url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "PayPal order creation failed."
      );
    } finally {
      setPaypalLoading(false);
    }
  }

  const { title: pageTitle, description: pageDescription } =
    pageMeta[activePage];

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "#F7F5F9" }}
    >
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar title={pageTitle} description={pageDescription} healthStatus={healthStatus} />

        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          <div className="mx-auto w-full max-w-[1160px] px-6 py-8 lg:px-10 lg:py-10">
            {activePage === "overview" && (
              <OverviewPage
                healthStatus={healthStatus}
                onNavigateToValidate={() => setActivePage("validate")}
              />
            )}
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
            {activePage === "history" && <HistoryPage />}
            {activePage === "settings" && <SettingsPage apiUrl={API_URL} />}
          </div>
        </main>
      </div>
      <MobileNav activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
}
