import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  FileText,
  Brain,
  Lock,
  Scale,
  Globe,
  ScanText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  CreditCard,
  Zap,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import FooterYear from "@/components/landing/FooterYear";

const CARD_SHADOW = "0 1px 3px rgba(41,32,57,0.06), 0 4px 12px rgba(41,32,57,0.04)";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F5F9" }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-36 sm:pb-24">
        {/* Soft background accents */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(900px 420px at 78% -8%, rgba(120,98,143,0.14), transparent 60%), radial-gradient(700px 380px at 8% 4%, rgba(241,235,247,0.7), transparent 55%)",
          }}
        />
        <div className="mx-auto grid max-w-[1140px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Copy */}
          <div className="max-w-xl">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em]"
              style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "#55416E" }}
              />
              Payment Intelligence Platform
            </span>

            <h1
              className="mt-6 text-[44px] font-bold leading-[1.04] tracking-[-0.035em] sm:text-[56px] lg:text-[64px]"
              style={{ color: "#292039" }}
            >
              Every payment deserves verification.
            </h1>

            <p
              className="mt-6 max-w-lg text-[17px] leading-relaxed"
              style={{ color: "#55416E", opacity: 0.78 }}
            >
              AI-powered agreement and invoice validation that identifies financial
              discrepancies before payments are authorized.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/workspace"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #6B4F87 0%, #403052 100%)",
                  boxShadow: "0 8px 24px rgba(85,65,110,0.28)",
                }}
              >
                Launch Workspace
                <ArrowRight size={16} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-colors"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "#55416E",
                  border: "1px solid #E9E2EF",
                }}
              >
                Explore How It Works
              </a>
            </div>

            <div className="mt-8 flex items-center gap-5 text-[13px]" style={{ color: "#83778F" }}>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} style={{ color: "#4D7958" }} />
                No mock data
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock size={13} style={{ color: "#55416E" }} />
                Backend-controlled decisions
              </span>
            </div>
          </div>

          {/* Product UI mockup */}
          <HeroMockup />
        </div>
      </section>

      {/* ── The Problem ───────────────────────────────────────────── */}
      <section id="problem" className="border-t" style={{ borderColor: "#E9E2EF" }}>
        <div className="mx-auto max-w-[1140px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <span
              className="text-[12px] font-bold uppercase tracking-[0.16em]"
              style={{ color: "#78628F" }}
            >
              The Problem
            </span>
            <h2
              className="mt-3 text-[34px] font-bold leading-tight tracking-[-0.03em] sm:text-[40px]"
              style={{ color: "#292039" }}
            >
              Payment errors are expensive.
            </h2>
            <p
              className="mt-4 max-w-xl text-[16px] leading-relaxed"
              style={{ color: "#55416E", opacity: 0.75 }}
            >
              Invoices regularly diverge from agreed terms. A wrong amount, a mismatched
              currency, or an unearned milestone can slip through manual review and become
              an authorized payment.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {PROBLEM_POINTS.map(({ icon: Icon, title, body }, i) => (
              <div
                key={i}
                className="rounded-2xl p-7"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E9E2EF",
                  boxShadow: CARD_SHADOW,
                }}
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
                >
                  <Icon size={20} />
                </div>
                <h3
                  className="mt-5 text-[18px] font-bold tracking-tight"
                  style={{ color: "#292039" }}
                >
                  {title}
                </h3>
                <p
                  className="mt-2 text-[14px] leading-relaxed"
                  style={{ color: "#83778F" }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section id="how-it-works" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto max-w-[1140px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <span
              className="text-[12px] font-bold uppercase tracking-[0.16em]"
              style={{ color: "#78628F" }}
            >
              How It Works
            </span>
            <h2
              className="mt-3 text-[34px] font-bold leading-tight tracking-[-0.03em] sm:text-[40px]"
              style={{ color: "#292039" }}
            >
              From documents to decision in three steps.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {HOW_STEPS.map(({ step, title, body, icon: Icon }, i) => (
              <div key={step} className="relative">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-[16px] font-bold"
                  style={{
                    background: "linear-gradient(135deg, #6B4F87 0%, #403052 100%)",
                    color: "#FFFFFF",
                    boxShadow: "0 4px 14px rgba(85,65,110,0.25)",
                  }}
                >
                  {step}
                </div>
                <h3
                  className="mt-5 flex items-center gap-2 text-[19px] font-bold tracking-tight"
                  style={{ color: "#292039" }}
                >
                  <Icon size={18} style={{ color: "#55416E" }} />
                  {title}
                </h3>
                <p
                  className="mt-2.5 max-w-xs text-[14px] leading-relaxed"
                  style={{ color: "#83778F" }}
                >
                  {body}
                </p>

                {/* Connector arrow (desktop) */}
                {i < HOW_STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="absolute -right-3 top-6 hidden h-px w-6 md:block"
                    style={{ backgroundColor: "#D8CCE4" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Validation Capabilities ──────────────────────────────── */}
      <section
        id="capabilities"
        className="border-t"
        style={{ borderColor: "#E9E2EF" }}
      >
        <div className="mx-auto max-w-[1140px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <span
              className="text-[12px] font-bold uppercase tracking-[0.16em]"
              style={{ color: "#78628F" }}
            >
              Validation Capabilities
            </span>
            <h2
              className="mt-3 text-[34px] font-bold leading-tight tracking-[-0.03em] sm:text-[40px]"
              style={{ color: "#292039" }}
            >
              Every line item, checked.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map(({ icon: Icon, title, body }, i) => (
              <div
                key={i}
                className="rounded-2xl p-7"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E9E2EF",
                  boxShadow: CARD_SHADOW,
                }}
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
                >
                  <Icon size={20} />
                </div>
                <h3
                  className="mt-5 text-[17px] font-bold tracking-tight"
                  style={{ color: "#292039" }}
                >
                  {title}
                </h3>
                <p
                  className="mt-2 text-[13.5px] leading-relaxed"
                  style={{ color: "#83778F" }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Payment Protection / Security ────────────────────────── */}
      <section id="security" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto max-w-[1140px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span
                className="text-[12px] font-bold uppercase tracking-[0.16em]"
                style={{ color: "#78628F" }}
              >
                Payment Protection
              </span>
              <h2
                className="mt-3 text-[34px] font-bold leading-tight tracking-[-0.03em] sm:text-[40px]"
                style={{ color: "#292039" }}
              >
                Payments are authorized by the backend, never the browser.
              </h2>
              <p
                className="mt-5 max-w-lg text-[16px] leading-relaxed"
                style={{ color: "#55416E", opacity: 0.78 }}
              >
                ScopeLock makes the validation decision server-side. The frontend only
                relays documents and displays the result. A payment can only proceed when
                the backend confirms a PASS, and authorization flows through PayPal.
              </p>

              <ul className="mt-8 space-y-4">
                {SECURITY_POINTS.map(({ icon: Icon, title, body }, i) => (
                  <li key={i} className="flex items-start gap-3.5">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <p
                        className="text-[15px] font-semibold"
                        style={{ color: "#292039" }}
                      >
                        {title}
                      </p>
                      <p
                        className="mt-0.5 text-[14px] leading-relaxed"
                        style={{ color: "#83778F" }}
                      >
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Protection visual */}
            <div
              className="rounded-2xl p-8"
              style={{
                background: "linear-gradient(160deg, #F5F0FA 0%, #EFE6F6 100%)",
                border: "1px solid #E4D8EF",
              }}
            >
              <div
                className="flex items-center gap-3 rounded-xl bg-white p-4"
                style={{ border: "1px solid #E9E2EF", boxShadow: CARD_SHADOW }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "#F2FAF4", color: "#4D7958" }}
                >
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: "#83778F" }}>
                    Decision
                  </p>
                  <p className="text-[16px] font-bold" style={{ color: "#1E4A2A" }}>
                    PASS — Authorized
                  </p>
                </div>
                <span
                  className="ml-auto rounded-full px-3 py-1 text-[11px] font-bold"
                  style={{ backgroundColor: "#D9EFE0", color: "#1E4A2A" }}
                >
                  Server-side
                </span>
              </div>

              <div className="mt-4 flex items-center justify-center gap-3 text-[12px] font-semibold" style={{ color: "#78628F" }}>
                <span className="h-px flex-1" style={{ backgroundColor: "#D8CCE4" }} />
                <ShieldCheck size={14} style={{ color: "#55416E" }} />
                ScopeLock validation engine
                <span className="h-px flex-1" style={{ backgroundColor: "#D8CCE4" }} />
              </div>

              <div
                className="mt-4 flex items-center gap-3 rounded-xl bg-white p-4"
                style={{ border: "1px solid #E9E2EF", boxShadow: CARD_SHADOW }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
                >
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: "#83778F" }}>
                    Payment
                  </p>
                  <p className="text-[16px] font-bold" style={{ color: "#292039" }}>
                    PayPal Sandbox
                  </p>
                </div>
                <span
                  className="ml-auto rounded-full px-3 py-1 text-[11px] font-bold"
                  style={{ backgroundColor: "#FEF3C7", color: "#78510C" }}
                >
                  Test mode
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section className="border-t" style={{ borderColor: "#E9E2EF" }}>
        <div className="mx-auto max-w-[1140px] px-5 py-24 sm:px-8">
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16"
            style={{
              background: "linear-gradient(150deg, #5A4375 0%, #3E2B55 100%)",
              boxShadow: "0 20px 50px rgba(41,32,57,0.18)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(600px 300px at 80% 0%, rgba(241,235,247,0.18), transparent 60%)",
              }}
            />
            <div className="relative">
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <ShieldCheck size={26} color="#FFFFFF" />
              </div>
              <h2
                className="mt-6 text-[34px] font-bold leading-tight tracking-[-0.03em] sm:text-[42px]"
                style={{ color: "#FFFFFF" }}
              >
                Start verifying payments today.
              </h2>
              <p
                className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed"
                style={{ color: "#FFFFFF", opacity: 0.82 }}
              >
                Open the workspace, upload an agreement and an invoice, and let AI verify
                the terms before any money moves.
              </p>
              <Link
                href="/workspace"
                className="mt-9 inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[15px] font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "#3E2B55",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                }}
              >
                Launch Workspace
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #E9E2EF" }}>
        <div className="mx-auto max-w-[1140px] px-5 py-10 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ background: "linear-gradient(135deg, #6B4F87 0%, #3E2B55 100%)" }}
              >
                <ShieldCheck size={14} strokeWidth={2.5} color="#FFFFFF" />
              </div>
              <span
                className="text-[14px] font-bold tracking-tight"
                style={{ color: "#292039" }}
              >
                ScopeLock AI
              </span>
            </div>
            <p className="text-[13px]" style={{ color: "#83778F" }}>
              © <FooterYear /> ScopeLock AI · Built for PayPal AI Hackathon
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Content constants ──────────────────────────────────────────── */

const PROBLEM_POINTS = [
  {
    icon: Scale,
    title: "Amounts drift",
    body: "An invoice total can quietly exceed the agreed amount, turning an approved scope into an overpayment.",
  },
  {
    icon: Globe,
    title: "Currency mismatches",
    body: "When agreement and invoice cite different currencies, manual review rarely catches it before approval.",
  },
  {
    icon: CheckCircle2,
    title: "Unearned milestones",
    body: "Invoices frequently claim milestones that were never agreed or not yet reached, authorizing early payment.",
  },
];

const HOW_STEPS = [
  {
    step: 1,
    title: "Upload Agreement + Invoice",
    body: "Drop the signed agreement and the corresponding invoice into the workspace. PDF or TXT, up to 5 MB each.",
    icon: FileText,
  },
  {
    step: 2,
    title: "AI Extracts and Compares",
    body: "Gemini AI extracts amounts, currencies, and milestones from both documents and compares them line by line.",
    icon: Brain,
  },
  {
    step: 3,
    title: "PASS / REVIEW / BLOCK",
    body: "ScopeLock returns a clear decision. Only a PASS unlocks the option to proceed to PayPal payment authorization.",
    icon: ShieldCheck,
  },
];

const CAPABILITIES = [
  {
    icon: Scale,
    title: "Amount matching",
    body: "Compares the agreed amount against the requested invoice amount and flags any difference.",
  },
  {
    icon: Globe,
    title: "Currency validation",
    body: "Verifies the invoice currency matches the currency named in the agreement.",
  },
  {
    icon: CheckCircle2,
    title: "Milestone verification",
    body: "Checks that the invoice milestone aligns with the milestone defined in the agreement.",
  },
  {
    icon: ScanText,
    title: "AI extraction",
    body: "Gemini reads and structures the key terms from both documents for transparent comparison.",
  },
];

const SECURITY_POINTS = [
  {
    icon: Lock,
    title: "Backend-controlled decision",
    body: "The PASS, REVIEW, or BLOCK verdict is produced by the server. The browser cannot forge an approval.",
  },
  {
    icon: ShieldCheck,
    title: "Payment only after PASS",
    body: "Proceed to Payment is shown exclusively when the backend returns a PASS. Anything else blocks the flow.",
  },
  {
    icon: CreditCard,
    title: "PayPal Sandbox integration",
    body: "Authorized payments route through PayPal, with order creation handled on the backend.",
  },
];

/* ── Hero product mockup (JSX, not an image) ────────────────────── */

function HeroMockup() {
  return (
    <div className="relative">
      {/* Glow */}
      <div
        aria-hidden
        className="absolute -inset-4 -z-10 rounded-[28px]"
        style={{
          background:
            "radial-gradient(420px 240px at 70% 10%, rgba(120,98,143,0.22), transparent 70%)",
        }}
      />
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E9E2EF",
          boxShadow: "0 12px 40px rgba(41,32,57,0.12)",
        }}
      >
        {/* Window chrome */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: "1px solid #F0EBF5" }}
        >
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#E9E2EF" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#E9E2EF" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#E9E2EF" }} />
          <span className="ml-2 text-[11px] font-medium" style={{ color: "#A89BB0" }}>
            scopelock.ai/workspace
          </span>
        </div>

        <div className="flex">
          {/* Mini sidebar */}
          <div
            className="hidden w-[148px] shrink-0 flex-col p-3 sm:flex"
            style={{ borderRight: "1px solid #F0EBF5", backgroundColor: "#FBFAFC" }}
          >
            <div className="flex items-center gap-2 px-1.5 py-1">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-md"
                style={{ background: "linear-gradient(135deg, #6B4F87 0%, #3E2B55 100%)" }}
              >
                <ShieldCheck size={12} strokeWidth={2.5} color="#FFFFFF" />
              </div>
              <span className="text-[11px] font-bold" style={{ color: "#292039" }}>
                ScopeLock
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <div
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-medium"
                style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
              >
                <CheckCircle2 size={11} />
                Validate
              </div>
              <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px]" style={{ color: "#A89BB0" }}>
                <FileText size={11} />
                Overview
              </div>
              <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px]" style={{ color: "#A89BB0" }}>
                <Zap size={11} />
                History
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: "#A89BB0" }}>
              Validation Result
            </p>

            {/* PASS banner */}
            <div
              className="mt-3 overflow-hidden rounded-xl"
              style={{ border: "1px solid #B8D9BE", backgroundColor: "#F2FAF4" }}
            >
              <div className="h-1" style={{ backgroundColor: "#4D7958" }} />
              <div className="flex items-center gap-3 p-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "#E6F4EB", color: "#4D7958" }}
                >
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <span
                    className="rounded-md px-2 py-0.5 text-[10px] font-black tracking-[0.1em]"
                    style={{ backgroundColor: "#D9EFE0", color: "#1E4A2A" }}
                  >
                    PASS
                  </span>
                  <p className="mt-1 text-[14px] font-bold" style={{ color: "#1E4A2A" }}>
                    Validation Passed
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison */}
            <div
              className="mt-3 grid grid-cols-2 overflow-hidden rounded-xl"
              style={{ border: "1px solid #E9E2EF", backgroundColor: "#FFFFFF" }}
            >
              <div className="p-3.5" style={{ borderRight: "1px solid #F0EBF5" }}>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: "#A89BB0" }}>
                  Agreed
                </p>
                <p className="mt-1.5 text-[15px] font-bold" style={{ color: "#292039" }}>
                  $12,500 USD
                </p>
              </div>
              <div className="p-3.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: "#A89BB0" }}>
                  Invoice
                </p>
                <p className="mt-1.5 text-[15px] font-bold" style={{ color: "#292039" }}>
                  $12,500 USD
                </p>
              </div>
            </div>

            {/* Proceed to payment */}
            <div
              className="mt-3 flex items-center justify-between rounded-xl p-3.5"
              style={{ backgroundColor: "#F2FAF4", border: "1px solid #B8D9BE" }}
            >
              <span className="text-[12px] font-semibold" style={{ color: "#1E4A2A" }}>
                Proceed to Payment
              </span>
              <span
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white"
                style={{ backgroundColor: "#4D7958" }}
              >
                <CreditCard size={12} />
                PayPal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating review/block chips */}
      <div
        className="absolute -left-4 bottom-8 hidden items-center gap-2 rounded-xl bg-white px-3 py-2 sm:flex"
        style={{ border: "1px solid #E9E2EF", boxShadow: "0 8px 24px rgba(41,32,57,0.1)" }}
      >
        <AlertTriangle size={14} style={{ color: "#B7791F" }} />
        <span className="text-[11px] font-semibold" style={{ color: "#6B4A0E" }}>
          REVIEW
        </span>
      </div>
      <div
        className="absolute -right-4 top-10 hidden items-center gap-2 rounded-xl bg-white px-3 py-2 sm:flex"
        style={{ border: "1px solid #E9E2EF", boxShadow: "0 8px 24px rgba(41,32,57,0.1)" }}
      >
        <XCircle size={14} style={{ color: "#C34E5A" }} />
        <span className="text-[11px] font-semibold" style={{ color: "#7A1520" }}>
          BLOCK
        </span>
      </div>
    </div>
  );
}
