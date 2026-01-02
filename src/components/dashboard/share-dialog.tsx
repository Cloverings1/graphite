"use client";

import { useState } from "react";
import { X, Copy, Check, Lock, Clock, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.graphite.atxcopy.com";

interface ShareDialogProps {
  fileId: string;
  fileName: string;
  onClose: () => void;
}

type ExpiresIn = "24h" | "7d" | "30d" | null;

export function ShareDialog({ fileId, fileName, onClose }: ShareDialogProps) {
  const [password, setPassword] = useState("");
  const [expiresIn, setExpiresIn] = useState<ExpiresIn>("7d");
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateLink = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError("Not authenticated");
        return;
      }

      const res = await fetch(`${API_URL}/api/share`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_id: fileId,
          password: password || undefined,
          expires_in: expiresIn,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create share link");
      }

      const data = await res.json();
      setShareLink(data.url);
    } catch (err) {
      console.error("Failed to create share link:", err);
      setError(err instanceof Error ? err.message : "Failed to create share link");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const expirationOptions: { label: string; value: ExpiresIn }[] = [
    { label: "24 hours", value: "24h" },
    { label: "7 days", value: "7d" },
    { label: "30 days", value: "30d" },
    { label: "Never", value: null },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-medium">Share File</h2>
          </div>
          <p className="text-sm text-muted truncate">{fileName}</p>
        </div>

        {!shareLink ? (
          <div className="space-y-5">
            {/* Password (optional) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Lock className="h-4 w-4 text-muted" />
                Password Protection
                <span className="text-muted font-normal">(optional)</span>
              </label>
              <Input
                type="password"
                placeholder="Leave empty for public link"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Expiration */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Clock className="h-4 w-4 text-muted" />
                Link Expiration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {expirationOptions.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setExpiresIn(option.value)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      expiresIn === option.value
                        ? "bg-accent text-accent-foreground"
                        : "bg-border/50 text-foreground hover:bg-border"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Create Button */}
            <Button
              onClick={handleCreateLink}
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Share Link"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Success state */}
            <div className="rounded-xl bg-background border border-border p-4">
              <p className="text-xs text-muted mb-2">Share Link</p>
              <div className="flex items-center gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="text-sm font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 text-sm text-muted">
              {password && (
                <p className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5" />
                  Password protected — share the password separately
                </p>
              )}
              {expiresIn && (
                <p className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  Expires in {expiresIn === "24h" ? "24 hours" : expiresIn === "7d" ? "7 days" : "30 days"}
                </p>
              )}
              {!expiresIn && (
                <p className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  This link never expires
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Done
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShareLink(null);
                  setPassword("");
                }}
                className="flex-1"
              >
                Create Another
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
