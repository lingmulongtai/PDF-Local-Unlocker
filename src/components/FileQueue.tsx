import type { FileItem } from "../types";
import { FileRow } from "./FileRow";

type FileQueueProps = {
  commonPassword: string;
  disabled?: boolean;
  items: FileItem[];
  onCopyCommonPassword: (id: string) => void;
  onDownload: (id: string) => void;
  onPreview: (id: string) => void;
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
  onPreview,
  onRemove,
  onRetry,
  onTogglePasswordVisible,
  onUpdatePassword,
}: FileQueueProps) {
  if (items.length === 0) {
    return (
      <section className="rounded-xl border border-zinc-200 bg-white px-5 py-6 text-sm text-zinc-500">
        No files queued yet. Drop or select one or more encrypted PDFs above to start.
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
          onPreview={onPreview}
          onRemove={onRemove}
          onRetry={onRetry}
          onTogglePasswordVisible={onTogglePasswordVisible}
          onUpdatePassword={onUpdatePassword}
        />
      ))}
    </section>
  );
}
