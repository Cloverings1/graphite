"use client";

import { Folder, Plus } from "lucide-react";

export function FolderList() {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-white/30">
          Folders
        </span>
        <button className="p-1 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="py-4 text-center text-sm text-white/30">
        <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-white/[0.03] flex items-center justify-center">
          <Folder className="h-5 w-5 text-white/20" />
        </div>
        No folders yet
      </div>
    </div>
  );
}
