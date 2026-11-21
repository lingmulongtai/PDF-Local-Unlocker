import { UploadCloud } from "lucide-react";
import { useId, useState } from "react";

type FileDropzoneProps = {
  disabled?: boolean;
  onFilesSelected: (files: File[]) => void;
};

export function FileDropzone({ disabled = false, onFilesSelected }: FileDropzoneProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files || disabled) {
      return;
    }

    onFilesSelected(Array.from(files));
  }

  return (
    <section
      className={`rounded-xl border border-dashed p-8 transition-colors ${
        isDragging
          ? "border-emerald-700 bg-emerald-50/40"
          : "border-zinc-300 bg-white hover:border-zinc-400"
      }`}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="inline-flex size-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700">
          <UploadCloud aria-hidden="true" className="size-5" strokeWidth={1.5} />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-medium text-zinc-950">Drop PDF files</h2>
          <p className="text-sm text-zinc-500">Multiple files accepted up to 100 MB each. Non-PDF files are ignored.</p>
        </div>
        <label
          className={`inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 ${
            disabled ? "pointer-events-none opacity-45" : ""
          }`}
          htmlFor={inputId}
        >
          Select PDFs
        </label>
        <input
          accept="application/pdf,.pdf"
          className="sr-only"
          disabled={disabled}
          id={inputId}
          multiple
          onChange={(event) => handleFiles(event.currentTarget.files)}
          type="file"
        />
      </div>
    </section>
  );
}
