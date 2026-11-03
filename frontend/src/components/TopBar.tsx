"use client";

import { AlertCircle, Bell, CheckCircle2, ChevronDown, Search, ShieldCheck } from "lucide-react";

type TopBarProps = {
  title: string;
  description: string;
  healthStatus: "loading" | "healthy" | "unhealthy";
};

export default function TopBar({ title, description, healthStatus }: TopBarProps) {
  return (
    <header
      className="flex h-[68px] shrink-0 items-center justify-between border-b px-5 lg:px-8"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#E9E2EF",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile brand */}
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white lg:hidden"
          style={{ backgroundColor: "#55416E" }}
        >
          <ShieldCheck size={16} />
        </div>

        <div>
          <p
            className="text-[14px] font-semibold leading-none"
            style={{ color: "#292039" }}
          >
            {title}
          </p>
          <p
            className="mt-1 text-[11px]"
            style={{ color: "#A89BB0" }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search — desktop only */}
        <div
          className="hidden h-8 cursor-text items-center gap-2 rounded-lg border px-3 text-[12px] md:flex"
          style={{
            borderColor: "#E9E2EF",
            backgroundColor: "#F7F5F9",
            color: "#A89BB0",
          }}
        >
          <Search size={13} />
          <span>Search workspace</span>
          <kbd
            className="ml-3 rounded border px-1.5 py-0.5 text-[10px] font-mono"
            style={{
              borderColor: "#E9E2EF",
              backgroundColor: "#FFFFFF",
              color: "#A89BB0",
            }}
          >
            /
          </kbd>
        </div>

        {/* Health status pill — desktop only */}
        {healthStatus === "loading" && (
          <div
            className="hidden h-6 w-32 animate-pulse rounded-full md:block"
            style={{ backgroundColor: "#EEE7F3" }}
          />
        )}

        {healthStatus === "healthy" && (
          <div
            className="hidden items-center gap-1.5 rounded-full border px-3 py-1.5 md:flex"
            style={{
              backgroundColor: "#F0F8F2",
              borderColor: "#B8DABD",
              color: "#3D6647",
            }}
          >
            <CheckCircle2 size={11} strokeWidth={2.5} />
            <span className="text-[11px] font-semibold">All systems operational</span>
          </div>
        )}

        {healthStatus === "unhealthy" && (
          <div
            className="hidden items-center gap-1.5 rounded-full border px-3 py-1.5 md:flex"
            style={{
              backgroundColor: "#FDE8EA",
              borderColor: "#F4BCBF",
              color: "#B03545",
            }}
          >
            <AlertCircle size={11} strokeWidth={2.5} />
            <span className="text-[11px] font-semibold">Service unavailable</span>
          </div>
        )}

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
          aria-hidden="true"
        />

        {/* Profile */}
        <button
          type="button"
          aria-label="Account menu"
          className="flex items-center gap-2.5 rounded-lg px-2 py-1 transition-colors"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F7F5F9")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{
              backgroundColor: "#55416E",
              boxShadow: "0 2px 6px rgba(85,65,110,0.3)",
            }}
          >
            SL
          </div>

          <div className="hidden text-left sm:block">
            <p
              className="text-[12px] font-semibold leading-none"
              style={{ color: "#292039" }}
            >
              Workspace Admin
            </p>
            <p
              className="mt-0.5 text-[10px]"
              style={{ color: "#A89BB0" }}
            >
              Administrator
            </p>
          </div>

          <ChevronDown size={13} className="hidden sm:block" style={{ color: "#A89BB0" }} />
        </button>
      </div>
    </header>
  );
}
