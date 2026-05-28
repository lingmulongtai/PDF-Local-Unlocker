import { motion } from "framer-motion";
import { Ban, Files, Laptop, ShieldCheck } from "lucide-react";
import { PrivacyBadge } from "./PrivacyBadge";

export function Hero() {
  return (
    <header className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
        initial={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white/85 px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm">
          <ShieldCheck aria-hidden="true" className="size-4 text-emerald-600" />
          Files never leave your device
        </div>
        <div className="max-w-3xl space-y-3">
          <h1 className="text-4xl font-semibold tracking-normal text-stone-950 sm:text-5xl">
            PDF Local Unlocker
          </h1>
          <p className="max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
            Remove known PDF passwords in your browser, with batch controls and no upload step.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <PrivacyBadge icon={Laptop} label="Browser memory only" />
          <PrivacyBadge icon={Ban} label="No account" tone="stone" />
          <PrivacyBadge icon={Files} label="Batch queue" tone="amber" />
        </div>
      </motion.div>
      <div className="rounded-lg border border-emerald-200 bg-white/80 p-4 shadow-sm backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
            <ShieldCheck aria-hidden="true" className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-950">Local-first safety</p>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              Use only PDFs you own or are authorized to unlock. Passwords are not persisted.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
