import { AlertTriangle, CheckCircle2, CircleDashed, Loader2 } from "lucide-react";
import type { FileStatus } from "../types";

type ProgressPillProps = {
  status: FileStatus;
};

const statusConfig = {
  waiting: {
    className: "border-zinc-200 bg-zinc-50 text-zinc-700",
    icon: CircleDashed,
    label: "Waiting",
  },
  processing: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: Loader2,
    label: "Processing",
  },
  success: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: CheckCircle2,
    label: "Unlocked",
  },
  "not-encrypted": {
    className: "border-zinc-200 bg-zinc-50 text-zinc-700",
    icon: CheckCircle2,
    label: "Already unlocked",
  },
  "wrong-password": {
    className: "border-amber-200 bg-amber-50 text-amber-900",
    icon: AlertTriangle,
    label: "Wrong password",
  },
  failed: {
    className: "border-rose-200 bg-rose-50 text-rose-800",
    icon: AlertTriangle,
    label: "Failed",
  },
  skipped: {
    className: "border-zinc-200 bg-zinc-50 text-zinc-700",
    icon: AlertTriangle,
    label: "Skipped",
  },
  cancelled: {
    className: "border-zinc-200 bg-zinc-50 text-zinc-700",
    icon: AlertTriangle,
    label: "Cancelled",
  },
} satisfies Record<FileStatus, { className: string; icon: typeof CircleDashed; label: string }>;

export function ProgressPill({ status }: ProgressPillProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${config.className}`}
    >
      <Icon
        aria-hidden="true"
        className={`size-3.5 ${status === "processing" ? "animate-spin" : ""}`}
        strokeWidth={1.5}
      />
      {config.label}
    </span>
  );
}
