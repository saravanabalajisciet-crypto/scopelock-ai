"use client";

import React from "react";
import {
  FileCheck2,
  History,
  LayoutDashboard,
  Settings,
} from "lucide-react";

type Page = "overview" | "validate" | "history" | "settings";

type MobileNavProps = {
  activePage: Page;
  onNavigate: (p: Page) => void;
};

const items: {
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  page: Page;
}[] = [
  { label: "Overview", icon: LayoutDashboard, page: "overview" },
  { label: "Validate", icon: FileCheck2, page: "validate" },
  { label: "History", icon: History, page: "history" },
  { label: "Settings", icon: Settings, page: "settings" },
];

export default function MobileNav({ activePage, onNavigate }: MobileNavProps) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 flex h-16 border-t lg:hidden"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#E9E2EF",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {items.map(({ label, icon: Icon, page }) => {
        const active = activePage === page;
        return (
          <button
            key={page}
            type="button"
            aria-label={label}
            aria-current={active ? "page" : undefined}
            onClick={() => onNavigate(page)}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors"
            style={{ color: active ? "#55416E" : "#A89BB0" }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.color = "#78628F";
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.color = "#A89BB0";
            }}
          >
            <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
            <span
              className="text-[10px] font-semibold"
              style={{ color: "inherit" }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
