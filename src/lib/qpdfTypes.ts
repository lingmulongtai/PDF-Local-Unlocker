export type UnlockWorkerRequest = {
  type: "unlock";
  id: string;
  fileName: string;
  password: string;
  data: ArrayBuffer;
};

export type UnlockWorkerSuccess = {
  type: "success";
  id: string;
  output: ArrayBuffer;
};

export type UnlockWorkerFailure = {
  type: "failure";
  id: string;
  code: "wrong-password" | "unsupported" | "qpdf-error" | "cancelled" | "unknown";
  message: string;
};

export type UnlockWorkerResponse = UnlockWorkerSuccess | UnlockWorkerFailure;
