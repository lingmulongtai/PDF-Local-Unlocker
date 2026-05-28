export type FileStatus =
  | "waiting"
  | "processing"
  | "success"
  | "wrong-password"
  | "failed"
  | "skipped";

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
  failed: number;
  skipped: number;
};
