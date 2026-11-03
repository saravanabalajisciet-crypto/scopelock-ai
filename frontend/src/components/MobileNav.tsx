"use client";

import { FileCheck2, History, LayoutDashboard, Settings } from "lucide-react";
import type { Page } from "@/components/Sidebar";

interface MobileNavProps {
  activePage: Page;
  onNavigate: (p: Page) => void;
}

const ITEMS: {
  label: string;
  page: Page;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}[] = [
  { label: "Overview", page: "overview", icon: LayoutDashboard },
  { label: "Validate", page: "validate", icon: FileCheck2 },
  { label: "History", page: "history", icon: History },
  { label: "Settings", page: "settings", icon: Settings },
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
      {ITEMS.map(({ label, page, icon: Icon }) => {
        const active = activePage === page;
        return (
          <button
            key={page}
            type="button"
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
            <Icon size={19} strokeWidth={active ? 2.3 : 1.8} />
            <span className="text-[9px] font-bold" style={{ color: "inherit" }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
