"use client";

import { useEffect, useState } from "react";
import { Download, Lock, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatBytes } from "@/lib/utils";
import { Logo } from "@/components/icons/logo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.graphite.atxcopy.com";

interface ShareInfo {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  has_password: boolean;
  expires_at: string | null;
  expired: boolean;
}

interface ShareDownloadProps {
  shareId: string;
}

export function ShareDownload({ shareId }: ShareDownloadProps) {
  const [info, setInfo] = useState<ShareInfo | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    fetchInfo();
  }, [shareId]);

  const fetchInfo = async () => {
    try {
      const res = await fetch(`${API_URL}/api/share/${shareId}/info`);
      if (!res.ok) {
        if (res.status === 404) {
          setError("This link doesn't exist or has been deleted.");
        } else if (res.status === 410) {
          setError("This link has expired.");
        } else {
          setError("Failed to load file info.");
        }
        return;
      }
      const data = await res.json();
      setInfo(data);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!info) return;

    setDownloading(true);
    setDownloadError(null);

    try {
      // Build download URL
      let downloadUrl = `${API_URL}/api/share/${shareId}/download`;

      // For password-protected files, add password as query param
      if (info.has_password && password) {
        downloadUrl += `?p=${encodeURIComponent(password)}`;
      }

      const res = await fetch(downloadUrl, {
        method: "GET",
      });

      if (!res.ok) {
        if (res.status === 401) {
          setDownloadError("Incorrect password. Please try again.");
        } else if (res.status === 429) {
          setDownloadError("Too many attempts. Please wait and try again.");
        } else if (res.status === 404) {
          setDownloadError("This link is no longer available.");
        } else {
          setDownloadError("Download failed. Please try again.");
        }
        setDownloading(false);
        return;
      }

      // Download the file
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = info.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setDownloadError("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const formatExpiration = (expiresAt: string) => {
    const date = new Date(expiresAt);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `Expires in ${days} day${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `Expires in ${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      return "Expires soon";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state (link not found, expired, etc.)
  if (error && !info) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-xl font-medium mb-2">Link Unavailable</h1>
            <p className="text-sm text-muted">{error}</p>
          </div>
          <a
            href="https://graphite.atxcopy.com"
            className="text-sm text-accent hover:underline"
          >
            Learn about Graphite
          </a>
        </div>
      </div>
    );
  }

  // Main download UI
  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <Logo />
      </div>

      {/* File Info */}
      <div className="mb-6 text-center">
        <h1 className="text-xl font-medium mb-2 break-words">{info?.file_name}</h1>
        <p className="text-muted">{info && formatBytes(info.file_size)}</p>
        {info?.expires_at && (
          <p className="mt-2 text-xs text-muted flex items-center justify-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {formatExpiration(info.expires_at)}
          </p>
        )}
      </div>

      {/* Password Input */}
      {info?.has_password && (
        <div className="mb-5">
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Lock className="h-4 w-4 text-muted" />
            Password Required
          </label>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDownload()}
            autoFocus
          />
        </div>
      )}

      {/* Error Message */}
      {downloadError && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
          {downloadError}
        </div>
      )}

      {/* Download Button */}
      <Button
        onClick={handleDownload}
        variant="primary"
        className="w-full gap-2"
        disabled={downloading || (info?.has_password && !password)}
      >
        {downloading ? (
          <>
            <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Download File
          </>
        )}
      </Button>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-muted">
        Shared via{" "}
        <a
          href="https://graphite.atxcopy.com"
          className="text-accent hover:underline"
        >
          Graphite
        </a>
        {" "}&mdash; blazing fast cloud storage
      </p>
    </div>
  );
}
