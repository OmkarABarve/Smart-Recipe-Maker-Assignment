"use client";

import { useState, useRef, useCallback } from "react";

interface ImageUploadProps {
  onIngredientsRecognized: (ingredients: string[]) => void;
}

type Status = "idle" | "loading" | "success" | "error";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

export default function ImageUpload({
  onIngredientsRecognized,
}: ImageUploadProps) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [recognized, setRecognized] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setPreview(null);
    setRecognized([]);
    setSelected(new Set());
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const processFile = useCallback(async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WebP image.");
      setStatus("error");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_SIZE_MB} MB.`);
      setStatus("error");
      return;
    }

    setError(null);
    setStatus("loading");
    setRecognized([]);
    setSelected(new Set());

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      const base64 = await fileToBase64(file);

      const res = await fetch("/api/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mimeType: file.type }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? `Server error (${res.status})`);
      }

      const ingredients: string[] = data.ingredients ?? [];
      if (ingredients.length === 0) {
        setError("No food ingredients detected. Try a clearer photo.");
        setStatus("error");
        return;
      }

      setRecognized(ingredients);
      setSelected(new Set(ingredients));
      setStatus("success");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to recognize ingredients."
      );
      setStatus("error");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const toggleIngredient = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleAddSelected = () => {
    const toAdd = recognized.filter((name) => selected.has(name));
    if (toAdd.length > 0) {
      onIngredientsRecognized(toAdd);
    }
    reset();
  };

  return (
    <div className="w-full">
      <button
        onClick={() => {
          setExpanded(!expanded);
          if (expanded) reset();
        }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-brand-400 dark:hover:border-brand-500 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Scan Ingredients from Photo
        <svg
          className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {expanded && (
        <div className="mt-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
          {/* Drop zone */}
          {status === "idle" && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                dragOver
                  ? "border-brand-400 bg-brand-50 dark:bg-brand-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-brand-300 dark:hover:border-brand-600"
              }`}
            >
              <svg
                className="w-10 h-10 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Drop an image here, or{" "}
                  <span className="text-brand-600 dark:text-brand-400">
                    click to browse
                  </span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  JPG, PNG, or WebP up to {MAX_SIZE_MB} MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* Loading state */}
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 py-6">
              {preview && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={preview}
                  alt="Uploaded"
                  className="w-32 h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                />
              )}
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Analyzing image for ingredients...
                </p>
              </div>
            </div>
          )}

          {/* Error state */}
          {status === "error" && (
            <div className="flex flex-col items-center gap-4 py-6">
              {preview && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={preview}
                  alt="Uploaded"
                  className="w-32 h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-700 opacity-60"
                />
              )}
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <p className="text-sm">{error}</p>
              </div>
              <button
                onClick={reset}
                className="px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
              >
                Try another image
              </button>
            </div>
          )}

          {/* Success state: recognized ingredients to confirm */}
          {status === "success" && recognized.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                {preview && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={preview}
                    alt="Uploaded"
                    className="w-24 h-24 object-cover rounded-xl border border-gray-200 dark:border-gray-700 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Found {recognized.length} ingredient
                    {recognized.length !== 1 ? "s" : ""}. Select the ones to
                    add:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recognized.map((name) => (
                      <button
                        key={name}
                        onClick={() => toggleIngredient(name)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          selected.has(name)
                            ? "bg-brand-500 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {selected.has(name) ? "✓ " : ""}
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={handleAddSelected}
                  disabled={selected.size === 0}
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Add {selected.size} ingredient{selected.size !== 1 ? "s" : ""}
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix (e.g. "data:image/jpeg;base64,")
      const base64 = result.split(",")[1];
      if (base64) resolve(base64);
      else reject(new Error("Failed to encode image"));
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
