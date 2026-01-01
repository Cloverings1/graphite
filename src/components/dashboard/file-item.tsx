"use client";

import { FileItem as FileItemType } from "@/types";
import { formatBytes, formatDate, cn } from "@/lib/utils";
import {
  File,
  Film,
  Image,
  FileArchive,
  FileAudio,
  FileText,
  Folder,
  Star,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileItemProps {
  file: FileItemType;
  view: "list" | "grid";
}

function getFileIcon(file: FileItemType) {
  if (file.type === "folder") return Folder;

  const mimeType = file.mimeType || "";
  if (mimeType.startsWith("video/")) return Film;
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.startsWith("audio/")) return FileAudio;
  if (mimeType.includes("zip") || mimeType.includes("archive")) return FileArchive;
  if (mimeType.includes("pdf") || mimeType.includes("document")) return FileText;

  return File;
}

export function FileItemRow({ file, view }: FileItemProps) {
  const Icon = getFileIcon(file);

  if (view === "grid") {
    return (
      <div className="group relative rounded-xl border border-border bg-card p-4 transition-colors hover:border-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-lg bg-background p-4">
            <Icon className="h-8 w-8 text-muted" />
          </div>
          <div className="w-full text-center">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted">
              {file.size ? formatBytes(file.size) : "--"}
            </p>
          </div>
        </div>
        {file.starred && (
          <Star className="absolute right-2 top-2 h-4 w-4 fill-accent text-accent" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 bottom-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-4 rounded-lg border border-transparent px-4 py-3 transition-colors hover:border-border hover:bg-card">
      <Icon className="h-5 w-5 shrink-0 text-muted" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{file.name}</p>
      </div>

      <div className="flex items-center gap-6 text-sm text-muted">
        {file.starred && (
          <Star className="h-4 w-4 fill-accent text-accent" />
        )}
        <span className="w-20 text-right">
          {file.size ? formatBytes(file.size) : "--"}
        </span>
        <span className="w-28 text-right">{formatDate(file.updatedAt)}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
