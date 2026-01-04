"use client";

import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
      <input
        type="text"
        placeholder="Search files..."
        className="w-64 rounded-xl border border-white/[0.06] bg-white/[0.02] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-violet-500/30 focus:bg-white/[0.04] transition-all"
      />
    </div>
  );
}
