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
    <article className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_auto] lg:items-start">
        <div className="min-w-0 space-y-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-stone-100 p-2 text-stone-700">
              <FileText aria-hidden="true" className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-stone-950" title={item.name}>
                {item.name}
              </p>
              <p className="mt-1 text-xs text-stone-500">{formatBytes(item.size)}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ProgressPill status={item.status} />
            {item.errorMessage ? (
              <span className="text-xs text-stone-600" role="status">
                {item.errorMessage}
              </span>
            ) : null}
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${Math.max(0, Math.min(item.progress, 100))}%` }}
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
          <button
            className="inline-flex size-10 items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canRetry || disabled}
            onClick={() => onRetry(item.id)}
            title="Retry this file"
            type="button"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
          </button>
          <button
            className="inline-flex size-10 items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled}
            onClick={() => onPreview(item.id)}
            title="Preview PDF"
            type="button"
          >
            <FileSearch aria-hidden="true" className="size-4" />
          </button>
          <button
            className="inline-flex size-10 items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canDownload}
            onClick={() => onDownload(item.id)}
            title="Download unlocked PDF"
            type="button"
          >
            <Download aria-hidden="true" className="size-4" />
          </button>
          <button
            className="inline-flex size-10 items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled}
            onClick={() => onRemove(item.id)}
            title="Remove file"
            type="button"
          >
            <Trash2 aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <input
          autoComplete="off"
          className="min-w-0 rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-stone-50"
          disabled={disabled}
          onChange={(event) => onUpdatePassword(item.id, event.currentTarget.value)}
          placeholder="Optional: different password for this file"
          spellCheck={false}
          type={item.passwordVisible ? "text" : "password"}
          value={item.passwordOverride}
        />
        <button
          className="inline-flex h-11 items-center justify-center rounded-lg border border-stone-300 bg-white px-3 text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          onClick={() => onTogglePasswordVisible(item.id)}
          title={item.passwordVisible ? "Hide file password" : "Show file password"}
          type="button"
        >
          {item.passwordVisible ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
        </button>
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled || commonPassword.trim().length === 0}
          onClick={() => onCopyCommonPassword(item.id)}
          title="Copy common password to this file"
          type="button"
        >
          <Copy aria-hidden="true" className="size-4" />
          <span className="hidden sm:inline">Copy common</span>
        </button>
      </div>
    </article>
  );
}
