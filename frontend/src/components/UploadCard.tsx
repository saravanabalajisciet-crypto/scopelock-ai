"use client";

import { Loader2, Upload, X } from "lucide-react";
import type React from "react";
import { useRef } from "react";

type UploadCardProps = {
  title: string;
  subtitle: string;
  description: string;
  file: File | null;
  onChange: (file: File | null) => void;
  icon: React.ReactNode;
  dragOver?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: () => void;
  onDrop?: (e: React.DragEvent) => void;
  error?: string;
  uploading?: boolean;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getTypeBadge(file: File): string {
  const ext = file.name.split(".").pop()?.toUpperCase();
  return ext === "PDF" || ext === "TXT" ? ext : (ext ?? "FILE");
}

export default function UploadCard({
  title,
  subtitle,
  description,
  file,
  onChange,
  icon,
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  error,
  uploading,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const borderColor = error
    ? "#C34E5A"
    : uploading
    ? "#55416E"
    : dragOver
    ? "#55416E"
    : "#D8CCE2";
  const bgColor = error ? "#FDF0F2" : dragOver ? "#F1EBF7" : "#FAF8FC";
  const borderStyle = dragOver ? "solid" : "dashed";

  function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div
      className="relative flex flex-col rounded-xl transition-all duration-200"
      style={{
        border: `1.5px ${borderStyle} ${borderColor}`,
        backgroundColor: bgColor,
        minHeight: "190px",
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Single hidden file input — always present */}
      <input
        ref={inputRef}
        id={`upload-${title.replace(/\s+/g, "-").toLowerCase()}`}
        type="file"
        accept=".pdf,.txt"
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        aria-label={`File input for ${title}`}
      />

      {file ? (
        /* ── File selected state ── */
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
            >
              {icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p
                  className="truncate text-sm font-semibold"
                  style={{ color: "#292039" }}
                >
                  {file.name}
                </p>
                <span
                  className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold"
                  style={{ backgroundColor: "#F1EBF7", color: "#55416E" }}
                >
                  {getTypeBadge(file)}
                </span>
              </div>
              <p className="mt-0.5 text-xs" style={{ color: "#83778F" }}>
                {formatFileSize(file.size)}
              </p>
            </div>

            {/* Remove button — replaced by spinner when uploading */}
            {uploading ? (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                <Loader2 size={14} className="animate-spin" style={{ color: "#55416E" }} />
              </div>
            ) : (
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors"
                style={{ color: "#C34E5A" }}
                onClick={handleRemove}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#FDE8EA")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Replace file link — hidden when uploading */}
          {!uploading && (
            <label
              htmlFor={`upload-${title.replace(/\s+/g, "-").toLowerCase()}`}
              className="mt-auto cursor-pointer pt-4 text-xs font-medium transition-colors"
              style={{ color: "#55416E" }}
            >
              Replace file
            </label>
          )}
        </div>
      ) : (
        /* ── Empty / drag state ── */
        <label
          htmlFor={`upload-${title.replace(/\s+/g, "-").toLowerCase()}`}
          className="flex flex-1 cursor-pointer flex-col p-5"
          aria-label={`Upload ${title}`}
        >
          <div className="flex items-start justify-between">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: "#EEE7F3", color: "#55416E" }}
            >
              {icon}
            </div>
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-medium"
              style={{ backgroundColor: "#FFFFFF", color: "#83778F", border: "1px solid #E9E2EF" }}
            >
              PDF / TXT
            </span>
          </div>

          <div className="mt-4 flex-1">
            <p className="text-sm font-semibold" style={{ color: "#292039" }}>
              {title}
            </p>
            <p className="mt-0.5 text-xs font-medium" style={{ color: "#83778F" }}>
              {subtitle}
            </p>
            <p className="mt-1 text-xs" style={{ color: "#A89BB0" }}>
              {description}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span
              className="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: dragOver ? "#55416E" : "#E3D9E9",
                color: "#55416E",
              }}
            >
              <Upload size={13} />
              {dragOver ? "Drop here" : "Choose file"}
            </span>
            <span className="text-xs" style={{ color: "#A89BB0" }}>
              or drag &amp; drop
            </span>
          </div>
        </label>
      )}

      {error && (
        <p
          role="alert"
          className="px-5 pb-3 text-xs font-medium"
          style={{ color: "#C34E5A" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
