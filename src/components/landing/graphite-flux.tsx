"use client";

import { useEffect, useState } from "react";

// Animated file that moves across the transfer visualization
function TransferringFile({ delay, fileName, fileSize, top }: {
  delay: number;
  fileName: string;
  fileSize: string;
  top: string;
}) {
  return (
    <div
      className="absolute left-0 flex items-center gap-3 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 backdrop-blur-sm animate-transfer-file"
      style={{
        animationDelay: `${delay}s`,
        top,
      }}
    >
      <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="text-left">
        <div className="text-xs font-medium text-foreground">{fileName}</div>
        <div className="text-[10px] text-muted">{fileSize}</div>
      </div>
    </div>
  );
}

// Data stream particle
function StreamParticle({ lane, delay, width }: { lane: number; delay: number; width: number }) {
  return (
    <div
      className="absolute h-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-stream-particle"
      style={{
        top: `${20 + lane * 20}%`,
        animationDelay: `${delay}s`,
        width: `${width}px`,
        opacity: 0.7,
      }}
    />
  );
}

export function GraphiteFlux() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate stream particles with fixed widths
  const particles = mounted ? [
    { lane: 0, delay: 0, width: 45 },
    { lane: 1, delay: 0.2, width: 55 },
    { lane: 2, delay: 0.4, width: 35 },
    { lane: 3, delay: 0.6, width: 50 },
    { lane: 0, delay: 0.8, width: 40 },
    { lane: 1, delay: 1.0, width: 60 },
    { lane: 2, delay: 1.2, width: 48 },
    { lane: 3, delay: 0.3, width: 42 },
    { lane: 0, delay: 0.5, width: 52 },
    { lane: 1, delay: 0.7, width: 38 },
    { lane: 2, delay: 0.9, width: 58 },
    { lane: 3, delay: 1.1, width: 44 },
  ] : [];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute left-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-fuchsia-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass glass-border mb-6">
            <div className="h-5 w-5 rounded bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
              </svg>
            </div>
            <span className="text-sm font-medium">Graphite Flux</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif tracking-tight">
            Transfers at the{" "}
            <span className="italic text-gradient">speed of light</span>
          </h2>
          <p className="mt-4 text-foreground-muted max-w-2xl mx-auto text-lg">
            Our high-performance transfer engine uses parallel streams and intelligent chunking to fully saturate your connection.
          </p>
        </div>

        {/* Animated Transfer Visualization */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main visualization container */}
          <div className="relative rounded-3xl glass glass-border p-8 md:p-12 overflow-hidden">
            {/* Transfer animation area */}
            <div className="flex items-center justify-between gap-8">
              {/* Source - Your Device */}
              <div className="flex-shrink-0 text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shadow-xl relative group cursor-grab active:cursor-grabbing transition-transform hover:scale-105">
                  {/* Laptop icon */}
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {/* Pulse effect */}
                  <div className="absolute inset-0 rounded-2xl bg-violet-500/20 animate-ping opacity-30" />
                </div>
                <p className="mt-3 text-sm text-foreground-muted">Your Device</p>
              </div>

              {/* Transfer streams visualization */}
              <div className="flex-1 relative h-32 md:h-40">
                {/* Stream lanes background */}
                <div className="absolute inset-0 flex flex-col justify-around py-4">
                  {[0, 1, 2, 3].map((lane) => (
                    <div
                      key={lane}
                      className="h-px bg-gradient-to-r from-violet-500/20 via-violet-500/40 to-fuchsia-500/20"
                    />
                  ))}
                </div>

                {/* Animated particles */}
                {mounted && particles.map((p, i) => (
                  <StreamParticle key={i} lane={p.lane} delay={p.delay} width={p.width} />
                ))}

                {/* Floating file indicators */}
                {mounted && (
                  <>
                    <TransferringFile delay={0} fileName="project_v2.zip" fileSize="2.4 GB" top="5%" />
                    <TransferringFile delay={1} fileName="assets.psd" fileSize="890 MB" top="35%" />
                    <TransferringFile delay={2} fileName="render_4k.mov" fileSize="4.2 GB" top="65%" />
                  </>
                )}

                {/* Speed indicator */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                  </span>
                  <span className="text-xs font-mono text-success font-medium">847 Mbps</span>
                </div>
              </div>

              {/* Destination - Graphite Cloud */}
              <div className="flex-shrink-0 text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-violet-500/20 relative overflow-hidden">
                  {/* Cloud icon */}
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  {/* Animated shine */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                </div>
                <p className="mt-3 text-sm text-foreground-muted">Graphite Cloud</p>
              </div>
            </div>

            {/* Feature pills */}
            <div className="mt-8 pt-8 border-t border-border/30 flex flex-wrap justify-center gap-3">
              {[
                { label: "Parallel Streams", icon: "⚡" },
                { label: "Smart Chunking", icon: "🧩" },
                { label: "Auto-Resume", icon: "🔄" },
                { label: "Zero Throttling", icon: "🚀" },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-border/30 text-xs text-foreground-muted"
                >
                  <span>{feature.icon}</span>
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Drag hint */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-xs text-muted animate-bounce">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span>Drag & drop to transfer</span>
          </div>
        </div>

        {/* Plan availability note */}
        <p className="mt-12 text-center text-sm text-muted">
          Included in Prime and Reserve plans*
        </p>
      </div>
    </section>
  );
}
