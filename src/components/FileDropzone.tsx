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
      className={`rounded-lg border border-dashed p-6 transition ${
        isDragging
          ? "border-emerald-400 bg-emerald-50"
          : "border-stone-300 bg-white/85 hover:border-emerald-300"
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
        <div className="rounded-lg bg-emerald-100 p-3 text-emerald-700">
          <UploadCloud aria-hidden="true" className="size-7" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-stone-950">Drop PDF files</h2>
          <p className="mt-1 text-sm text-stone-600">Multiple files are accepted. Non-PDF files are ignored.</p>
        </div>
        <label
          className={`inline-flex cursor-pointer items-center justify-center rounded-lg bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 ${
            disabled ? "pointer-events-none opacity-50" : ""
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
