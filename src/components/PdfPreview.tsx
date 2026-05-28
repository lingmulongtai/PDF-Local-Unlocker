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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 p-3 backdrop-blur-sm">
      <section className="flex h-[min(760px,92vh)] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-2xl">
        <header className="flex items-center justify-between gap-3 border-b border-stone-200 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-stone-950" title={fileName}>
              {fileName}
            </p>
            <p className="mt-0.5 text-xs font-medium text-stone-500">
              {kind === "result" ? "Result preview" : "Original preview"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              className="inline-flex size-10 items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!onDownload}
              onClick={onDownload}
              title="Download previewed PDF"
              type="button"
            >
              <Download aria-hidden="true" className="size-4" />
            </button>
            <button
              className="inline-flex size-10 items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-100"
              onClick={onClose}
              title="Close preview"
              type="button"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        </header>
        <iframe className="min-h-0 flex-1 bg-stone-100" src={url} title={`Preview of ${fileName}`} />
      </section>
    </div>
  );
}
