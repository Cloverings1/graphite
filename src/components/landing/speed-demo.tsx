"use client";

import { useEffect, useState, useRef } from "react";

export function SpeedDemo() {
  const [progress, setProgress] = useState({ dropbox: 0, graphite: 0 });
  const [graphiteSpeed, setGraphiteSpeed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Format speed display
  const formatSpeed = (mbps: number) => {
    if (mbps >= 1000) {
      return `${(mbps / 1000).toFixed(1)} Gbps`;
    }
    return `${Math.round(mbps)} Mbps`;
  };

  useEffect(() => {
    const startAnimation = () => {
      setIsComplete(false);
      setHasStarted(true);
      setProgress({ dropbox: 0, graphite: 0 });
      setGraphiteSpeed(0);

      let graphiteProgress = 0;
      let currentSpeed = 0;
      let targetSpeed = 0;
      let speedPhase = 0; // 0: ramp up, 1: fluctuate high

      // Animate Dropbox (slow - reaches ~12% in duration)
      const dropboxInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev.dropbox >= 12) {
            return prev;
          }
          return { ...prev, dropbox: prev.dropbox + 0.3 };
        });
      }, 100);

      // Animate Graphite with variable speed
      const graphiteInterval = setInterval(() => {
        graphiteProgress += 1.8;

        // Speed phases based on progress
        if (graphiteProgress < 20) {
          // Phase 1: Ramping up from 0 to ~600
          targetSpeed = (graphiteProgress / 20) * 600;
        } else if (graphiteProgress < 50) {
          // Phase 2: Climbing to ~950
          targetSpeed = 600 + ((graphiteProgress - 20) / 30) * 350;
        } else if (graphiteProgress < 100) {
          // Phase 3: Fluctuating between 950-1300 Mbps
          const fluctuation = Math.sin(graphiteProgress * 0.3) * 150;
          const drift = Math.sin(graphiteProgress * 0.1) * 100;
          targetSpeed = 1050 + fluctuation + drift;

          // Occasional spikes
          if (Math.random() > 0.85) {
            targetSpeed += Math.random() * 200;
          }
        }

        // Smooth speed transitions
        currentSpeed += (targetSpeed - currentSpeed) * 0.15;
        setGraphiteSpeed(Math.max(0, Math.min(1350, currentSpeed)));

        if (graphiteProgress >= 100) {
          setProgress((prev) => ({ ...prev, graphite: 100 }));
          clearInterval(graphiteInterval);
        } else {
          setProgress((prev) => ({ ...prev, graphite: Math.min(graphiteProgress, 100) }));
        }
      }, 50);

      // Complete after animation
      animationRef.current = setTimeout(() => {
        clearInterval(dropboxInterval);
        clearInterval(graphiteInterval);
        setIsComplete(true);
        setGraphiteSpeed(1280); // Final speed

        // Restart animation after a pause
        setTimeout(startAnimation, 4000);
      }, 2800);
    };

    // Initial delay before first animation
    const initialDelay = setTimeout(startAnimation, 1500);

    return () => {
      clearTimeout(initialDelay);
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full glass glass-border rounded-xl p-5 hover-shine">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-foreground-muted">Uploading 5GB file...</span>
        <span className="text-[10px] text-muted font-mono tracking-wider">LIVE COMPARISON</span>
      </div>

      {/* Dropbox Bar */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted">Dropbox</span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {hasStarted ? "12 Mbps" : "—"}
          </span>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-border/50">
          <div
            className="h-full rounded-full bg-muted-foreground/50 transition-all duration-100 ease-linear"
            style={{ width: `${progress.dropbox}%` }}
          />
        </div>
        <div className="mt-1 text-right text-[10px] text-muted-foreground">
          {Math.round(progress.dropbox)}%
        </div>
      </div>

      {/* Graphite Bar */}
      <div>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-foreground font-medium">Graphite</span>
          <span className={`font-mono text-[10px] transition-colors duration-300 ${
            graphiteSpeed >= 1000 ? "text-success" : "text-accent"
          }`}>
            {hasStarted ? formatSpeed(graphiteSpeed) : "—"}
          </span>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-border/50">
          <div
            className={`h-full rounded-full transition-all duration-100 ease-linear ${
              graphiteSpeed >= 1000
                ? "bg-gradient-to-r from-accent to-success"
                : "bg-gradient-to-r from-accent to-accent-muted"
            }`}
            style={{ width: `${progress.graphite}%` }}
          />
          {/* Glow effect on progress bar */}
          <div
            className={`absolute top-0 h-full rounded-full blur-sm transition-all duration-100 ease-linear ${
              graphiteSpeed >= 1000 ? "bg-success/30" : "bg-accent/30"
            }`}
            style={{ width: `${progress.graphite}%` }}
          />
        </div>
        <div className={`mt-1 text-right text-[10px] font-medium transition-colors duration-300 ${
          graphiteSpeed >= 1000 ? "text-success" : "text-accent"
        }`}>
          {Math.round(progress.graphite)}%
        </div>
      </div>

      {/* Completion message */}
      <div className={`mt-4 pt-4 border-t border-border/50 text-center transition-all duration-500 ${isComplete ? "opacity-100" : "opacity-0"}`}>
        <div className="inline-flex items-center gap-1.5 text-xs text-success">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Done in 59 seconds
        </div>
      </div>
    </div>
  );
}
