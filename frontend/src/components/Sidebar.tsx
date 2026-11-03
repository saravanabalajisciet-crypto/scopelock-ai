"use client";

import {
  ShieldCheck,
  LayoutDashboard,
  FileCheck2,
  History,
  Settings,
  LockKeyhole,
} from "lucide-react";

type Page = "overview" | "validate" | "history" | "settings";

type SidebarProps = {
  activePage: Page;
  onNavigate: (page: Page) => void;
};

const workspaceNav: { label: string; icon: React.ComponentType<{ size?: number }>; page: Page }[] = [
  { label: "Overview", icon: LayoutDashboard, page: "overview" },
  { label: "Validate Documents", icon: FileCheck2, page: "validate" },
  { label: "Validation History", icon: History, page: "history" },
];

const prefNav: { label: string; icon: React.ComponentType<{ size?: number }>; page: Page }[] = [
  { label: "Settings", icon: Settings, page: "settings" },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside
      className="hidden lg:flex w-[252px] shrink-0 flex-col border-r px-5 py-6"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E9E2EF" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-2">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
          style={{ backgroundColor: "#55416E" }}
        >
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="text-[17px] font-bold tracking-tight" style={{ color: "#292039" }}>
            ScopeLock AI
          </p>
          <p
            className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.15em]"
            style={{ color: "#83778F" }}
          >
            Payment Intelligence
          </p>
        </div>
      </div>

      {/* WORKSPACE section */}
      <div className="mt-10">
        <p
          className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em]"
          style={{ color: "#83778F" }}
        >
          Workspace
        </p>
        <nav className="space-y-1">
          {workspaceNav.map(({ label, icon: Icon, page }) => {
            const active = activePage === page;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onNavigate(page)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors duration-150"
                style={{
                  backgroundColor: active ? "#F1EBF7" : "transparent",
                  color: active ? "#55416E" : "#81758D",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "#FAF8FC";
                    e.currentTarget.style.color = "#55416E";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#81758D";
                  }
                }}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* PREFERENCES section */}
      <div className="mt-8">
        <p
          className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em]"
          style={{ color: "#83778F" }}
        >
          Preferences
        </p>
        <nav className="space-y-1">
          {prefNav.map(({ label, icon: Icon, page }) => {
            const active = activePage === page;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onNavigate(page)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors duration-150"
                style={{
                  backgroundColor: active ? "#F1EBF7" : "transparent",
                  color: active ? "#55416E" : "#81758D",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "#FAF8FC";
                    e.currentTarget.style.color = "#55416E";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#81758D";
                  }
                }}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom panel */}
      <div
        className="mt-auto rounded-xl border p-4"
        style={{ borderColor: "#E9E2EF" }}
      >
        <div className="flex items-center gap-2" style={{ color: "#55416E" }}>
          <LockKeyhole size={16} />
          <span className="text-xs font-bold" style={{ color: "#292039" }}>
            Protected Workspace
          </span>
        </div>
        <p className="mt-2 text-[11px] leading-[1.65]" style={{ color: "#83778F" }}>
          Validate documents before payment authorization.
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium" style={{ color: "#4D7958" }}>
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "#4D7958" }}
          />
          Secure processing enabled
        </div>
      </div>
    </aside>
  );
}
