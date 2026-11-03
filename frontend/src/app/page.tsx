import Link from "next/link";
import {
  ShieldCheck,
  Scale,
  Globe,
  CheckCircle2,
  ScanText,
  Lock,
  CreditCard,
  FileText,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import FooterYear from "@/components/landing/FooterYear";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F5F9]">
      {/* Navbar — sticky */}
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════ */}
      <section id="hero" className="bg-[#F7F5F9]">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              {/* Eyebrow pill */}
              <span
                className="inline-block rounded-md px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
              >
                Payment Intelligence Platform
              </span>

              {/* H1 */}
              <h1
                className="mt-4 font-bold leading-tight tracking-tight"
                style={{
                  color: "#292039",
                  fontSize: "clamp(36px, 4vw, 44px)",
                }}
              >
                Verify every agreement before money moves.
              </h1>

              {/* Description */}
              <p
                className="mt-4 text-[16px] leading-relaxed max-w-md"
                style={{ color: "#83778F" }}
              >
                ScopeLock AI compares agreements and invoices using AI-powered document intelligence, identifying financial discrepancies before payment authorization.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/workspace"
                  className="inline-flex items-center rounded-lg px-6 py-3 text-[14px] font-semibold text-white transition-colors"
                  style={{ backgroundColor: "#55416E" }}
                >
                  Launch Workspace
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center rounded-lg px-6 py-3 text-[14px] font-semibold transition-colors"
                  style={{
                    border: "1px solid #E9E2EF",
                    color: "#55416E",
                    backgroundColor: "transparent",
                  }}
                >
                  Explore How It Works
                </a>
              </div>

              {/* Trust badges */}
              <div
                className="mt-5 flex flex-wrap items-center gap-4 text-[12px]"
                style={{ color: "#83778F" }}
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} style={{ color: "#4D7958" }} />
                  No mock data
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock size={13} style={{ color: "#55416E" }} />
                  Backend-controlled decisions
                </span>
              </div>
            </div>

            {/* Right: product mockup */}
            <ProductMockup />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PROBLEM
      ═══════════════════════════════════════════════════════════ */}
      <section id="problem" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto max-w-[1100px] px-6 lg:px-8 py-16">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "#78628F" }}
          >
            The Problem
          </p>
          <h2
            className="mt-3 font-bold tracking-tight leading-snug"
            style={{ color: "#292039", fontSize: "clamp(24px, 3vw, 32px)" }}
          >
            An approved invoice doesn&rsquo;t always mean an accurate invoice.
          </h2>
          <p
            className="mt-3 text-[15px] leading-relaxed max-w-2xl"
            style={{ color: "#83778F" }}
          >
            Payment fraud and billing errors cost businesses billions each year. Manual review is
            slow, inconsistent, and prone to human error. ScopeLock AI automates the comparison so
            nothing slips through.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {PROBLEM_CARDS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl bg-white p-6"
                style={{
                  border: "1px solid #E9E2EF",
                  boxShadow:
                    "0 1px 3px rgba(41,32,57,0.06), 0 4px 12px rgba(41,32,57,0.04)",
                }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
                >
                  <Icon size={18} />
                </div>
                <p className="mt-4 text-[15px] font-bold" style={{ color: "#292039" }}>
                  {title}
                </p>
                <p
                  className="mt-1.5 text-[13px] leading-relaxed"
                  style={{ color: "#83778F" }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-[#F7F5F9]">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-8 py-16">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "#78628F" }}
          >
            How It Works
          </p>
          <h2
            className="mt-3 font-bold tracking-tight"
            style={{ color: "#292039", fontSize: "clamp(24px, 3vw, 32px)" }}
          >
            From documents to decision in three steps.
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {HOW_STEPS.map(({ num, title, body }, i) => (
              <div key={num} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white"
                    style={{ backgroundColor: "#55416E" }}
                  >
                    {num}
                  </div>
                  {i < HOW_STEPS.length - 1 && (
                    <div
                      className="hidden md:block h-px flex-1"
                      style={{ backgroundColor: "#E9E2EF" }}
                    />
                  )}
                </div>
                <div>
                  <p className="text-[15px] font-bold" style={{ color: "#292039" }}>
                    {title}
                  </p>
                  <p
                    className="mt-1.5 text-[13px] leading-relaxed"
                    style={{ color: "#83778F" }}
                  >
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          AI CAPABILITIES
      ═══════════════════════════════════════════════════════════ */}
      <section id="capabilities" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto max-w-[1100px] px-6 lg:px-8 py-16">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "#78628F" }}
          >
            Capabilities
          </p>
          <h2
            className="mt-3 font-bold tracking-tight"
            style={{ color: "#292039", fontSize: "clamp(24px, 3vw, 32px)" }}
          >
            Every financial term, verified.
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
                >
                  <Icon size={18} />
                </div>
                <p className="mt-4 text-[15px] font-bold" style={{ color: "#292039" }}>
                  {title}
                </p>
                <p
                  className="mt-1.5 text-[13px] leading-relaxed"
                  style={{ color: "#83778F" }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PAYMENT SECURITY
      ═══════════════════════════════════════════════════════════ */}
      <section id="security" className="bg-[#F7F5F9]">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-8 py-16">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: copy */}
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "#78628F" }}
              >
                Payment Security
              </p>
              <h2
                className="mt-3 font-bold tracking-tight leading-snug"
                style={{ color: "#292039", fontSize: "clamp(22px, 3vw, 30px)" }}
              >
                Payments are authorized by the backend, never the browser.
              </h2>
              <p
                className="mt-4 text-[15px] leading-relaxed"
                style={{ color: "#83778F" }}
              >
                The validation decision is made server-side by ScopeLock&rsquo;s engine. The
                frontend only submits documents and displays the result — it cannot forge an
                approval.
              </p>

              <ul className="mt-8 space-y-5">
                {SECURITY_POINTS.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="flex items-start gap-4">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <p
                        className="text-[14px] font-semibold"
                        style={{ color: "#292039" }}
                      >
                        {title}
                      </p>
                      <p
                        className="mt-0.5 text-[13px] leading-relaxed"
                        style={{ color: "#83778F" }}
                      >
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: flow diagram */}
            <div
              className="rounded-2xl p-6"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E9E2EF",
                boxShadow:
                  "0 1px 3px rgba(41,32,57,0.06), 0 4px 12px rgba(41,32,57,0.04)",
              }}
            >
              {/* PASS box */}
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: "#F2FAF4", border: "1px solid #B8D9BE" }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: "#4D7958" }}
                >
                  Validation Decision
                </p>
                <p className="mt-1 text-[15px] font-bold" style={{ color: "#1E4A2A" }}>
                  PASS — Authorized
                </p>
                <p className="mt-0.5 text-[12px]" style={{ color: "#4D7958" }}>
                  Determined server-side by ScopeLock engine
                </p>
              </div>

              {/* Connector */}
              <div
                className="my-3 flex items-center justify-center gap-2 text-[11px] font-semibold"
                style={{ color: "#78628F" }}
              >
                <span className="h-px flex-1" style={{ backgroundColor: "#E9E2EF" }} />
                <ShieldCheck size={13} style={{ color: "#55416E" }} />
                <span>ScopeLock engine</span>
                <span className="h-px flex-1" style={{ backgroundColor: "#E9E2EF" }} />
              </div>

              {/* PayPal box */}
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: "#F7F5F9", border: "1px solid #E9E2EF" }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: "#A89BB0" }}
                >
                  Payment Gateway
                </p>
                <p className="mt-1 text-[15px] font-bold" style={{ color: "#292039" }}>
                  PayPal Sandbox
                </p>
                <p className="mt-0.5 text-[12px]" style={{ color: "#83778F" }}>
                  Order created and captured via backend API
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #E9E2EF" }}>
        <div className="mx-auto max-w-[1100px] px-6 lg:px-8 py-20 text-center">
          <h2
            className="font-bold tracking-tight"
            style={{ color: "#292039", fontSize: "clamp(24px, 3vw, 32px)" }}
          >
            Verify before you pay.
          </h2>
          <p
            className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed"
            style={{ color: "#83778F" }}
          >
            Upload an agreement and invoice, and let AI verify the terms before any money moves.
          </p>
          <Link
            href="/workspace"
            className="mt-8 inline-flex items-center rounded-lg px-7 py-3 text-[14px] font-semibold text-white transition-colors"
            style={{ backgroundColor: "#55416E" }}
          >
            Launch Workspace
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <footer style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #E9E2EF" }}>
        <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-md"
              style={{
                background: "linear-gradient(135deg, #6B4F87 0%, #3E2B55 100%)",
              }}
            >
              <ShieldCheck size={12} strokeWidth={2.5} color="#FFFFFF" />
            </div>
            <span className="text-[14px] font-bold" style={{ color: "#292039" }}>
              ScopeLock AI
            </span>
          </div>
          <p className="text-[13px]" style={{ color: "#83778F" }}>
            © <FooterYear /> ScopeLock AI · Built for PayPal AI Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ─── Content data ─────────────────────────────────────────────── */

