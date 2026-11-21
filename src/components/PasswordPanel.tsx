import { Eye, EyeOff, KeyRound, X } from "lucide-react";

type PasswordPanelProps = {
  commonPassword: string;
  disabled?: boolean;
  isVisible: boolean;
  onClear: () => void;
  onToggleVisible: () => void;
  onUpdate: (value: string) => void;
};

export function PasswordPanel({
  commonPassword,
  disabled = false,
  isVisible,
  onClear,
  onToggleVisible,
  onUpdate,
}: PasswordPanelProps) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-zinc-950">Common password</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Applied when a file row has no override.</p>
        </div>
        <KeyRound aria-hidden="true" className="size-4 shrink-0 text-zinc-400" strokeWidth={1.5} />
      </div>
      <div className="flex gap-2">
        <input
          autoComplete="off"
          className="h-10 min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
          disabled={disabled}
          onChange={(event) => onUpdate(event.currentTarget.value)}
          placeholder="Enter known password"
          spellCheck={false}
          type={isVisible ? "text" : "password"}
          value={commonPassword}
        />
        <button
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
          disabled={disabled}
          onClick={onToggleVisible}
          title={isVisible ? "Hide common password" : "Show common password"}
          type="button"
        >
          {isVisible ? (
            <EyeOff aria-hidden="true" className="size-4" strokeWidth={1.5} />
          ) : (
            <Eye aria-hidden="true" className="size-4" strokeWidth={1.5} />
          )}
        </button>
        <button
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
          disabled={disabled || commonPassword.length === 0}
          onClick={onClear}
          title="Clear common password"
          type="button"
        >
          <X aria-hidden="true" className="size-4" strokeWidth={1.5} />
        </button>
      </div>
      <p className="mt-3 text-xs leading-5 text-zinc-500">
        Held in tab memory only and never written to browser storage.
      </p>
    </section>
  );
}
