import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  FileText,
  ScanSearch,
  CircleCheck,
  LockKeyhole,
  Scale,
  Globe,
  AlertTriangle,
  Check,
  ChevronRight,
} from "lucide-react";

import Navbar from "@/components/landing/Navbar";
import FooterYear from "@/components/landing/FooterYear";

const steps = [
  {
    number: "01",
    title: "Upload documents",
    description:
      "Add the agreement and invoice you want to verify. ScopeLock reads the financial terms from both.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Analyze with AI",
    description:
      "Compare amounts, currencies, and milestone terms to identify discrepancies before payment.",
    icon: ScanSearch,
  },
  {
    number: "03",
    title: "Make a confident decision",
    description:
      "Get a backend-generated PASS, REVIEW, or BLOCK decision with supporting evidence.",
    icon: CircleCheck,
  },
];

const checks = [
  {
    icon: Scale,
    title: "Amount verification",
    description: "Compare invoice totals against agreed contract amounts.",
  },
  {
    icon: Globe,
    title: "Currency validation",
    description: "Identify currency mismatches between documents.",
  },
  {
    icon: AlertTriangle,
    title: "Milestone checks",
    description: "Flag invoices that don't align with agreed deliverables.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F7FA] text-[#211A2B]">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#EAE6EF]">
        <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-[420px] w-[420px] rounded-full bg-[#E9DFF5] opacity-50 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1240px] grid-cols-[1fr_0.9fr] items-center gap-16 px-10 py-24">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#E2D8ED] bg-white px-3.5 py-2 text-xs font-semibold text-[#654B82]">
              <span className="h-2 w-2 rounded-full bg-[#7B5BA1]" />
              AI-powered payment intelligence
            </div>

            <h1 className="max-w-[650px] text-[56px] font-semibold leading-[1.08] tracking-[-2.8px]">
              Verify the terms.
              <br />
              <span className="text-[#75569A]">Then move money.</span>
            </h1>

            <p className="mt-6 max-w-[530px] text-[17px] leading-8 text-[#746B80]">
              ScopeLock AI compares agreements and invoices to catch
              financial discrepancies before payment authorization.
              Make every payment decision with confidence.
            </p>

            <div className="mt-9 flex items-center gap-4">
              <Link
                href="/workspace"
                className="group inline-flex items-center gap-3 rounded-xl bg-[#5B4278] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(91,66,120,0.20)] transition hover:bg-[#49335F]"
              >
                Open workspace
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-[#E4DFEA] bg-white px-5 py-3.5 text-sm font-semibold text-[#51465F] transition hover:bg-[#F4F0F8]"
              >
                See how it works
                <ChevronRight size={15} />
              </a>
            </div>

            <div className="mt-8 flex items-center gap-6 text-xs text-[#81788D]">
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#5B8B68]" />
                Backend-controlled decisions
              </span>

              <span className="flex items-center gap-2">
                <LockKeyhole size={14} className="text-[#75569A]" />
                Payment safeguards
              </span>
            </div>
          </div>

          {/* PRODUCT PREVIEW */}
          <div className="relative">
            <div className="absolute -inset-5 rounded-[30px] bg-[#EDE5F5] opacity-70 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-[#E6E0EC] bg-white shadow-[0_24px_80px_rgba(40,25,60,0.12)]">
              {/* Window header */}
              <div className="flex items-center justify-between border-b border-[#EEEAF2] bg-[#FCFBFD] px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D9D2E1]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D9D2E1]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D9D2E1]" />
                  </div>
                  <span className="ml-3 text-xs font-medium text-[#8B8298]">
                    ScopeLock / Validation
                  </span>
                </div>

                <ShieldCheck size={17} className="text-[#75569A]" />
              </div>

              <div className="p-7">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-[#93899F]">
                      DOCUMENT VALIDATION
                    </p>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight">
                      Agreement review
                    </h2>
                  </div>

                  <span className="rounded-lg bg-[#F1EBF7] px-3 py-1.5 text-xs font-semibold text-[#6B4D8C]">
                    AI Analysis
                  </span>
                </div>

                {/* Document cards */}
                <div className="mt-7 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#E7E0EF] bg-[#FBF9FD] p-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-[#EDE5F5] p-2">
                        <FileText size={17} className="text-[#75569A]" />
                      </div>
                      <span className="text-xs font-semibold">Agreement</span>
                    </div>

                    <p className="mt-4 truncate text-xs font-medium text-[#51465F]">
                      service-agreement.pdf
                    </p>

                    <p className="mt-1 text-[11px] text-[#948AA0]">
                      PDF document
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E2EAE3] bg-[#FAFCFA] p-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-[#E7F2E8] p-2">
                        <FileText size={17} className="text-[#568362]" />
                      </div>
                      <span className="text-xs font-semibold">Invoice</span>
                    </div>

                    <p className="mt-4 truncate text-xs font-medium text-[#51465F]">
                      invoice.pdf
                    </p>

                    <p className="mt-1 text-[11px] text-[#948AA0]">
                      PDF document
                    </p>
                  </div>
                </div>

                {/* Illustrative result only */}
                <div className="mt-5 rounded-xl border border-[#D8E9DC] bg-[#F5FAF6] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E2F1E5]">
                      <Check size={18} className="text-[#4F805C]" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#315D3B]">
                        Validation result
                      </p>
                      <p className="mt-0.5 text-xs text-[#6E9276]">
                        Decision returned by the backend
                      </p>
                    </div>

                    <span className="ml-auto rounded-md bg-[#DDEFE1] px-3 py-1.5 text-xs font-bold tracking-wide text-[#356542]">
                      PASS
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#DCE9DE] pt-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A9C8D]">
                        Agreement amount
                      </p>
                      <p className="mt-1 text-lg font-semibold text-[#315D3B]">
                        $12,500
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A9C8D]">
                        Invoice amount
                      </p>
                      <p className="mt-1 text-lg font-semibold text-[#315D3B]">
                        $12,500
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#968CA2]">
                  <ShieldCheck size={13} />
                  Illustrative interface preview â€” not a live transaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-10 py-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#80639D]">
                The workflow
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                From documents to decision.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-[#81778F]">
                A simple validation flow designed to catch discrepancies
                before money moves.
              </p>
            </div>

            <Link
              href="/workspace"
              className="mb-1 inline-flex items-center gap-2 text-sm font-semibold text-[#6A4D8A] hover:text-[#49335F]"
            >
              Try the workspace
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {steps.map(({ number, title, description, icon: Icon }) => (
              <div
                key={number}
                className="rounded-2xl border border-[#EAE5F0] bg-[#FCFBFD] p-7 transition hover:border-[#D7C9E6] hover:shadow-[0_8px_28px_rgba(40,25,60,0.05)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#A99AB9]">
                    {number}
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0EAF6] text-[#75569A]">
                    <Icon size={19} />
                  </div>
                </div>

                <h3 className="mt-6 text-lg font-semibold">{title}</h3>

                <p className="mt-3 text-sm leading-7 text-[#81778F]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE CHECK */}
      <section className="border-t border-[#EAE6EF] bg-[#F8F7FA]">
        <div className="mx-auto max-w-[1240px] px-10 py-20">
          <div className="grid grid-cols-[0.8fr_1.2fr] gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#80639D]">
                Financial intelligence
              </p>

              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight">
                Every important term.
                <br />
                <span className="text-[#75569A]">Checked.</span>
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#81778F]">
                ScopeLock compares key financial terms and returns a
                decision based on the validation performed by the backend.
              </p>

              <Link
                href="/workspace"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#5B4278] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#49335F]"
              >
                Validate documents
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="divide-y divide-[#E7E1ED] rounded-2xl border border-[#E7E1ED] bg-white px-6">
              {checks.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-center gap-5 py-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F1EBF7] text-[#75569A]">
                    <Icon size={19} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#81778F]">
                      {description}
                    </p>
                  </div>

                  <Check
                    size={17}
                    className="ml-auto shrink-0 text-[#7B9C83]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-10 py-16">
          <div className="flex items-center justify-between rounded-2xl bg-[#30243F] px-12 py-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C3ADD9]">
                ScopeLock AI
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                Verify before you pay.
              </h2>

              <p className="mt-2 text-sm text-[#D0C6DB]">
                Make your next payment decision with confidence.
              </p>
            </div>

            <Link
              href="/workspace"
              className="inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#49335F] transition hover:bg-[#F1EBF7]"
            >
              Launch workspace
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#EAE6EF] bg-white">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-10 py-7">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#5B4278]">
              <ShieldCheck size={15} className="text-white" />
            </div>

            <span className="text-sm font-semibold">ScopeLock AI</span>
          </div>

          <p className="text-xs text-[#948AA0]">
            Â© <FooterYear /> ScopeLock AI Â· Built for PayPal AI Hackathon
          </p>
        </div>
      </footer>
    </main>
  );
}
