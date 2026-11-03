"use client";

import { AlertCircle, Bell, CheckCircle2, ChevronDown, Search, ShieldCheck } from "lucide-react";

interface TopBarProps {
  title: string;
  description: string;
  healthStatus: "loading" | "healthy" | "unhealthy";
}

export default function TopBar({ title, description, healthStatus }: TopBarProps) {
  return (
    <header
      className="flex h-[68px] shrink-0 items-center justify-between px-5 lg:px-7"
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E9E2EF",
      }}
    >
      {/* Left: mobile logo + page info */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg lg:hidden"
          style={{ background: "linear-gradient(135deg, #6B4F87 0%, #3E2B55 100%)" }}
        >
          <ShieldCheck size={16} strokeWidth={2.5} color="#FFFFFF" />
        </div>
        <div className="min-w-0">
          <p
            className="text-[14px] font-semibold leading-none truncate"
            style={{ color: "#292039" }}
          >
            {title}
          </p>
          <p
            className="mt-1 text-[11px] truncate"
            style={{ color: "#A89BB0" }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Right: status + search + bell + profile */}
      <div className="flex items-center gap-2 shrink-0 ml-4">
        {/* Health pill — desktop */}
        <div className="hidden md:block">
          {healthStatus === "loading" && (
            <div
              className="h-7 w-40 animate-pulse rounded-full"
              style={{ backgroundColor: "#EEE7F3" }}
            />
          )}
          {healthStatus === "healthy" && (
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{
                backgroundColor: "#F0F8F2",
                border: "1px solid #B8DABD",
                color: "#2E6641",
              }}
            >
              <CheckCircle2 size={11} strokeWidth={2.5} />
              <span className="text-[11px] font-semibold whitespace-nowrap">All systems operational</span>
            </div>
          )}
          {healthStatus === "unhealthy" && (
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{
                backgroundColor: "#FDE8EA",
                border: "1px solid #F4BCBF",
                color: "#C34E5A",
              }}
            >
              <AlertCircle size={11} strokeWidth={2.5} />
              <span className="text-[11px] font-semibold whitespace-nowrap">Service unavailable</span>
            </div>
          )}
        </div>

        {/* Search — desktop */}
        <div
          className="hidden h-8 cursor-text items-center gap-2 rounded-lg border px-3 text-[12px] lg:flex"
          style={{ borderColor: "#E9E2EF", backgroundColor: "#F7F5F9", color: "#A89BB0" }}
        >
          <Search size={13} />
          <span>Search</span>
          <kbd
            className="ml-2 rounded border px-1.5 py-0.5 text-[10px] font-mono"
            style={{ borderColor: "#E9E2EF", backgroundColor: "#FFFFFF", color: "#A89BB0" }}
          >
            /
          </kbd>
        </div>

        {/* Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
          style={{ borderColor: "#E9E2EF", backgroundColor: "#FFFFFF", color: "#83778F" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F7F5F9")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
        >
          <Bell size={15} />
          <span
            className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "#55416E" }}
          />
        </button>

        {/* Divider */}
        <div
          className="hidden h-5 w-px sm:block"
          style={{ backgroundColor: "#E9E2EF" }}
          aria-hidden
        />

        {/* Profile */}
        <button
          type="button"
          aria-label="Account menu"
          className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F7F5F9")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #6B4F87 0%, #3E2B55 100%)",
              boxShadow: "0 2px 6px rgba(85,65,110,0.3)",
            }}
          >
            SL
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[12px] font-semibold leading-none" style={{ color: "#292039" }}>
              Workspace Admin
            </p>
            <p className="mt-0.5 text-[10px]" style={{ color: "#A89BB0" }}>
              Administrator
            </p>
          </div>
          <ChevronDown size={12} className="hidden sm:block" style={{ color: "#A89BB0" }} />
        </button>
      </div>
    </header>
  );
}
