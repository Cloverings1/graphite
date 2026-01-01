"use client";

import { cn } from "@/lib/utils";
import { List, Grid } from "lucide-react";

interface ViewToggleProps {
  view: "list" | "grid";
  onViewChange: (view: "list" | "grid") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-lg border border-border p-1">
      <button
        onClick={() => onViewChange("list")}
        className={cn(
          "rounded-md p-1.5 transition-colors",
          view === "list"
            ? "bg-card text-foreground"
            : "text-muted hover:text-foreground"
        )}
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={() => onViewChange("grid")}
        className={cn(
          "rounded-md p-1.5 transition-colors",
          view === "grid"
            ? "bg-card text-foreground"
            : "text-muted hover:text-foreground"
        )}
      >
        <Grid className="h-4 w-4" />
      </button>
    </div>
  );
}
