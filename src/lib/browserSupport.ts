export type BrowserSupportIssue = {
  feature: string;
  message: string;
};

export function getBrowserSupportIssues(): BrowserSupportIssue[] {
  const issues: BrowserSupportIssue[] = [];

  if (typeof WebAssembly === "undefined") {
    issues.push({
      feature: "WebAssembly",
      message: "WASM is required to run qpdf locally.",
    });
  }

  if (typeof Worker === "undefined") {
    issues.push({
      feature: "Web Worker",
      message: "PDF processing runs in a worker so the page can stay responsive.",
    });
  }

  if (typeof Blob === "undefined" || typeof URL === "undefined" || typeof URL.createObjectURL !== "function") {
    issues.push({
      feature: "Blob download",
      message: "Blob URLs are required for local PDF downloads.",
    });
  }

  if (typeof crypto === "undefined" || typeof crypto.randomUUID !== "function") {
    issues.push({
      feature: "Secure IDs",
      message: "crypto.randomUUID is used to create private in-memory queue IDs.",
    });
  }

  return issues;
}
