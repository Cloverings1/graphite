"use client";

import { FileItem } from "@/types";
import { formatBytes, formatDate } from "@/lib/utils";
import { File, Film, Image, FileArchive, FileAudio, Check } from "lucide-react";

interface RecentUploadsProps {
  files: FileItem[];
}

function getFileIcon(mimeType?: string) {
  if (!mimeType) return File;
  if (mimeType.startsWith("video/")) return Film;
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.startsWith("audio/")) return FileAudio;
  if (mimeType.includes("zip") || mimeType.includes("archive")) return FileArchive;
  return File;
}

export function RecentUploads({ files }: RecentUploadsProps) {
  const recentFiles = files.slice(0, 5);

  if (recentFiles.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-medium">Recent Uploads</h3>
      </div>
      <div className="divide-y divide-border">
        {recentFiles.map((file) => {
          const Icon = getFileIcon(file.mimeType);
          return (
            <div
              key={file.id}
              className="flex items-center gap-3 px-4 py-3"
            >
              <Icon className="h-5 w-5 text-muted" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted">
                  {formatBytes(file.size || 0)} • {formatDate(file.createdAt)}
                </p>
              </div>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10">
                <Check className="h-3 w-3 text-success" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
