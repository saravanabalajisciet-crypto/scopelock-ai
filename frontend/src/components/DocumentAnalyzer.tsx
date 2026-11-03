"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Receipt,
  Loader2,
  ShieldCheck,
  Sparkles,
  History,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import StatusBadge from "@/components/StatusBadge";
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
  overview: {
    title: "Overview",
    description: "Welcome back to your workspace.",
  },
  validate: {
    title: "Validate Documents",
    description: "Compare agreement terms with invoice details.",
  },
  history: {
    title: "Validation History",
    description: "Past validation records.",
  },
  settings: {
    title: "Settings",
    description: "Manage your workspace configuration.",
  },
};

// ─── File validation ──────────────────────────────────────────────────────────

function validateFile(file: File): string {
  const allowed = ["application/pdf", "text/plain"];
  const allowedExt = [".pdf", ".txt"];
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!allowed.includes(file.type) && !allowedExt.includes(ext))
    return "Only PDF and TXT files are accepted.";
  if (file.size > 5 * 1024 * 1024) return "File must be under 5 MB.";
  return "";
}

// ─── Sub-pages ────────────────────────────────────────────────────────────────

const motionProps = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2 },
} as const;

function OverviewPage({
  healthStatus,
  onNavigateToValidate,
}: {
  healthStatus: "loading" | "healthy" | "unhealthy";
  onNavigateToValidate: () => void;
}) {
  return (
    <motion.div {...motionProps} className="space-y-6">
      {/* Breadcrumb */}
      <p className="text-xs font-medium" style={{ color: "#83778F" }}>
        Workspace / Overview
      </p>

      {/* Heading */}
      <div>
        <h2
          className="text-[28px] font-bold tracking-tight"
          style={{ color: "#292039" }}
        >
          Good to see you.
        </h2>
        <p className="mt-1 text-sm" style={{ color: "#83778F" }}>
          Review agreements and invoices before authorizing a payment.
        </p>
      </div>

      {/* System status */}
      <div className="flex flex-wrap items-center gap-3">
        {healthStatus === "loading" && (
          <div
            className="h-6 w-40 animate-pulse rounded-full"
            style={{ backgroundColor: "#E9E2EF" }}
          />
        )}
        {healthStatus === "healthy" && (
          <>
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#4D7958" }}>
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "#4D7958" }}
              />
              All systems operational
            </div>
            <StatusBadge status="operational" />
          </>
        )}
        {healthStatus === "unhealthy" && (
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#C34E5A" }}>
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "#C34E5A" }}
            />
            Service unavailable
          </div>
        )}
        <span
          className="rounded-full px-3 py-1 text-xs font-medium"
          style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
        >
          Analysis service ready
        </span>
      </div>

      {/* Stats row */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Validation Engine", value: "Online", color: "#4D7958" },
          { label: "AI Provider", value: "Gemini AI", color: "#55416E" },
          { label: "Payment Gateway", value: "PayPal Sandbox", color: "#83778F" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-lg border p-4"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E9E2EF" }}
          >
            <p className="text-xs font-medium" style={{ color: "#83778F" }}>
              {label}
            </p>
            <p className="mt-1.5 text-sm font-bold" style={{ color }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E9E2EF" }}
      >
        <p className="mb-4 font-semibold" style={{ color: "#292039" }}>
          Recent Activity
        </p>
        <div className="flex flex-col items-center py-8 text-center">
          <History size={32} style={{ color: "#83778F" }} />
          <p className="mt-3 font-semibold" style={{ color: "#292039" }}>
            No validations yet
          </p>
          <p className="mt-1 text-sm" style={{ color: "#83778F" }}>
            Start your first validation to see results here.
          </p>
          <button
            type="button"
            onClick={onNavigateToValidate}
            className="mt-4 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "#55416E" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#403052")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#55416E")
            }
          >
            Start Validation
          </button>
        </div>
      </div>
    </motion.div>
  );
}

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

  return (
    <motion.div {...motionProps} className="space-y-5">
      {/* Breadcrumb */}
      <p className="text-xs font-medium" style={{ color: "#83778F" }}>
        Workspace / Validate Documents
      </p>

      {/* Section header */}
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
        >
          <Sparkles size={18} />
        </div>
        <div>
          <h2 className="text-lg font-bold" style={{ color: "#292039" }}>
            Payment Validation
          </h2>
          <p className="mt-0.5 text-sm" style={{ color: "#83778F" }}>
            Compare agreement terms with invoice details before authorizing a payment.
          </p>
        </div>
      </div>

      {/* Upload cards */}
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
        />
      </div>

      {/* File info row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs" style={{ color: "#83778F" }}>
          <ShieldCheck size={14} style={{ color: "#55416E" }} />
          Max 5 MB per file · PDF and TXT accepted
        </div>
        <span className="text-xs font-semibold" style={{ color: "#55416E" }}>
          {[agreement, invoice].filter(Boolean).length}/2 files selected
        </span>
      </div>

      {/* Analyze button */}
      <button
        type="button"
        onClick={analyzeDocuments}
        disabled={!agreement || !invoice || loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        style={{ backgroundColor: "#55416E" }}
        onMouseEnter={(e) => {
          if (!e.currentTarget.disabled)
            e.currentTarget.style.backgroundColor = "#403052";
        }}
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#55416E")
        }
      >
        {loading ? (
          <>
            <Loader2 size={17} className="animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <ShieldCheck size={17} />
            Analyze and Validate
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border p-3 text-sm"
          style={{
            backgroundColor: "#FDE8EA",
            borderColor: "#F9C5CA",
            color: "#C34E5A",
          }}
        >
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <ValidationResult
          result={result}
          onProceedToPayment={handleProceedToPayment}
        />
      )}
    </motion.div>
  );
}

