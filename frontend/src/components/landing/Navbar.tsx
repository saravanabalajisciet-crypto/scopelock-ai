"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Menu, X, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Product", href: "#capabilities" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(247,245,249,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid #E9E2EF" : "1px solid transparent",
      }}
    >
      <nav className="mx-auto flex h-16 max-w-[1140px] items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="ScopeLock AI home">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              background: "linear-gradient(135deg, #6B4F87 0%, #3E2B55 100%)",
              boxShadow: "0 2px 8px rgba(85,65,110,0.35)",
            }}
          >
            <ShieldCheck size={16} strokeWidth={2.5} color="#FFFFFF" />
          </div>
          <span
            className="text-[15px] font-bold tracking-tight"
            style={{ color: "#292039" }}
          >
            ScopeLock AI
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[14px] font-medium transition-colors hover:opacity-70"
              style={{ color: "#55416E" }}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/workspace"
            className="rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors"
            style={{ color: "#55416E" }}
          >
            Sign In
          </Link>
          <Link
            href="/workspace"
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold text-white transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #6B4F87 0%, #403052 100%)",
              boxShadow: "0 4px 14px rgba(85,65,110,0.28)",
            }}
          >
            Launch Workspace
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:hidden"
          style={{ color: "#292039" }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {open && (
        <div
          className="md:hidden"
          style={{
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #E9E2EF",
            boxShadow: "0 8px 24px rgba(41,32,57,0.08)",
          }}
        >
          <div className="space-y-1 px-5 py-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors"
                style={{ color: "#292039" }}
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 space-y-2 border-t pt-4" style={{ borderColor: "#E9E2EF" }}>
              <Link
                href="/workspace"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-[14px] font-semibold transition-colors"
                style={{ color: "#55416E" }}
              >
                Sign In
              </Link>
              <Link
                href="/workspace"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-[14px] font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #6B4F87 0%, #403052 100%)" }}
              >
                Launch Workspace
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
