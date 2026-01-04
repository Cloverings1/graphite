"use client";

import { useState } from "react";
import { X, Copy, Check, Lock, Clock, Link2 } from "lucide-react";
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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/40 hover:text-white/70 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
              <Link2 className="h-4 w-4 text-violet-400" />
            </div>
            <h2 className="text-lg font-medium text-white">Share File</h2>
          </div>
          <p className="text-sm text-white/40 truncate">{fileName}</p>
        </div>

        {!shareLink ? (
          <div className="space-y-5">
            {/* Password (optional) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
                <Lock className="h-4 w-4 text-white/40" />
                Password Protection
                <span className="text-white/30 font-normal">(optional)</span>
              </label>
              <input
                type="password"
                placeholder="Leave empty for public link"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-violet-500/30 transition-all"
              />
            </div>

            {/* Expiration */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-3">
                <Clock className="h-4 w-4 text-white/40" />
                Link Expiration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {expirationOptions.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setExpiresIn(option.value)}
                    className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                      expiresIn === option.value
                        ? "bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 text-white"
                        : "bg-white/[0.03] border border-white/[0.06] text-white/50 hover:text-white/70"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Create Button */}
            <button
              onClick={handleCreateLink}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Share Link"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Success state */}
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
              <p className="text-xs text-white/40 mb-2">Share Link</p>
              <div className="flex items-center gap-2">
                <input
                  value={shareLink}
                  readOnly
                  className="flex-1 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm font-mono text-white/80 outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="p-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 text-sm text-white/40">
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
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white/70 font-medium hover:bg-white/[0.06] transition-all"
              >
                Done
              </button>
              <button
                onClick={() => {
                  setShareLink(null);
                  setPassword("");
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:opacity-90 transition-all"
              >
                Create Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
