"use client";

import { FileItem } from "@/types";
import { formatBytes, formatDate, cn } from "@/lib/utils";
import { File, Film, Image, FileArchive, FileAudio, FileText, Check } from "lucide-react";

interface RecentUploadsProps {
  files: FileItem[];
}

function getFileIcon(mimeType?: string) {
  if (!mimeType) return File;
  if (mimeType.startsWith("video/")) return Film;
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.startsWith("audio/")) return FileAudio;
  if (mimeType.includes("zip") || mimeType.includes("archive")) return FileArchive;
  if (mimeType.includes("pdf")) return FileText;
  return File;
}

function getFileIconColor(mimeType?: string) {
  if (!mimeType) return "text-white/40";
  if (mimeType.startsWith("video/")) return "text-rose-400";
  if (mimeType.startsWith("image/")) return "text-emerald-400";
  if (mimeType.startsWith("audio/")) return "text-amber-400";
  if (mimeType.includes("zip") || mimeType.includes("archive")) return "text-orange-400";
  if (mimeType.includes("pdf")) return "text-red-400";
  return "text-white/40";
}

export function RecentUploads({ files }: RecentUploadsProps) {
  const recentFiles = files.slice(0, 5);

  if (recentFiles.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h3 className="text-sm font-medium text-white">Recent Uploads</h3>
      </div>
      <div className="divide-y divide-white/[0.03]">
        {recentFiles.map((file) => {
          const Icon = getFileIcon(file.mimeType);
          const iconColor = getFileIconColor(file.mimeType);
          return (
            <div
              key={file.id}
              className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
            >
              <Icon className={cn("h-5 w-5", iconColor)} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white/90">{file.name}</p>
                <p className="text-xs text-white/40">
                  {formatBytes(file.size || 0)} • {formatDate(file.createdAt)}
                </p>
              </div>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                <Check className="h-3 w-3 text-emerald-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
