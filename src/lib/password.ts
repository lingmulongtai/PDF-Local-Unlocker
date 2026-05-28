import type { FileItem } from "../types";

export function getPasswordForFile(fileItem: FileItem, commonPassword: string): string | null {
  const individualPassword = fileItem.passwordOverride.trim();

  if (individualPassword) {
    return individualPassword;
  }

  if (commonPassword.trim()) {
    return commonPassword;
  }

  return null;
}
