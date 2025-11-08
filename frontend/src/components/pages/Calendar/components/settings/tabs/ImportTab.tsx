import { useState } from "react";

import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/AuthProvider";
import { Spinner } from "@/components/common/Spinner";

import { eventService } from "@/services/EventService";

const ImportTab = () => {
  const { accessToken } = useAuth();

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "partial" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const uploadFile = async (file: File) => {
    if (!accessToken) return;

    setStatus("uploading");
    setMessage("");
    setIsDisabled(true);

    try {
      const report = await eventService.importEvents(file, accessToken);

      const imported = report.imported_count ?? 0;
      const skipped = report.skipped_count ?? 0;

      if (imported > 0 && skipped > 0) {
        setStatus("partial");
        setMessage(`Imported ${imported} events, ${skipped} skipped.`);
      } else if (imported > 0) {
        setStatus("success");
        setMessage(`Imported ${imported} events.`);
      } else {
        setStatus("error");
        setMessage("No events imported.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Import failed.";
      setStatus("error");
      setMessage(message);
    } finally {
      setIsDisabled(false);
    }
  };

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await uploadFile(file);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      await uploadFile(file);
    }
  };

  return (
    <section className="w-full flex flex-col space-y-8 p-8">
      <div className="space-y-8">
        <div className="flex flex-row space-x-6">
          <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-600">
            <ArrowUpTrayIcon aria-hidden="true" className="size-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-base">Calendar Import</h1>
            <p className="text-gray-500 text-sm">
              Import your existing calendar data from .ics files
            </p>
          </div>
        </div>
        {status !== "idle" && (
          <div
            className={
              status === "uploading"
                ? "flex items-center rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 text-sm"
                : status === "success"
                  ? "flex items-center rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-800 text-sm"
                  : status === "partial"
                    ? "flex items-center rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-800 text-sm"
                    : "flex items-center rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-800 text-sm"
            }
          >
            <span>{status === "uploading" ? "Importing..." : message}</span>
          </div>
        )}
        <div
          className={`mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 ${isDragging ? "border-indigo-400 bg-indigo-50" : "border-gray-900/25"}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {status === "uploading" ? (
            <div className="flex items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="text-center">
              <ArrowUpTrayIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
              <div className="mt-4 flex text-sm/6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".ics"
                    onChange={onInputChange}
                    disabled={isDisabled}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs/5 text-gray-600">.ics format supported</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ImportTab;
