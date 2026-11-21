import { Download, X } from "lucide-react";

type PdfPreviewProps = {
  fileName: string;
  kind: "original" | "result";
  onClose: () => void;
  onDownload?: () => void;
  url: string;
};

export function PdfPreview({ fileName, kind, onClose, onDownload, url }: PdfPreviewProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/55 p-4 backdrop-blur-sm">
      <section className="flex h-[min(760px,92vh)] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
        <header className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-950" title={fileName}>
              {fileName}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">
              {kind === "result" ? "Result preview" : "Original preview"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              className="inline-flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!onDownload}
              onClick={onDownload}
              title="Download previewed PDF"
              type="button"
            >
              <Download aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </button>
            <button
              className="inline-flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
              onClick={onClose}
              title="Close preview"
              type="button"
            >
              <X aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        </header>
        <iframe className="min-h-0 flex-1 bg-zinc-100" src={url} title={`Preview of ${fileName}`} />
      </section>
    </div>
  );
}
