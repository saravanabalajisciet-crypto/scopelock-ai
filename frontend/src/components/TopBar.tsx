"use client";

import { Bell, ChevronDown, Search, ShieldCheck } from "lucide-react";

type TopBarProps = {
  title: string;
  description: string;
};

export default function TopBar({ title, description }: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-10 flex h-16 items-center justify-between border-b px-4 backdrop-blur-xl sm:px-6 lg:px-8"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E9E2EF" }}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile brand icon */}
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white lg:hidden"
          style={{ backgroundColor: "#55416E" }}
        >
          <ShieldCheck size={19} />
        </div>

        <div>
          <p className="text-sm font-bold" style={{ color: "#292039" }}>
            {title}
          </p>
          <p className="mt-0.5 text-[11px]" style={{ color: "#83778F" }}>
            {description}
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search — desktop only */}
        <div
          className="hidden h-9 items-center gap-2 rounded-xl border px-3 text-xs md:flex"
          style={{
            borderColor: "#E9E2EF",
            backgroundColor: "#F7F5F9",
            color: "#83778F",
          }}
        >
          <Search size={14} />
          <span>Search workspace</span>
          <span
            className="ml-4 rounded border px-1.5 py-0.5 text-[10px]"
            style={{
              borderColor: "#E9E2EF",
              backgroundColor: "#FFFFFF",
              color: "#83778F",
            }}
          >
            /
          </span>
        </div>

        {/* Notification bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border transition-colors"
          style={{ borderColor: "#E9E2EF", backgroundColor: "#FFFFFF", color: "#83778F" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#FAF8FC")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#FFFFFF")
          }
        >
          <Bell size={17} />
          <span
            className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "#55416E" }}
          />
        </button>

        {/* Divider */}
        <div
          className="h-6 w-px"
          style={{ backgroundColor: "#E9E2EF" }}
          aria-hidden="true"
        />

        {/* Profile section */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ backgroundColor: "#55416E" }}
          >
            SL
          </div>

          <div className="hidden sm:block">
            <p className="text-xs font-bold" style={{ color: "#292039" }}>
              Workspace Admin
            </p>
            <p className="mt-0.5 text-[10px]" style={{ color: "#83778F" }}>
              Administrator
            </p>
          </div>

          <ChevronDown
            size={14}
            className="hidden sm:block"
            style={{ color: "#83778F" }}
          />
        </div>
      </div>
    </header>
  );
}
