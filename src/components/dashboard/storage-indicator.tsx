"use client";

import { formatBytes } from "@/lib/utils";

interface StorageIndicatorProps {
  used: number;
  total: number;
}

export function StorageIndicator({ used, total }: StorageIndicatorProps) {
  const percentage = total > 0 ? Math.round((used / total) * 100) : 0;
  const isHigh = percentage > 80;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-white/50">Storage</span>
        <span className={isHigh ? "text-amber-400" : "text-white/70"}>{percentage}%</span>
      </div>
      <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isHigh
              ? "bg-gradient-to-r from-amber-500 to-orange-500"
              : "bg-gradient-to-r from-violet-500 to-fuchsia-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-white/40">
        {formatBytes(used)} of {formatBytes(total)} used
      </p>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