const PROBLEM_CARDS = [
  {
    icon: Scale,
    title: "Amount discrepancies",
    body: "Invoice totals that don't match what was agreed in the contract.",
  },
  {
    icon: Globe,
    title: "Currency mismatches",
    body: "Currency codes that differ between the agreement and the invoice.",
  },
  {
    icon: AlertTriangle,
    title: "Unearned milestones",
    body: "Invoices claiming payment for deliverables not yet completed.",
  },
];

const HOW_STEPS = [
  {
    num: "01",
    title: "Upload Documents",
    body: "Drop your agreement and invoice (PDF or TXT, up to 5 MB each) into the workspace.",
  },
  {
    num: "02",
    title: "AI Analysis",
    body: "Gemini extracts amounts, currencies, and milestones from both documents and compares them.",
  },
  {
    num: "03",
    title: "Validation Decision",
    body: "The backend returns PASS, REVIEW, or BLOCK — unlocking or blocking payment accordingly.",
  },
];

const CAPABILITIES = [
  {
    icon: Scale,
    title: "Amount matching",
    body: "Invoice total compared against the agreed amount from the contract.",
  },
  {
    icon: Globe,
    title: "Currency validation",
    body: "Currency code in the invoice matched against the agreement.",
  },
  {
    icon: CheckCircle2,
    title: "Milestone verification",
    body: "Invoice milestone aligned with the contract terms and deliverables.",
  },
  {
    icon: ScanText,
    title: "AI extraction",
    body: "Gemini structures key financial terms from both documents.",
  },
];

