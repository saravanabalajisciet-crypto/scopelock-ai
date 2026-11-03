"use client";

import {
  ShieldCheck,
  LayoutDashboard,
  FileCheck2,
  History,
  Settings,
  LockKeyhole,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export type Page = "overview" | "validate" | "history" | "settings";

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  healthStatus: "loading" | "healthy" | "unhealthy";
}

const NAV: {
  section: string;
  items: {
    label: string;
    page: Page;
    icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  }[];
}[] = [
  {
    section: "WORKSPACE",
    items: [
      { label: "Overview", page: "overview", icon: LayoutDashboard },
      { label: "Validate Documents", page: "validate", icon: FileCheck2 },
      { label: "History", page: "history", icon: History },
    ],
  },
  {
    section: "PREFERENCES",
    items: [{ label: "Settings", page: "settings", icon: Settings }],
  },
];

export default function Sidebar({ activePage, onNavigate, healthStatus }: SidebarProps) {
  return (
    <aside
      className="hidden lg:flex h-full w-[240px] shrink-0 flex-col"
      style={{ backgroundColor: "#FFFFFF", borderRight: "1px solid #E9E2EF" }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid #F0EBF5" }}
      >
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{
            background: "linear-gradient(135deg, #6B4F87 0%, #3E2B55 100%)",
            boxShadow: "0 2px 8px rgba(85,65,110,0.4)",
          }}
        >
          <ShieldCheck size={16} strokeWidth={2.5} color="#FFFFFF" />
        </div>
        <div>
          <p
            className="text-[14px] font-bold tracking-tight leading-none"
            style={{ color: "#292039" }}
          >
            ScopeLock AI
          </p>
          <p
            className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "#A89BB0" }}
          >
            Payment Intelligence
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            <p
              className="mb-1 px-2 text-[9px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "#C2B7CE" }}
            >
              {section}
            </p>
            <div className="space-y-0.5">
              {items.map(({ label, page, icon: Icon }) => {
                const active = activePage === page;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => onNavigate(page)}
                    aria-current={active ? "page" : undefined}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 text-[13px] font-medium transition-all duration-150"
                    style={{
                      height: "40px",
                      backgroundColor: active ? "#F1EBF7" : "transparent",
                      color: active ? "#55416E" : "#83778F",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = "#F7F4FA";
                        e.currentTarget.style.color = "#55416E";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#83778F";
                      }
                    }}
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-all"
                      style={{
                        backgroundColor: active ? "#E4D8F2" : "transparent",
                      }}
                    >
                      <Icon
                        size={14}
                        strokeWidth={active ? 2.3 : 1.9}
                      />
                    </span>
                    {label}
                    {page === "validate" && !active && (
                      <span
                        className="ml-auto rounded-md px-1.5 py-0.5 text-[9px] font-bold"
                        style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
                      >
                        AI
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom panel */}
      <div className="px-3 pb-4">
        <div
          className="rounded-xl p-4"
          style={{
            background: "linear-gradient(135deg, #F5F0FA 0%, #EEE5F5 100%)",
            border: "1px solid #E4D8EF",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <LockKeyhole size={13} style={{ color: "#55416E" }} />
            <span className="text-[11px] font-bold" style={{ color: "#292039" }}>
              Protected Workspace
            </span>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: "#83778F" }}>
            All validations are processed server-side. Payment decisions are never made by the browser.
          </p>

          {/* Status indicator */}
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold">
            {healthStatus === "loading" && (
              <>
                <Loader2 size={10} className="animate-spin" style={{ color: "#A89BB0" }} />
                <span style={{ color: "#A89BB0" }}>Checking status…</span>
              </>
            )}
            {healthStatus === "healthy" && (
              <>
                <CheckCircle2 size={11} strokeWidth={2.5} style={{ color: "#4D7958" }} />
                <span style={{ color: "#4D7958" }}>Secure processing active</span>
              </>
            )}
            {healthStatus === "unhealthy" && (
              <>
                <AlertCircle size={11} strokeWidth={2.5} style={{ color: "#C34E5A" }} />
                <span style={{ color: "#C34E5A" }}>Backend unavailable</span>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
