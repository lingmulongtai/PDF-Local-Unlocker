const PDF_MIME_TYPES = new Set(["application/pdf", "application/x-pdf"]);
export const MAX_PDF_SIZE_BYTES = 100 * 1024 * 1024;

export type FileValidationResult =
  | { ok: true }
  | { ok: false; reason: "not-pdf" | "too-large" };

export function validatePdfFile(file: File): FileValidationResult {
  const lowerName = file.name.toLowerCase();
  const looksLikePdf = lowerName.endsWith(".pdf");
  const hasPdfType = file.type === "" || PDF_MIME_TYPES.has(file.type);

  if (!looksLikePdf || !hasPdfType) {
    return { ok: false, reason: "not-pdf" };
  }

  if (file.size > MAX_PDF_SIZE_BYTES) {
    return { ok: false, reason: "too-large" };
  }

  return { ok: true };
}
