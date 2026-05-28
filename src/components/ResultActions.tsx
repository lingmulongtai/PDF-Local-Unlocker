import { Archive, Play, RefreshCw, Trash2 } from "lucide-react";
import type { QueueSummary } from "../types";

type ResultActionsProps = {
  disabled?: boolean;
  hasFiles: boolean;
  hasRetryable: boolean;
  hasSuccess: boolean;
  isProcessing: boolean;
  onClearAll: () => void;
  onDownloadZip: () => void;
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
  onClearAll,
  onDownloadZip,
  onRetryFailed,
  onUnlockAll,
  summary,
}: ResultActionsProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white/90 p-5 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-4">
        <SummaryStat label="Total" value={summary.total} />
        <SummaryStat label="Success" value={summary.success} />
        <SummaryStat label="Failed" value={summary.failed} />
        <SummaryStat label="Skipped" value={summary.skipped} />
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button
          className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!hasFiles || disabled || isProcessing}
          onClick={onUnlockAll}
          type="button"
        >
          <Play aria-hidden="true" className="size-4" />
          Unlock PDFs
        </button>
        <button
          className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!hasRetryable || disabled || isProcessing}
          onClick={onRetryFailed}
          type="button"
        >
          <RefreshCw aria-hidden="true" className="size-4" />
          Retry failed
        </button>
        <button
          className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!hasSuccess || disabled || isProcessing}
          onClick={onDownloadZip}
          type="button"
        >
          <Archive aria-hidden="true" className="size-4" />
          Download ZIP
        </button>
        <button
          className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!hasFiles || disabled || isProcessing}
          onClick={onClearAll}
          type="button"
        >
          <Trash2 aria-hidden="true" className="size-4" />
          Clear all
        </button>
      </div>
    </section>
  );
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2">
      <p className="text-xs font-medium text-stone-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-stone-950">{value}</p>
    </div>
  );
}
