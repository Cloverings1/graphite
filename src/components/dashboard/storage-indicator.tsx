"use client";

import { formatBytes } from "@/lib/utils";

interface StorageIndicatorProps {
  used: number;
  total: number;
}

export function StorageIndicator({ used, total }: StorageIndicatorProps) {
  // Handle edge case where total is 0
  const percentage = total > 0 ? Math.round((used / total) * 100) : 0;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-muted">Storage</span>
        <span className="text-foreground">{percentage}%</span>
      </div>
      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-muted">
        {formatBytes(used)} of {formatBytes(total)} used
      </p>
    </div>
  );
}
