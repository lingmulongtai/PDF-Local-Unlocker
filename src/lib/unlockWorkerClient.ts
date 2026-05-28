import type { UnlockWorkerFailure, UnlockWorkerRequest, UnlockWorkerResponse } from "./qpdfTypes";

type PendingRequest = {
  reject: (error: UnlockWorkerFailure) => void;
  resolve: (data: ArrayBuffer) => void;
};

let worker: Worker | null = null;
const pending = new Map<string, PendingRequest>();

function getWorker() {
  if (worker) {
    return worker;
  }

  worker = new Worker(new URL("../workers/qpdf.worker.ts", import.meta.url), {
    type: "module",
  });

  worker.addEventListener("message", (event: MessageEvent<UnlockWorkerResponse>) => {
    const response = event.data;
    const request = pending.get(response.id);

    if (!request) {
      return;
    }

    pending.delete(response.id);

    if (response.type === "success") {
      request.resolve(response.output);
    } else {
      request.reject(response);
    }
  });

  worker.addEventListener("error", () => {
    const failure: UnlockWorkerFailure = {
      type: "failure",
      id: "worker",
      code: "unknown",
      message: "The local PDF engine stopped unexpectedly.",
    };

    for (const request of pending.values()) {
      request.reject(failure);
    }

    pending.clear();
    worker?.terminate();
    worker = null;
  });

  return worker;
}

export function cancelActiveUnlocks() {
  if (!worker) {
    return;
  }

  const failure: UnlockWorkerFailure = {
    type: "failure",
    id: "worker",
    code: "cancelled",
    message: "Processing cancelled",
  };

  for (const request of pending.values()) {
    request.reject(failure);
  }

  pending.clear();
  worker.terminate();
  worker = null;
}

export async function unlockPdfInWorker(file: File, password: string, id: string): Promise<ArrayBuffer> {
  const data = await file.arrayBuffer();
  const request: UnlockWorkerRequest = {
    type: "unlock",
    id,
    fileName: file.name,
    password,
    data,
  };

  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    getWorker().postMessage(request, [data]);
  });
}
