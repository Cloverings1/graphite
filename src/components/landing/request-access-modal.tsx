"use client";

import { useState } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RequestAccessModalProps {
  onClose: () => void;
}

export function RequestAccessModal({ onClose }: RequestAccessModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit request");
      }

      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!submitted ? (
          <>
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-serif tracking-tight">
                Request Access
              </h2>
              <p className="mt-2 text-sm text-muted">
                Join the waitlist for Graphite Prime. We&apos;ll reach out when
                your spot is ready.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Company{" "}
                  <span className="text-muted font-normal">(optional)</span>
                </label>
                <Input
                  type="text"
                  placeholder="Your company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-6"
                disabled={loading || !name || !email}
              >
                {loading ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Request Access
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted">
              By requesting access, you agree to our terms and privacy policy.
            </p>
          </>
        ) : (
          /* Success state */
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-serif tracking-tight mb-2">
              You&apos;re on the list
            </h2>
            <p className="text-sm text-muted mb-6">
              We&apos;ll reach out to {email} when your spot is ready.
            </p>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
