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
    <section className="rounded-lg border border-stone-200 bg-white/90 p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-stone-950">Common password</h2>
          <p className="mt-1 text-sm text-stone-600">Used when a file row does not have its own password.</p>
        </div>
        <div className="rounded-lg bg-amber-100 p-2 text-amber-800">
          <KeyRound aria-hidden="true" className="size-5" />
        </div>
      </div>
      <div className="flex gap-2">
        <input
          autoComplete="off"
          className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          disabled={disabled}
          onChange={(event) => onUpdate(event.currentTarget.value)}
          placeholder="Enter known password"
          spellCheck={false}
          type={isVisible ? "text" : "password"}
          value={commonPassword}
        />
        <button
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          onClick={onToggleVisible}
          title={isVisible ? "Hide common password" : "Show common password"}
          type="button"
        >
          {isVisible ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
        </button>
        <button
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled || commonPassword.length === 0}
          onClick={onClear}
          title="Clear common password"
          type="button"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
      <p className="mt-3 text-xs leading-5 text-stone-500">
        Passwords are held only in React state for this tab and are not written to browser storage.
      </p>
    </section>
  );
}
