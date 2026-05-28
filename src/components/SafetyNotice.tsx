import { Ban, KeyRound, Laptop, ShieldCheck } from "lucide-react";

const items = [
  {
    icon: Laptop,
    title: "Local processing",
    text: "PDF bytes stay in the browser process.",
  },
  {
    icon: KeyRound,
    title: "No password storage",
    text: "Password fields are not saved to localStorage, sessionStorage, or IndexedDB.",
  },
  {
    icon: Ban,
    title: "No password guessing",
    text: "This app is only for passwords you already know.",
  },
  {
    icon: ShieldCheck,
    title: "Authorized PDFs only",
    text: "Use it for files you own or have permission to unlock.",
  },
];

export function SafetyNotice() {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <article className="rounded-lg border border-stone-200 bg-white/85 p-4 shadow-sm" key={item.title}>
            <div className="mb-3 inline-flex rounded-lg bg-emerald-100 p-2 text-emerald-700">
              <Icon aria-hidden="true" className="size-5" />
            </div>
            <h3 className="text-sm font-semibold text-stone-950">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p>
          </article>
        );
      })}
    </section>
  );
}
