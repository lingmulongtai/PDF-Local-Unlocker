import createQpdfModule, { type QpdfInstance } from "@neslinesli93/qpdf-wasm";
import qpdfWasmUrl from "@neslinesli93/qpdf-wasm/dist/qpdf.wasm?url";
import type { UnlockWorkerFailure, UnlockWorkerRequest, UnlockWorkerResponse } from "../lib/qpdfTypes";

const workerScope: DedicatedWorkerGlobalScope = self as DedicatedWorkerGlobalScope;

type QpdfFs = QpdfInstance["FS"] & {
  stat: (path: string) => { size: number };
  unlink: (path: string) => void;
  writeFile: (path: string, data: Uint8Array) => void;
};

type QpdfRuntime = QpdfInstance & {
  FS: QpdfFs;
};

let qpdfPromise: Promise<QpdfRuntime> | null = null;
let qpdfMessages: string[] = [];

async function getQpdf() {
  if (qpdfPromise) {
    return qpdfPromise;
  }

  qpdfPromise = withCapturedQpdfConsole(() =>
    createQpdfModule({
      locateFile: () => qpdfWasmUrl,
    } as Parameters<typeof createQpdfModule>[0]).then((module) => {
      const qpdf = module as QpdfRuntime;
      ensureDirectory(qpdf, "/work");
      return qpdf;
    }),
  );

  return qpdfPromise;
}

function withCapturedQpdfConsole<T>(callback: () => T): T {
  const originalLog = console.log;
  const originalError = console.error;
  const capture = (...values: unknown[]) => {
    qpdfMessages.push(values.map((value) => String(value)).join(" "));
  };

  // qpdf-wasm binds console methods during initialization, so capture them once inside the worker.
  console.log = capture;
  console.error = capture;

  try {
    return callback();
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
}

function ensureDirectory(qpdf: QpdfRuntime, path: string) {
  try {
    qpdf.FS.mkdir(path);
  } catch {
    // The directory already exists when the worker handles multiple files.
  }
}

function cleanupFile(qpdf: QpdfRuntime, path: string) {
  try {
    qpdf.FS.unlink(path);
  } catch {
    // Missing temporary files are harmless after failed qpdf runs.
  }
}

function classifyFailure(id: string, messages: string[], fallbackCode = "unknown"): UnlockWorkerFailure {
  const text = messages.join("\n");
  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("invalid password") ||
    lowerText.includes("incorrect password") ||
    lowerText.includes("bad password") ||
    lowerText.includes("requires a password")
  ) {
    return {
      type: "failure",
      id,
      code: "wrong-password",
      message: "Wrong password",
    };
  }

  if (lowerText.includes("unsupported") || lowerText.includes("unknown encryption")) {
    return {
      type: "failure",
      id,
      code: "unsupported",
      message: "Unsupported PDF encryption",
    };
  }

  return {
    type: "failure",
    id,
    code: fallbackCode as UnlockWorkerFailure["code"],
    message: "PDF unlock failed",
  };
}

function inspectEncryption(qpdf: QpdfRuntime, inputPath: string): "encrypted" | "not-encrypted" | "unknown" {
  qpdfMessages = [];

  try {
    const exitCode = qpdf.callMain(["--show-encryption", inputPath]);
    const lowerText = qpdfMessages.join("\n").toLowerCase();

    if (exitCode === 0 && lowerText.includes("file is not encrypted")) {
      return "not-encrypted";
    }

    if (exitCode === 0) {
      return "encrypted";
    }

    if (lowerText.includes("invalid password") || lowerText.includes("requires a password")) {
      return "encrypted";
    }
  } catch {
    const lowerText = qpdfMessages.join("\n").toLowerCase();

    if (lowerText.includes("file is not encrypted")) {
      return "not-encrypted";
    }

    if (lowerText.includes("invalid password") || lowerText.includes("requires a password")) {
      return "encrypted";
    }
  }

  return "unknown";
}

async function unlockPdf(request: UnlockWorkerRequest): Promise<UnlockWorkerResponse> {
  const qpdf = await getQpdf();
  const safeId = request.id.replace(/[^a-zA-Z0-9-]/g, "");
  const inputPath = `/work/input-${safeId}.pdf`;
  const outputPath = `/work/output-${safeId}.pdf`;

  try {
    cleanupFile(qpdf, inputPath);
    cleanupFile(qpdf, outputPath);

    qpdf.FS.writeFile(inputPath, new Uint8Array(request.data));
    const encryptionState = inspectEncryption(qpdf, inputPath);

    if (encryptionState === "not-encrypted") {
      const outputBuffer = request.data.slice(0);

      return {
        type: "success",
        id: request.id,
        result: "already-unlocked",
        output: outputBuffer,
      };
    }

    if (!request.password && encryptionState === "encrypted") {
      return {
        type: "failure",
        id: request.id,
        code: "password-required",
        message: "Password required",
      };
    }

    if (!request.password) {
      return {
        type: "failure",
        id: request.id,
        code: "qpdf-error",
        message: "Could not read PDF",
      };
    }

    qpdfMessages = [];
    const exitCode = qpdf.callMain([`--password=${request.password}`, "--decrypt", inputPath, outputPath]);

    if (exitCode !== 0) {
      return classifyFailure(request.id, qpdfMessages, "qpdf-error");
    }

    const output = qpdf.FS.readFile(outputPath);
    const copiedOutput = output.slice();
    const outputBuffer = new ArrayBuffer(copiedOutput.byteLength);
    new Uint8Array(outputBuffer).set(copiedOutput);

    return {
      type: "success",
      id: request.id,
      result: "unlocked",
      output: outputBuffer,
    };
  } catch {
    return classifyFailure(request.id, qpdfMessages, "qpdf-error");
  } finally {
    cleanupFile(qpdf, inputPath);
    cleanupFile(qpdf, outputPath);
  }
}

workerScope.onmessage = (event: MessageEvent<UnlockWorkerRequest>) => {
  const request = event.data;

  if (request.type !== "unlock") {
    return;
  }

  unlockPdf(request)
    .then((response) => {
      if (response.type === "success") {
        workerScope.postMessage(response, [response.output]);
      } else {
        workerScope.postMessage(response);
      }
    })
    .catch(() => {
      const response: UnlockWorkerFailure = {
        type: "failure",
        id: request.id,
        code: "unknown",
        message: "PDF unlock failed",
      };
      workerScope.postMessage(response);
    });
};

export {};
