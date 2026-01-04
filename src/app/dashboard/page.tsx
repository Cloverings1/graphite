"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UploadZone } from "@/components/dashboard/upload-zone";
import { FileBrowser } from "@/components/dashboard/file-browser";
import type { FileItem } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.graphite.atxcopy.com";

export default function DashboardPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchFiles = useCallback(async () => {
    console.log("[Dashboard] fetchFiles called, API_URL:", API_URL);
    try {
      // Use getUser() first to validate/refresh the session
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("[Dashboard] Auth error:", userError?.message);
        setLoading(false);
        return;
      }
      console.log("[Dashboard] User authenticated:", user.id);

      // Now get the session with fresh access token
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        console.error("[Dashboard] No access token in session");
        setLoading(false);
        return;
      }
      console.log("[Dashboard] Fetching files from API...");

      const res = await fetch(`${API_URL}/api/files?parent_id=null`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      console.log("[Dashboard] API response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("[Dashboard] Received", data.length, "files");
        const transformedFiles: FileItem[] = data.map((file: Record<string, unknown>) => ({
          id: file.id,
          name: file.name,
          type: file.type,
          size: file.size,
          mimeType: file.mime_type,
          createdAt: new Date(file.created_at as string),
          updatedAt: new Date(file.updated_at as string),
          starred: file.starred,
          parentId: file.parent_id,
        }));
        setFiles(transformedFiles);
      } else {
        const errorText = await res.text();
        console.error("[Dashboard] API error:", res.status, errorText);
      }
    } catch (error) {
      console.error("[Dashboard] Failed to fetch files:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase.auth]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUploadComplete = useCallback(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <div className="space-y-8">
      <UploadZone onUploadComplete={handleUploadComplete} />
      <FileBrowser
        files={files}
        title="All Files"
        loading={loading}
        onUpdate={fetchFiles}
      />
    </div>
  );
}
