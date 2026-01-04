"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { cn, formatBytes, formatDuration } from "@/lib/utils";
import { Upload, Cloud, X, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.graphite.atxcopy.com";

interface UploadFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  speed: number;
  status: "uploading" | "complete" | "error";
  error?: string;
  startTime: number;
  duration?: number;
}

interface UploadZoneProps {
  onUploadComplete?: () => void;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const uppyRef = useRef<Uppy | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    const supabase = supabaseRef.current;
    const uppy = new Uppy({
      restrictions: {
        maxFileSize: 10 * 1024 * 1024 * 1024,
      },
      autoProceed: true,
    });

    let cachedToken: string | null = null;
    let tokenExpiry = 0;

    uppy.use(Tus, {
      endpoint: `${API_URL}/upload`,
      chunkSize: 512 * 1024 * 1024,
      retryDelays: [0, 1000, 3000, 5000],
      removeFingerprintOnSuccess: true,
      limit: 10,
      async onBeforeRequest(req) {
        const now = Date.now();
        if (cachedToken && tokenExpiry > now + 300000) {
          req.setHeader("Authorization", `Bearer ${cachedToken}`);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          cachedToken = session.access_token;
          tokenExpiry = (session.expires_at || 0) * 1000;
          req.setHeader("Authorization", `Bearer ${cachedToken}`);
        }
      },
    });

    uppy.on("file-added", (file) => {
      const startTime = Date.now();
      file.meta.startTime = startTime;
      setUploads((prev) => [
        ...prev,
        {
          id: file.id,
          name: file.name,
          size: file.size || 0,
          progress: 0,
          speed: 0,
          status: "uploading",
          startTime,
        },
      ]);
    });

    uppy.on("upload-progress", (file, progress) => {
      if (!file) return;
      const speed = progress.bytesUploaded / ((Date.now() - (file.meta.startTime as number || Date.now())) / 1000);

      setUploads((prev) =>
        prev.map((u) =>
          u.id === file.id
            ? {
                ...u,
                progress: progress.bytesTotal ? (progress.bytesUploaded / progress.bytesTotal) * 100 : 0,
                speed,
              }
            : u
        )
      );
    });

    uppy.on("upload-success", (file) => {
      if (!file) return;
      const startTime = file.meta.startTime as number || Date.now();
      const duration = Math.round((Date.now() - startTime) / 1000);
      setUploads((prev) =>
        prev.map((u) =>
          u.id === file.id ? { ...u, progress: 100, status: "complete", duration } : u
        )
      );
      onUploadComplete?.();
    });

    uppy.on("upload-error", (file, error) => {
      if (!file) return;
      setUploads((prev) =>
        prev.map((u) =>
          u.id === file.id
            ? { ...u, status: "error", error: error.message }
            : u
        )
      );
    });

    uppyRef.current = uppy;

    return () => {
      uppy.cancelAll();
    };
  }, [onUploadComplete]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      uppyRef.current?.addFile({
        name: file.name,
        type: file.type,
        data: file,
        meta: {
          filename: file.name,
          filetype: file.type,
        },
      });
    });
  }, []);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      uppyRef.current?.addFile({
        name: file.name,
        type: file.type,
        data: file,
        meta: {
          filename: file.name,
          filetype: file.type,
        },
      });
    });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  const removeUpload = useCallback((id: string) => {
    uppyRef.current?.removeFile(id);
    setUploads((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setUploads((prev) => prev.filter((u) => u.status !== "complete"));
  }, []);

  const activeUploads = uploads.filter((u) => u.status === "uploading");
  const completedUploads = uploads.filter((u) => u.status === "complete");

  const [, setTick] = useState(0);
  useEffect(() => {
    if (activeUploads.length === 0) return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [activeUploads.length]);

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300",
          isDragging
            ? "border-violet-500/50 bg-violet-500/[0.05]"
            : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
        )}
      >
        {/* Gradient glow on drag */}
        {isDragging && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-violet-500/10 animate-pulse" />
        )}

        <div className="relative flex flex-col items-center gap-4">
          <div
            className={cn(
              "rounded-2xl p-5 transition-all duration-300",
              isDragging
                ? "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20"
                : "bg-white/[0.03]"
            )}
          >
            {isDragging ? (
              <Cloud className="h-10 w-10 text-violet-400" />
            ) : (
              <Upload className="h-10 w-10 text-white/40" />
            )}
          </div>
          <div>
            <p className="text-lg font-medium text-white">
              {isDragging ? "Drop files here" : "Drag files here"}
            </p>
            <p className="mt-1 text-sm text-white/40">or click to browse</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/30">
              <Zap className="h-3 w-3 text-violet-400" />
              <span>Up to 10GB per file</span>
              <span className="text-white/10">•</span>
              <span>Resumable</span>
              <span className="text-white/10">•</span>
              <span>Full speed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Uploads */}
      {activeUploads.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">
              Uploading {activeUploads.length} file{activeUploads.length > 1 ? "s" : ""}
            </h3>
          </div>
          <div className="space-y-4">
            {activeUploads.map((upload) => (
              <div key={upload.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm font-medium text-white/90">{upload.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-white/40">
                      {formatDuration(Math.floor((Date.now() - upload.startTime) / 1000))}
                    </span>
                    <span className="text-xs font-mono text-emerald-400">
                      {formatBytes(upload.speed)}/s
                    </span>
                    <span className="text-xs font-medium text-violet-400">
                      {upload.progress.toFixed(0)}%
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeUpload(upload.id);
                      }}
                      className="text-white/30 hover:text-white/60 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300 relative"
                    style={{ width: `${upload.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Uploads */}
      {completedUploads.length > 0 && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-medium text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              {completedUploads.length} file{completedUploads.length > 1 ? "s" : ""} uploaded
            </h3>
            <button
              onClick={clearCompleted}
              className="text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="space-y-2">
            {completedUploads.slice(0, 5).map((upload) => (
              <div key={upload.id} className="flex items-center justify-between text-sm">
                <span className="truncate text-white/70">{upload.name}</span>
                <div className="flex items-center gap-4 text-xs">
                  {upload.duration !== undefined && (
                    <span className="text-emerald-400">{formatDuration(upload.duration)}</span>
                  )}
                  <span className="text-white/40">{formatBytes(upload.size)}</span>
                </div>
              </div>
            ))}
            {completedUploads.length > 5 && (
              <p className="text-xs text-white/30">
                +{completedUploads.length - 5} more
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error Uploads */}
      {uploads.filter((u) => u.status === "error").length > 0 && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-red-400">
            <AlertCircle className="h-4 w-4" />
            Upload errors
          </h3>
          <div className="space-y-2">
            {uploads
              .filter((u) => u.status === "error")
              .map((upload) => (
                <div key={upload.id} className="text-sm">
                  <span className="truncate text-white/70">{upload.name}</span>
                  <span className="ml-2 text-xs text-red-400">
                    {upload.error || "Upload failed"}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
