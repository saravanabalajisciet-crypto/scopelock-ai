"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Product", href: "#problem" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: "64px",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E9E2EF",
      }}
    >
      <nav
        className="mx-auto flex h-full max-w-[1100px] items-center justify-between px-6 lg:px-8"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0"
          aria-label="ScopeLock AI home"
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
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
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[14px] font-medium transition-colors"
              style={{ color: "#55416E" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#292039")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#55416E")}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/workspace"
            className="text-[14px] font-medium transition-colors"
            style={{ color: "#55416E" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#292039")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#55416E")}
          >
            Sign In
          </Link>
          <Link
            href="/workspace"
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[14px] font-semibold text-white transition-all"
            style={{ backgroundColor: "#55416E" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3E2B55")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#55416E")}
          >
            Launch Workspace →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden"
          style={{ color: "#55416E" }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          className="absolute inset-x-0 top-[64px] border-b md:hidden"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#E9E2EF",
            zIndex: 49,
          }}
        >
          <div className="space-y-1 px-6 py-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors"
                style={{ color: "#55416E" }}
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 border-t pt-3" style={{ borderColor: "#E9E2EF" }}>
              <Link
                href="/workspace"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors"
                style={{ color: "#55416E" }}
              >
                Sign In
              </Link>
              <Link
                href="/workspace"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center rounded-lg px-5 py-3 text-[14px] font-semibold text-white"
                style={{ backgroundColor: "#55416E" }}
              >
                Launch Workspace →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
