import JSZip from "jszip";
import type { FileItem } from "../types";

export const RESULTS_ZIP_NAME = "pdf-local-unlocker-results.zip";

export async function createResultsZip(items: FileItem[]): Promise<Blob> {
  const zip = new JSZip();

  for (const item of items) {
    if (item.status === "success" && item.outputBlob && item.outputName) {
      zip.file(item.outputName, item.outputBlob);
    }
  }

  return zip.generateAsync({ type: "blob" });
}
