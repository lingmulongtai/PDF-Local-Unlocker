import { Archive, Files, Play, RefreshCw, Trash2 } from "lucide-react";
import type { QueueSummary } from "../types";

type ResultActionsProps = {
  disabled?: boolean;
  hasFiles: boolean;
  hasRetryable: boolean;
  hasSuccess: boolean;
  isProcessing: boolean;
  onClearAll: () => void;
  onCancel: () => void;
  onDownloadZip: () => void;
  onDownloadFiles: () => void;
  onRetryFailed: () => void;
  onUnlockAll: () => void;
  summary: QueueSummary;
};

export function ResultActions({
  disabled = false,
  hasFiles,
  hasRetryable,
  hasSuccess,
  isProcessing,
  onCancel,
  onClearAll,
  onDownloadZip,
  onDownloadFiles,
  onRetryFailed,
  onUnlockAll,
  summary,
}: ResultActionsProps) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="grid grid-cols-5 divide-x divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 text-center">
        <SummaryStat label="Total" value={summary.total} />
        <SummaryStat label="Done" value={summary.success} />
        <SummaryStat label="Open" value={summary.notEncrypted} />
        <SummaryStat label="Failed" value={summary.failed} />
        <SummaryStat label="Skip" value={summary.skipped + summary.cancelled} />
      </div>

      <div className="mt-4 space-y-2">
        {isProcessing ? (
          <button
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-rose-700 px-4 text-sm font-medium text-white transition-colors hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-45"
            disabled={disabled}
            onClick={onCancel}
            type="button"
          >
            <Trash2 aria-hidden="true" className="size-4" strokeWidth={1.5} />
            Cancel processing
          </button>
        ) : (
          <button
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!hasFiles || disabled}
            onClick={onUnlockAll}
            type="button"
          >
            <Play aria-hidden="true" className="size-4" strokeWidth={1.5} />
            Unlock PDFs
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            className="inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-800 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!hasRetryable || disabled || isProcessing}
            onClick={onRetryFailed}
            type="button"
          >
            <RefreshCw aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
            Retry failed
          </button>
          <button
            className="inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-800 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!hasSuccess || disabled || isProcessing}
            onClick={onDownloadFiles}
            type="button"
          >
            <Files aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
            Download PDFs
          </button>
          <button
            className="inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-800 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!hasSuccess || disabled || isProcessing}
            onClick={onDownloadZip}
            type="button"
          >
            <Archive aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
            Download ZIP
          </button>
          <button
            className="inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-800 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!hasFiles || disabled || isProcessing}
            onClick={onClearAll}
            type="button"
          >
            <Trash2 aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
            Clear all
          </button>
        </div>
      </div>
    </section>
  );
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-1.5 py-2.5">
      <p className="font-mono text-base font-medium text-zinc-950">{value}</p>
      <p className="mt-0.5 text-[11px] text-zinc-500">{label}</p>
    </div>
  );
}
