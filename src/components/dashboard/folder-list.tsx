"use client";

import { Folder, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FolderList() {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          Folders
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="py-4 text-center text-sm text-muted">
        No folders yet
      </div>
    </div>
  );
}
