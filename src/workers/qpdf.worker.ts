import type { UnlockWorkerRequest, UnlockWorkerResponse } from "../lib/qpdfTypes";

const workerScope: DedicatedWorkerGlobalScope = self as DedicatedWorkerGlobalScope;

workerScope.onmessage = (event: MessageEvent<UnlockWorkerRequest>) => {
  const request = event.data;

  if (request.type !== "unlock") {
    return;
  }

  const response: UnlockWorkerResponse = {
    type: "failure",
    id: request.id,
    code: "worker-not-ready",
    message: "The qpdf-wasm unlock engine is not wired yet.",
  };

  workerScope.postMessage(response);
};

export {};
