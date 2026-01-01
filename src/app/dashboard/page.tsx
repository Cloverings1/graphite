"use client";

import { UploadZone } from "@/components/dashboard/upload-zone";
import { FileBrowser } from "@/components/dashboard/file-browser";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <UploadZone />

      {/* File Browser - empty for now */}
      <FileBrowser files={[]} title="All Files" />
    </div>
  );
}
