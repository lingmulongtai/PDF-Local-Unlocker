import { Ban, KeyRound, Laptop, ShieldCheck } from "lucide-react";

const items = [
  {
    icon: Laptop,
    title: "Local processing",
    text: "PDF bytes stay inside this browser process.",
  },
  {
    icon: KeyRound,
    title: "No password storage",
    text: "Not saved to localStorage, sessionStorage, or IndexedDB.",
  },
  {
    icon: Ban,
    title: "Known passwords only",
    text: "No cracking or password guessing.",
  },
  {
    icon: ShieldCheck,
    title: "Authorized files only",
    text: "Use only for PDFs you own or have permission to unlock.",
  },
];

export function SafetyNotice() {
  return (
    <footer className="grid gap-4 border-t border-zinc-200 pt-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div className="flex items-start gap-2.5" key={item.title}>
            <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-zinc-400" strokeWidth={1.5} />
            <div>
              <h3 className="text-xs font-medium text-zinc-900">{item.title}</h3>
              <p className="mt-0.5 text-xs leading-5 text-zinc-500">{item.text}</p>
            </div>
          </div>
        );
      })}
    </footer>
  );
}
