import { useMemo, useState } from "react";
import { FileDropzone } from "./components/FileDropzone";
import { FileQueue } from "./components/FileQueue";
import { Hero } from "./components/Hero";
import { PasswordPanel } from "./components/PasswordPanel";
import { ResultActions } from "./components/ResultActions";
import { SafetyNotice } from "./components/SafetyNotice";
import { downloadBlob, makeUnlockedFileName } from "./lib/download";
import { validatePdfFile } from "./lib/fileValidation";
import { getPasswordForFile } from "./lib/password";
import { unlockPdfInWorker } from "./lib/unlockWorkerClient";
import { createResultsZip, RESULTS_ZIP_NAME } from "./lib/zip";
import type { FileItem, QueueSummary } from "./types";

function createFileItem(file: File): FileItem {
  return {
    id: crypto.randomUUID(),
    file,
    name: file.name,
    size: file.size,
    passwordOverride: "",
    passwordVisible: false,
    status: "waiting",
    progress: 0,
  };
}

export default function App() {
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [commonPassword, setCommonPassword] = useState("");
  const [commonPasswordVisible, setCommonPasswordVisible] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const summary = useMemo<QueueSummary>(() => {
    const counts = fileItems.reduce(
      (counts, item) => {
        counts.total += 1;
        if (item.status === "wrong-password") {
          counts.failed += 1;
        } else {
          counts[item.status] += 1;
        }
        return counts;
      },
      {
        total: 0,
        waiting: 0,
        processing: 0,
        success: 0,
        failed: 0,
        skipped: 0,
      } as QueueSummary,
    );

    return counts;
  }, [fileItems]);

  const hasRetryable = fileItems.some(
    (item) => item.status === "failed" || item.status === "wrong-password" || item.status === "skipped",
  );
  const hasSuccess = fileItems.some((item) => item.status === "success" && item.outputBlob);

  function addFiles(files: File[]) {
    const accepted: FileItem[] = [];
    const rejected = {
      notPdf: 0,
      tooLarge: 0,
    };

    for (const file of files) {
      const result = validatePdfFile(file);

      if (result.ok) {
        accepted.push(createFileItem(file));
      } else if (result.reason === "too-large") {
        rejected.tooLarge += 1;
      } else {
        rejected.notPdf += 1;
      }
    }

    if (accepted.length > 0) {
      setFileItems((current) => [...current, ...accepted]);
    }

    const messages = [];

    if (rejected.notPdf > 0) {
      messages.push(`${rejected.notPdf} non-PDF file${rejected.notPdf === 1 ? "" : "s"} ignored`);
    }

    if (rejected.tooLarge > 0) {
      messages.push(`${rejected.tooLarge} file${rejected.tooLarge === 1 ? "" : "s"} over 100 MB ignored`);
    }

    setNotice(messages.length > 0 ? messages.join(". ") : null);
  }

  function updateItem(id: string, updater: (item: FileItem) => FileItem) {
    setFileItems((current) => current.map((item) => (item.id === id ? updater(item) : item)));
  }

  function removeFile(id: string) {
    setFileItems((current) => current.filter((item) => item.id !== id));
  }

  function updatePasswordOverride(id: string, value: string) {
    updateItem(id, (item) => ({
      ...item,
      passwordOverride: value,
      errorMessage: item.status === "skipped" || item.status === "wrong-password" ? undefined : item.errorMessage,
      status: item.status === "skipped" || item.status === "wrong-password" ? "waiting" : item.status,
    }));
  }

  function copyCommonPassword(id: string) {
    updateItem(id, (item) => ({
      ...item,
      passwordOverride: commonPassword,
      status: item.status === "skipped" ? "waiting" : item.status,
      errorMessage: item.status === "skipped" ? undefined : item.errorMessage,
    }));
  }

  function toggleFilePasswordVisible(id: string) {
    updateItem(id, (item) => ({ ...item, passwordVisible: !item.passwordVisible }));
  }

  async function processQueue(mode: "all" | "retry" | "single", singleId?: string) {
    if (isProcessing) {
      return;
    }

    const candidates = fileItems.filter((item) => {
      if (singleId) {
        return item.id === singleId;
      }

      if (mode === "retry") {
        return item.status === "failed" || item.status === "wrong-password" || item.status === "skipped";
      }

      return item.status !== "success" && item.status !== "processing";
    });

    setIsProcessing(true);
    setNotice(null);

    for (const item of candidates) {
      const password = getPasswordForFile(item, commonPassword);

      if (!password) {
        updateItem(item.id, (current) => ({
          ...current,
          status: "skipped",
          progress: 0,
          errorMessage: "Password required",
        }));
        continue;
      }

      updateItem(item.id, (current) => ({
        ...current,
        status: "processing",
        progress: 20,
        errorMessage: undefined,
      }));

      try {
        const output = await unlockPdfInWorker(item.file, password, item.id);
        const outputBlob = new Blob([output], { type: "application/pdf" });

        setFileItems((current) => {
          const reservedNames = new Set(
            current
              .filter((candidate) => candidate.id !== item.id)
              .map((candidate) => candidate.outputName)
              .filter((name): name is string => Boolean(name)),
          );
          const outputName = makeUnlockedFileName(item.name, reservedNames);

          return current.map((candidate) =>
            candidate.id === item.id
              ? {
                  ...candidate,
                  status: "success",
                  progress: 100,
                  outputBlob,
                  outputName,
                  errorMessage: undefined,
                  passwordOverride: "",
                  passwordVisible: false,
                }
              : candidate,
          );
        });
      } catch (error) {
        const failure = error as { code?: string; message?: string };
        const status = failure.code === "wrong-password" ? "wrong-password" : "failed";

        updateItem(item.id, (current) => ({
          ...current,
          status,
          progress: 100,
          errorMessage: failure.message ?? "PDF unlock failed",
        }));
      }
    }

    setIsProcessing(false);
  }

  function clearAll() {
    setFileItems([]);
    setCommonPassword("");
    setNotice(null);
  }

  function clearPasswordsOnly() {
    setCommonPassword("");
    setFileItems((current) =>
      current.map((item) => ({
        ...item,
        passwordOverride: "",
        passwordVisible: false,
      })),
    );
  }

  function downloadFile(id: string) {
    const item = fileItems.find((candidate) => candidate.id === id);

    if (item?.outputBlob && item.outputName) {
      downloadBlob(item.outputBlob, item.outputName);
    }
  }

  async function downloadZip() {
    const zipBlob = await createResultsZip(fileItems);
    downloadBlob(zipBlob, RESULTS_ZIP_NAME);
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f7f7f2_0%,#e8f7ef_44%,#fff7ed_100%)] text-stone-950">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <Hero />

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <FileDropzone disabled={isProcessing} onFilesSelected={addFiles} />
            {notice ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {notice}
              </div>
            ) : null}
            <FileQueue
              commonPassword={commonPassword}
              disabled={isProcessing}
              items={fileItems}
              onCopyCommonPassword={copyCommonPassword}
              onDownload={downloadFile}
              onRemove={removeFile}
              onRetry={(id) => void processQueue("single", id)}
              onTogglePasswordVisible={toggleFilePasswordVisible}
              onUpdatePassword={updatePasswordOverride}
            />
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <PasswordPanel
              commonPassword={commonPassword}
              disabled={isProcessing}
              isVisible={commonPasswordVisible}
              onClear={() => setCommonPassword("")}
              onToggleVisible={() => setCommonPasswordVisible((value) => !value)}
              onUpdate={setCommonPassword}
            />
            <ResultActions
              disabled={false}
              hasFiles={fileItems.length > 0}
              hasRetryable={hasRetryable}
              hasSuccess={hasSuccess}
              isProcessing={isProcessing}
              onClearAll={clearAll}
              onDownloadZip={() => void downloadZip()}
              onRetryFailed={() => void processQueue("retry")}
              onUnlockAll={() => void processQueue("all")}
              summary={summary}
            />
            <button
              className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-stone-300 bg-white/90 px-4 text-sm font-semibold text-stone-800 shadow-sm transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isProcessing || (commonPassword.length === 0 && fileItems.every((item) => item.passwordOverride.length === 0))}
              onClick={clearPasswordsOnly}
              type="button"
            >
              Clear all passwords
            </button>
          </aside>
        </section>

        <SafetyNotice />
      </main>
    </div>
  );
}
