"use client";

import { CloudUpload, Loader2, X, FileText, FileCheck2 } from "lucide-react";
import type React from "react";
import { useRef } from "react";

interface UploadCardProps {
  title: string;
  description: string;
  file: File | null;
  onChange: (file: File | null) => void;
  accentColor: string;
  accentBg: string;
  dragOver?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: () => void;
  onDrop?: (e: React.DragEvent) => void;
  error?: string;
  uploading?: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function FileTypeIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return <FileCheck2 size={20} />;
  return <FileText size={20} />;
}

export default function UploadCard({
  title,
  description,
  file,
  onChange,
  accentColor,
  accentBg,
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  error,
  uploading,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = `upload-${title.replace(/\s+/g, "-").toLowerCase()}`;

  function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const hasError = !!error;

  // Border and background vary by state
  const borderColor = hasError ? "#C34E5A" : dragOver ? accentColor : "#D8CCE4";
  const bg = hasError ? "#FEF2F3" : dragOver ? accentBg : "#FCFBFD";
  const ring = dragOver ? `0 0 0 3px ${accentBg}` : "none";

  return (
    <div
      className="relative flex flex-col rounded-xl overflow-hidden transition-all duration-200"
      style={{
        border: `1.5px dashed ${borderColor}`,
        backgroundColor: bg,
        boxShadow: ring,
        minHeight: "220px",
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept=".pdf,.txt"
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        aria-label={`File input for ${title}`}
      />

      {file ? (
        /* ── File selected state ── */
        <div className="flex flex-1 flex-col p-5">
          {/* File info */}
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: accentBg, color: accentColor }}
            >
              {uploading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <FileTypeIcon name={file.name} />
              )}
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <p
                className="text-[14px] font-semibold truncate leading-tight"
                style={{ color: "#292039" }}
              >
                {file.name}
              </p>
              <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase"
                  style={{ backgroundColor: accentBg, color: accentColor }}
                >
                  {file.name.split(".").pop()?.toUpperCase() ?? "FILE"}
                </span>
                <span className="text-[12px]" style={{ color: "#83778F" }}>
                  {formatSize(file.size)}
                </span>
                {uploading && (
                  <span className="text-[11px] font-medium" style={{ color: accentColor }}>
                    Processing…
                  </span>
                )}
              </div>
            </div>

            {!uploading && (
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={handleRemove}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all"
                style={{ color: "#A89BB0" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FDE8EA";
                  e.currentTarget.style.color = "#C34E5A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#A89BB0";
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Document label bar */}
          <div
            className="mt-4 rounded-lg px-3 py-2.5 flex items-center gap-2"
            style={{ backgroundColor: accentBg }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{ backgroundColor: accentColor }}
            />
            <span className="text-[12px] font-semibold" style={{ color: accentColor }}>
              {title}
            </span>
            {!uploading && (
              <label
                htmlFor={inputId}
                className="ml-auto cursor-pointer text-[11px] font-semibold underline-offset-2 hover:underline"
                style={{ color: accentColor }}
              >
                Replace
              </label>
            )}
          </div>

          {/* Fill remaining space to match empty card height */}
          <div className="flex-1" />
        </div>
      ) : (
        /* ── Empty / drag-over state ── */
        <label
          htmlFor={inputId}
          className="flex flex-1 cursor-pointer flex-col items-center justify-center px-6 py-7 text-center select-none"
          aria-label={`Upload ${title}`}
        >
          {/* Centered icon */}
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200"
            style={{
              backgroundColor: dragOver ? accentColor : accentBg,
              color: dragOver ? "#FFFFFF" : accentColor,
              boxShadow: dragOver ? `0 4px 16px ${accentColor}40` : "none",
            }}
          >
            <CloudUpload size={22} />
          </div>

          {/* Title */}
          <p
            className="mt-4 text-[14px] font-bold leading-tight"
            style={{ color: "#292039" }}
          >
            {title}
          </p>

          {/* Description */}
          <p
            className="mt-1.5 text-[12.5px] leading-relaxed max-w-[210px]"
            style={{ color: "#83778F" }}
          >
            {description}
          </p>

          {/* Drag and drop or Browse */}
          <p
            className="mt-3.5 text-[12.5px] font-medium"
            style={{ color: dragOver ? accentColor : "#83778F" }}
          >
            {dragOver ? (
              "Release to upload"
            ) : (
              <>
                Drag and drop or{" "}
                <span
                  className="font-semibold underline underline-offset-2"
                  style={{ color: accentColor }}
                >
                  Browse
                </span>
              </>
            )}
          </p>

          {/* Format hint */}
          <p className="mt-3 text-[11px]" style={{ color: "#B8ADCA" }}>
            PDF or TXT · Max 5 MB
          </p>
        </label>
      )}

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="px-5 pb-4 flex items-center gap-2 text-[12px] font-medium"
          style={{ color: "#C34E5A" }}
        >
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: "#C34E5A" }}
          />
          {error}
        </div>
      )}
    </div>
  );
}
