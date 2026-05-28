export type UnlockWorkerRequest = {
  type: "unlock";
  id: string;
  fileName: string;
  password: string | null;
  data: ArrayBuffer;
};

export type UnlockWorkerSuccess = {
  type: "success";
  id: string;
  result: "unlocked" | "already-unlocked";
  output: ArrayBuffer;
};

export type UnlockWorkerFailure = {
  type: "failure";
  id: string;
  code: "password-required" | "wrong-password" | "unsupported" | "qpdf-error" | "cancelled" | "unknown";
  message: string;
};

export type UnlockWorkerResponse = UnlockWorkerSuccess | UnlockWorkerFailure;
