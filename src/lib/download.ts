export function makeUnlockedFileName(originalName: string, reservedNames = new Set<string>()): string {
  const withoutPdf = originalName.replace(/\.pdf$/i, "");
  const firstChoice = `${withoutPdf}.unlocked.pdf`;

  if (!reservedNames.has(firstChoice)) {
    return firstChoice;
  }

  let index = 2;
  let candidate = `${withoutPdf}.unlocked-${index}.pdf`;

  while (reservedNames.has(candidate)) {
    index += 1;
    candidate = `${withoutPdf}.unlocked-${index}.pdf`;
  }

  return candidate;
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
