import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { BrowserSupportIssue } from "../lib/browserSupport";

type CompatibilityNoticeProps = {
  issues: BrowserSupportIssue[];
};

export function CompatibilityNotice({ issues }: CompatibilityNoticeProps) {
  if (issues.length === 0) {
    return (
      <section className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        <div className="flex items-start gap-3">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>This browser has the local processing features needed for PDF unlocks.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
      <div className="flex items-start gap-3">
        <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <div>
          <p className="font-semibold">This browser cannot run local PDF unlocks yet.</p>
          <ul className="mt-2 space-y-1">
            {issues.map((issue) => (
              <li key={issue.feature}>
                <span className="font-medium">{issue.feature}:</span> {issue.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
