import type { LucideIcon } from "lucide-react";

type PrivacyBadgeProps = {
  icon: LucideIcon;
  label: string;
  tone?: "mint" | "amber" | "stone";
};

const toneClass = {
  mint: "border-emerald-200 bg-emerald-50 text-emerald-800",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  stone: "border-stone-200 bg-stone-50 text-stone-800",
};

export function PrivacyBadge({ icon: Icon, label, tone = "mint" }: PrivacyBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium ${toneClass[tone]}`}
    >
      <Icon aria-hidden="true" className="size-4" />
      {label}
    </span>
  );
}
