export type FileStatus =
  | "waiting"
  | "processing"
  | "success"
  | "not-encrypted"
  | "wrong-password"
  | "failed"
  | "skipped"
  | "cancelled";

export type FileItem = {
  id: string;
  file: File;
  name: string;
  size: number;
  passwordOverride: string;
  passwordVisible: boolean;
  status: FileStatus;
  progress: number;
  outputBlob?: Blob;
  outputName?: string;
  errorMessage?: string;
};

export type QueueSummary = {
  total: number;
  waiting: number;
  processing: number;
  success: number;
  notEncrypted: number;
  failed: number;
  skipped: number;
  cancelled: number;
};
