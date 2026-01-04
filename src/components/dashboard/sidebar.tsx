"use client";

import { useState, useEffect } from "react";
import { Logo } from "@/components/icons/logo";
import { SidebarNav } from "./sidebar-nav";
import { FolderList } from "./folder-list";
import { StorageIndicator } from "./storage-indicator";
import { Settings, HelpCircle, LogOut } from "lucide-react";
import { SignOutButton, UserButton } from "@/components/auth/auth-wrapper";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.graphite.atxcopy.com";

export function Sidebar() {
  const [usedStorage, setUsedStorage] = useState(0);
  const [totalStorage, setTotalStorage] = useState(100 * 1024 * 1024 * 1024);
  const supabase = createClient();

  useEffect(() => {
    const fetchStorage = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      try {
        const res = await fetch(`${API_URL}/api/storage`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUsedStorage(data.used || 0);
          setTotalStorage(data.limit || 100 * 1024 * 1024 * 1024);
        }
      } catch (err) {
        console.error("Failed to fetch storage:", err);
      }
    };

    fetchStorage();
  }, [supabase]);

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-white/[0.06] bg-black/40 backdrop-blur-xl relative">
      {/* Gradient accent line */}
      <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-violet-500/20 via-transparent to-fuchsia-500/20" />

      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="opacity-80 hover:opacity-100 transition-opacity">
          <Logo />
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <SidebarNav />

        <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <FolderList />
      </div>

      {/* Bottom section */}
      <div className="border-t border-white/[0.06] p-4">
        <StorageIndicator used={usedStorage} total={totalStorage} />

        <div className="mt-4 flex items-center justify-between">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-white/80 transition-colors rounded-lg hover:bg-white/[0.03]">
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <div className="flex items-center gap-1">
            <button className="p-2 text-white/40 hover:text-white/70 transition-colors rounded-lg hover:bg-white/[0.03]">
              <HelpCircle className="h-4 w-4" />
            </button>
            <SignOutButton redirectUrl="/">
              <button className="p-2 text-white/40 hover:text-white/70 transition-colors rounded-lg hover:bg-white/[0.03]">
                <LogOut className="h-4 w-4" />
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </aside>
  );
}
