import { AlertTriangle } from "lucide-react";
import type { BrowserSupportIssue } from "../lib/browserSupport";

type CompatibilityNoticeProps = {
  issues: BrowserSupportIssue[];
};

export function CompatibilityNotice({ issues }: CompatibilityNoticeProps) {
  if (issues.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
      <div className="flex items-start gap-3">
        <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
        <div>
          <p className="font-medium">This browser cannot run local PDF unlocks yet.</p>
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
