"use client";

import { cn } from "@/lib/utils";
import { Files, Star, Clock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "All Files", href: "/dashboard", icon: Files },
  { label: "Starred", href: "/dashboard/starred", icon: Star },
  { label: "Recent", href: "/dashboard/recent", icon: Clock },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 text-white border border-violet-500/20"
                : "text-white/50 hover:bg-white/[0.03] hover:text-white/80"
            )}
          >
            <item.icon className={cn("h-4 w-4", isActive && "text-violet-400")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
