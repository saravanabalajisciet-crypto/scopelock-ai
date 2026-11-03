import { X } from "lucide-react";
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
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getTypeBadge(file: File): string {
  const ext = file.name.split(".").pop()?.toUpperCase();
  if (ext === "PDF") return "PDF";
  if (ext === "TXT") return "TXT";
  return ext ?? "FILE";
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
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const borderColor = error
    ? "#C34E5A"
    : dragOver
      ? "#55416E"
      : "#D8CCE2";

  const bgColor = error
    ? "#FDF0F2"
    : dragOver
      ? "#F1EBF7"
      : "#FAF8FC";

  const borderStyle = dragOver ? "solid" : "dashed";

  function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleCardClick() {
    if (!file) inputRef.current?.click();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.key === "Enter" || e.key === " ") && !file) {
      inputRef.current?.click();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Upload ${title}`}
      className="relative flex flex-col rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#55416E]"
      style={{
        border: `1.5px ${borderStyle} ${borderColor}`,
        backgroundColor: bgColor,
        minHeight: file ? undefined : "180px",
        cursor: file ? "default" : "pointer",
      }}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        aria-label={`File input for ${title}`}
      />

      {file ? (
        /* File selected state */
        <div className="flex items-center gap-3 p-4">
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
                style={{
                  backgroundColor: "#F1EBF7",
                  color: "#55416E",
                }}
              >
                {getTypeBadge(file)}
              </span>
            </div>
            <p className="mt-0.5 text-xs" style={{ color: "#83778F" }}>
              {formatFileSize(file.size)}
            </p>
          </div>

          <button
            type="button"
            aria-label={`Remove ${file.name}`}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#FDE8EA]"
            style={{ color: "#C34E5A" }}
            onClick={handleRemove}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        /* Empty state */
        <label
          className="flex flex-1 cursor-pointer flex-col p-5"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
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
              style={{ backgroundColor: "#FFFFFF", color: "#83778F" }}
            >
              PDF / TXT
            </span>
          </div>

          <div className="mt-4">
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

          <p
            className="mt-auto pt-3 text-xs"
            style={{ color: dragOver ? "#55416E" : "#A89BB0" }}
          >
            {dragOver ? "Drop file here" : "Click or drag to upload · Max 5 MB"}
          </p>

          <input
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={(e) => onChange(e.target.files?.[0] ?? null)}
            tabIndex={-1}
          />
        </label>
      )}

      {error && (
        <p
          className="px-4 pb-3 text-xs font-medium"
          style={{ color: "#C34E5A" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
