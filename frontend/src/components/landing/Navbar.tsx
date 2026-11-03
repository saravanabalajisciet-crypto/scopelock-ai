"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0B1020]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10">
            <ShieldCheck size={21} className="text-cyan-300" />
          </div>
          <div>
            <span className="block text-[16px] font-semibold tracking-tight text-white">
              ScopeLock<span className="text-cyan-300">.</span>
            </span>
            <span className="block text-[9px] font-medium uppercase tracking-[0.22em] text-slate-500">
              Payment intelligence
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <span className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Payment assurance
          </span>

          <Link
            href="/workspace"
            className="group inline-flex items-center gap-3 rounded-xl border border-cyan-300/20 bg-cyan-400 px-5 py-3 text-[13px] font-semibold text-[#101020] transition-all hover:bg-cyan-300"
          >
            Enter workspace
            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-[#101629] px-6 py-5 md:hidden">
          <div className="mx-auto max-w-[1320px] space-y-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}

            <Link
              href="/workspace"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3.5 text-sm font-semibold text-[#101020]"
            >
              Enter workspace
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
