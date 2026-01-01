"use client";

import { FileBrowser } from "@/components/dashboard/file-browser";
import { FileItem } from "@/types";

export default function TrashPage() {
  // Empty trash for now (mock)
  const trashedFiles: FileItem[] = [];

  return (
    <div>
      <FileBrowser files={trashedFiles} title="Trash" />
      {trashedFiles.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-muted">
            Items in trash will be permanently deleted after 30 days.
          </p>
        </div>
      )}
    </div>
  );
}
