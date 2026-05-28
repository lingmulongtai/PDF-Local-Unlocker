import type { FileItem } from "../types";
import { FileRow } from "./FileRow";

type FileQueueProps = {
  commonPassword: string;
  disabled?: boolean;
  items: FileItem[];
  onCopyCommonPassword: (id: string) => void;
  onDownload: (id: string) => void;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
  onTogglePasswordVisible: (id: string) => void;
  onUpdatePassword: (id: string, value: string) => void;
};

export function FileQueue({
  commonPassword,
  disabled = false,
  items,
  onCopyCommonPassword,
  onDownload,
  onRemove,
  onRetry,
  onTogglePasswordVisible,
  onUpdatePassword,
}: FileQueueProps) {
  if (items.length === 0) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white/80 p-5 text-sm text-stone-600 shadow-sm">
        The queue is empty.
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {items.map((item) => (
        <FileRow
          commonPassword={commonPassword}
          disabled={disabled}
          item={item}
          key={item.id}
          onCopyCommonPassword={onCopyCommonPassword}
          onDownload={onDownload}
          onRemove={onRemove}
          onRetry={onRetry}
          onTogglePasswordVisible={onTogglePasswordVisible}
          onUpdatePassword={onUpdatePassword}
        />
      ))}
    </section>
  );
}
