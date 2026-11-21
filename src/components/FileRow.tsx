import { Copy, Download, Eye, EyeOff, FileSearch, FileText, RotateCcw, Trash2 } from "lucide-react";
import { formatBytes } from "../lib/formatBytes";
import type { FileItem } from "../types";
import { ProgressPill } from "./ProgressPill";

type FileRowProps = {
  commonPassword: string;
  disabled?: boolean;
  item: FileItem;
  onCopyCommonPassword: (id: string) => void;
  onDownload: (id: string) => void;
  onPreview: (id: string) => void;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
  onTogglePasswordVisible: (id: string) => void;
  onUpdatePassword: (id: string, value: string) => void;
};

export function FileRow({
  commonPassword,
  disabled = false,
  item,
  onCopyCommonPassword,
  onDownload,
  onPreview,
  onRemove,
  onRetry,
  onTogglePasswordVisible,
  onUpdatePassword,
}: FileRowProps) {
  const canDownload = (item.status === "success" || item.status === "not-encrypted") && item.outputBlob;
  const canRetry =
    item.status === "failed" ||
    item.status === "wrong-password" ||
    item.status === "skipped" ||
    item.status === "cancelled";

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_auto] lg:items-start">
        <div className="min-w-0 space-y-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-600">
              <FileText aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-950" title={item.name}>
                {item.name}
              </p>
              <p className="mt-0.5 font-mono text-xs text-zinc-500">{formatBytes(item.size)}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ProgressPill status={item.status} />
            {item.errorMessage ? (
              <span className="text-xs text-zinc-600" role="status">
                {item.errorMessage}
              </span>
            ) : null}
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-emerald-700 transition-[width] duration-200"
              style={{ width: `${Math.max(0, Math.min(item.progress, 100))}%` }}
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-start gap-1.5 lg:justify-end">
          <button
            className="inline-flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!canRetry || disabled}
            onClick={() => onRetry(item.id)}
            title="Retry this file"
            type="button"
          >
            <RotateCcw aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </button>
          <button
            className="inline-flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
            disabled={disabled}
            onClick={() => onPreview(item.id)}
            title="Preview PDF"
            type="button"
          >
            <FileSearch aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </button>
          <button
            className="inline-flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!canDownload}
            onClick={() => onDownload(item.id)}
            title="Download unlocked PDF"
            type="button"
          >
            <Download aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </button>
          <button
            className="inline-flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
            disabled={disabled}
            onClick={() => onRemove(item.id)}
            title="Remove file"
            type="button"
          >
            <Trash2 aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <input
          autoComplete="off"
          className="h-10 min-w-0 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 disabled:cursor-not-allowed disabled:bg-zinc-50"
          disabled={disabled}
          onChange={(event) => onUpdatePassword(item.id, event.currentTarget.value)}
          placeholder="Optional: different password for this file"
          spellCheck={false}
          type={item.passwordVisible ? "text" : "password"}
          value={item.passwordOverride}
        />
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
          disabled={disabled}
          onClick={() => onTogglePasswordVisible(item.id)}
          title={item.passwordVisible ? "Hide file password" : "Show file password"}
          type="button"
        >
          {item.passwordVisible ? (
            <EyeOff aria-hidden="true" className="size-4" strokeWidth={1.5} />
          ) : (
            <Eye aria-hidden="true" className="size-4" strokeWidth={1.5} />
          )}
        </button>
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
          disabled={disabled || commonPassword.trim().length === 0}
          onClick={() => onCopyCommonPassword(item.id)}
          title="Copy common password to this file"
          type="button"
        >
          <Copy aria-hidden="true" className="size-4" strokeWidth={1.5} />
          <span className="hidden sm:inline">Copy common</span>
        </button>
      </div>
    </article>
  );
}
