"use client";

import { useState } from "react";
import { FileItem } from "@/types";
import { FileItemRow } from "./file-item";
import { ViewToggle } from "./view-toggle";
import { SearchBar } from "./search-bar";

interface FileBrowserProps {
  files: FileItem[];
  title?: string;
  loading?: boolean;
  onUpdate?: () => void;
}

export function FileBrowser({ files, title = "All Files", loading = false, onUpdate }: FileBrowserProps) {
  const [view, setView] = useState<"list" | "grid">("list");

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-6">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <div className="flex items-center gap-4">
          <SearchBar />
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      </div>

      {/* File list/grid */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-500" />
            <p className="mt-3 text-sm text-white/40">Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-white/50">No files yet</p>
            <p className="mt-1 text-sm text-white/30">Upload something to get started</p>
          </div>
        ) : view === "grid" ? (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {files.map((file) => (
                <FileItemRow key={file.id} file={file} view="grid" onUpdate={onUpdate} />
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* List header */}
            <div className="flex items-center gap-4 px-5 py-3 border-b border-white/[0.06] text-xs font-medium uppercase tracking-wider text-white/30">
              <div className="w-5" />
              <div className="flex-1">Name</div>
              <div className="w-4" />
              <div className="w-20 text-right">Size</div>
              <div className="w-28 text-right">Modified</div>
              <div className="w-8" />
            </div>
            <div className="divide-y divide-white/[0.03]">
              {files.map((file) => (
                <FileItemRow key={file.id} file={file} view="list" onUpdate={onUpdate} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
