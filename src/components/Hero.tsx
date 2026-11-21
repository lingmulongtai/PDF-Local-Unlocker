import { ShieldCheck } from "lucide-react";

type HeroProps = {
  canProcess?: boolean;
};

export function Hero({ canProcess = true }: HeroProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-medium tracking-[-0.025em] text-zinc-950 sm:text-3xl">
          PDF Local Unlocker
        </h1>
        <p className="max-w-xl text-sm leading-6 text-zinc-600">
          Remove known PDF passwords directly in your browser using qpdf WebAssembly. Files never leave this tab.
        </p>
      </div>
      <div className="inline-flex shrink-0 items-center gap-2 self-start rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 sm:self-auto">
        <ShieldCheck
          aria-hidden="true"
          className={`size-4 ${canProcess ? "text-emerald-700" : "text-rose-600"}`}
          strokeWidth={1.5}
        />
        <span>{canProcess ? "Browser WASM ready · Offline only" : "Browser features missing"}</span>
      </div>
    </header>
  );
}