function HistoryPage() {
  return (
    <motion.div {...motionProps} className="space-y-5">
      <p className="text-xs font-medium" style={{ color: "#83778F" }}>
        Workspace / Validation History
      </p>
      <div className="flex flex-col items-center py-16 text-center">
        <History size={40} style={{ color: "#83778F" }} />
        <h2 className="mt-4 text-lg font-bold" style={{ color: "#292039" }}>
          No history endpoint available
        </h2>
        <p
          className="mt-2 max-w-md text-sm leading-6"
          style={{ color: "#83778F" }}
        >
          The backend does not yet expose a validation history API. Completed
          validation records are stored in the SQLite database but are not
          retrievable through the current API.
        </p>
        <p className="mt-3 text-xs" style={{ color: "#A89BB0" }}>
          This feature will be available in a future API version.
        </p>
      </div>
    </motion.div>
  );
}

function SettingsPage({ apiUrl }: { apiUrl: string }) {
  return (
    <motion.div {...motionProps} className="space-y-5">
      <p className="text-xs font-medium" style={{ color: "#83778F" }}>
        Workspace / Settings
      </p>
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "#292039" }}>
          Settings
        </h2>
        <p className="mt-1 text-sm" style={{ color: "#83778F" }}>
          Workspace configuration is managed via environment variables.
        </p>
      </div>
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E9E2EF" }}
      >
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#83778F" }}>
              API Endpoint
            </p>
            <p
              className="mt-1 font-mono text-sm"
              style={{ color: "#292039" }}
            >
              {apiUrl}
            </p>
          </div>
          <p className="text-xs" style={{ color: "#83778F" }}>
            Set{" "}
            <code
              className="rounded px-1 py-0.5 text-xs font-mono"
              style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
            >
              NEXT_PUBLIC_API_BASE_URL
            </code>{" "}
            to configure the backend endpoint.
          </p>
        </div>
      </div>
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
    }
  }

  const { title: pageTitle, description: pageDescription } =
    pageMeta[activePage];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F7F5F9" }}>
      <div className="flex">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar title={pageTitle} description={pageDescription} />
          <div className="flex-1 p-6 lg:p-8">
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
              />
            )}
            {activePage === "history" && <HistoryPage />}
            {activePage === "settings" && <SettingsPage apiUrl={API_URL} />}
          </div>
        </div>
      </div>
    </main>
  );
}
