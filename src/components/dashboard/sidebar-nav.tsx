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
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-accent/10 text-accent"
                : "text-muted hover:bg-card hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
