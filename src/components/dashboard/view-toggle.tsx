"use client";

import { cn } from "@/lib/utils";
import { List, Grid } from "lucide-react";

interface ViewToggleProps {
  view: "list" | "grid";
  onViewChange: (view: "list" | "grid") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
      <button
        onClick={() => onViewChange("list")}
        className={cn(
          "rounded-lg p-2 transition-all",
          view === "list"
            ? "bg-white/[0.08] text-white"
            : "text-white/40 hover:text-white/70"
        )}
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={() => onViewChange("grid")}
        className={cn(
          "rounded-lg p-2 transition-all",
          view === "grid"
            ? "bg-white/[0.08] text-white"
            : "text-white/40 hover:text-white/70"
        )}
      >
        <Grid className="h-4 w-4" />
      </button>
    </div>
  );
}