const SECURITY_POINTS = [
  {
    icon: Lock,
    title: "Backend-controlled decision",
    body: "PASS, REVIEW, or BLOCK is determined server-side. The browser cannot forge an approval.",
  },
  {
    icon: ShieldCheck,
    title: "Payment only after PASS",
    body: "Proceed to Payment is shown exclusively when the backend returns a confirmed PASS.",
  },
  {
    icon: CreditCard,
    title: "PayPal Sandbox integration",
    body: "Order creation and capture are handled on the backend through PayPal.",
  },
];

/* ─── Product UI Mockup ────────────────────────────────────────── */

function ProductMockup() {
  return (
    <div className="w-full max-w-[540px] lg:max-w-none">
      {/* Outer card frame */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E9E2EF",
          boxShadow:
            "0 8px 32px rgba(41,32,57,0.10), 0 1px 4px rgba(41,32,57,0.06)",
        }}
      >
        {/* Browser chrome */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ backgroundColor: "#F7F5F9", borderBottom: "1px solid #E9E2EF" }}
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "#A89BB0" }}
          />
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "#A89BB0" }}
          />
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "#A89BB0" }}
          />
          <div
            className="ml-3 flex flex-1 items-center rounded-md px-3 py-1 text-[10px]"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E9E2EF",
              color: "#A89BB0",
            }}
          >
            scopelock.ai/workspace
          </div>
        </div>

        {/* App shell */}
        <div className="flex" style={{ minHeight: "320px" }}>
          {/* Mini sidebar */}
          <div
            className="hidden w-[100px] shrink-0 flex-col p-3 sm:flex"
            style={{ backgroundColor: "#FFFFFF", borderRight: "1px solid #E9E2EF" }}
          >
            {/* Brand */}
            <div className="mb-4 flex items-center gap-1 px-1 py-1">
              <div
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                style={{
                  background:
                    "linear-gradient(135deg, #6B4F87 0%, #3E2B55 100%)",
                }}
              >
                <ShieldCheck size={10} strokeWidth={2.5} color="#FFFFFF" />
              </div>
              <span
                className="truncate text-[9px] font-bold"
                style={{ color: "#292039" }}
              >
                ScopeLock
              </span>
            </div>

            {/* Nav items */}
            <div className="space-y-0.5">
              {[
                { label: "Validate", active: true },
                { label: "Overview", active: false },
                { label: "History", active: false },
                { label: "Settings", active: false },
              ].map(({ label, active }) => (
                <div
                  key={label}
                  className="rounded-md px-2 py-1.5 text-[9px] font-medium"
                  style={{
                    backgroundColor: active ? "#F1EBF7" : "transparent",
                    color: active ? "#55416E" : "#A89BB0",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="min-w-0 flex-1 p-4">
            {/* Page heading */}
            <p className="text-[12px] font-bold" style={{ color: "#292039" }}>
              Verify before you pay.
            </p>
            <p
              className="mb-4 mt-0.5 text-[9px]"
              style={{ color: "#83778F" }}
            >
              AI-powered document validation
            </p>

            {/* Upload cards */}
            <div className="mb-3 grid grid-cols-2 gap-2.5">
              {[
                {
                  label: "Agreement",
                  filename: "service-agreement.pdf",
                  color: "#55416E",
                  bg: "#F1EBF7",
                },
                {
                  label: "Invoice",
                  filename: "invoice-2024.pdf",
                  color: "#4D7958",
                  bg: "#EDF7F0",
                },
              ].map(({ label, filename, color, bg }) => (
                <div
                  key={label}
                  className="rounded-lg p-3"
                  style={{ backgroundColor: bg, border: `1px solid ${color}30` }}
                >
                  <div className="mb-1 flex items-center gap-1.5">
                    <FileText size={10} style={{ color }} />
                    <span
                      className="text-[9px] font-bold"
                      style={{ color }}
                    >
                      {label}
                    </span>
                  </div>
                  <p
                    className="truncate text-[8px]"
                    style={{ color: "#83778F" }}
                  >
                    {filename}
                  </p>
                </div>
              ))}
            </div>

            {/* Analyze button */}
            <div
              className="mb-4 flex items-center justify-center rounded-lg py-2"
              style={{ backgroundColor: "#55416E" }}
            >
              <span className="text-[9px] font-bold text-white">
                Analyze and Validate →
              </span>
            </div>

            {/* PASS result */}
            <div
              className="overflow-hidden rounded-lg"
              style={{ border: "1px solid #B8D9BE", backgroundColor: "#F2FAF4" }}
            >
              <div className="h-0.5" style={{ backgroundColor: "#4D7958" }} />
              <div className="p-3">
                <div className="flex items-start gap-2">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#E6F4EB" }}
                  >
                    <CheckCircle2 size={13} style={{ color: "#4D7958" }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-1.5">
                      <span
                        className="rounded px-1.5 py-0.5 text-[8px] font-black"
                        style={{
                          backgroundColor: "#D9EFE0",
                          color: "#1E4A2A",
                        }}
                      >
                        PASS
                      </span>
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: "#1E4A2A" }}
                      >
                        Validation Passed
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3">
                      <div>
                        <p
                          className="text-[7px] font-bold uppercase"
                          style={{ color: "#83778F" }}
                        >
                          Agreed
                        </p>
                        <p
                          className="text-[10px] font-bold"
                          style={{ color: "#292039" }}
                        >
                          $12,500 USD
                        </p>
                      </div>
                      <div>
                        <p
                          className="text-[7px] font-bold uppercase"
                          style={{ color: "#83778F" }}
                        >
                          Invoice
                        </p>
                        <p
                          className="text-[10px] font-bold"
                          style={{ color: "#292039" }}
                        >
                          $12,500 USD
                        </p>
                      </div>
                    </div>
                    <div
                      className="mt-2 flex items-center justify-between rounded-md px-2 py-1.5"
                      style={{ backgroundColor: "#E6F4EB" }}
                    >
                      <span
                        className="text-[9px] font-semibold"
                        style={{ color: "#1E4A2A" }}
                      >
                        Proceed to Payment
                      </span>
                      <span
                        className="rounded px-2 py-0.5 text-[8px] font-bold text-white"
                        style={{ backgroundColor: "#4D7958" }}
                      >
                        PayPal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Label */}
        <div
          className="flex items-center justify-center py-2"
          style={{
            backgroundColor: "#F7F5F9",
            borderTop: "1px solid #E9E2EF",
          }}
        >
          <span className="text-[9px]" style={{ color: "#A89BB0" }}>
            Interface preview — not a real transaction
          </span>
        </div>
      </div>
    </div>
  );
}
