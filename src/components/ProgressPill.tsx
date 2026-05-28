import { AlertTriangle, CheckCircle2, CircleDashed, Loader2 } from "lucide-react";
import type { FileStatus } from "../types";

type ProgressPillProps = {
  status: FileStatus;
};

const statusConfig = {
  waiting: {
    className: "border-stone-200 bg-stone-50 text-stone-700",
    icon: CircleDashed,
    label: "Waiting",
  },
  processing: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: Loader2,
    label: "Processing",
  },
  success: {
    className: "border-teal-200 bg-teal-50 text-teal-800",
    icon: CheckCircle2,
    label: "Success",
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
    className: "border-stone-200 bg-stone-50 text-stone-700",
    icon: AlertTriangle,
    label: "Skipped",
  },
} satisfies Record<FileStatus, { className: string; icon: typeof CircleDashed; label: string }>;

export function ProgressPill({ status }: ProgressPillProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon aria-hidden="true" className={`size-3.5 ${status === "processing" ? "animate-spin" : ""}`} />
      {config.label}
    </span>
  );
}
