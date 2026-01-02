export function SpeedSection() {
  return (
    <section id="speed" className="py-32 scroll-mt-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Big stat */}
          <div className="mb-8">
            <span className="text-7xl md:text-9xl font-serif tracking-tight">
              5GB
            </span>
            <span className="ml-4 text-4xl md:text-6xl text-foreground-muted font-light">
              in{" "}
              <span className="text-gradient font-serif italic">59 seconds</span>
            </span>
          </div>

          {/* Explanation */}
          <p className="max-w-2xl text-lg text-foreground-muted leading-relaxed">
            While Dropbox and Google Drive throttle you to 10-15 Mbps, Graphite
            lets you use your{" "}
            <span className="text-foreground">full connection</span>.
          </p>

          <p className="mt-8 text-2xl font-serif">
            Got gigabit?{" "}
            <span className="text-gradient italic">Use it.</span>
          </p>

          {/* Speed comparison table */}
          <div className="mt-16 w-full max-w-md rounded-2xl glass glass-border overflow-hidden">
            <div className="grid grid-cols-3 border-b border-border/50 text-xs tracking-wider uppercase">
              <div className="p-4 text-muted">Service</div>
              <div className="p-4 text-muted text-center">Speed</div>
              <div className="p-4 text-muted text-right">5GB Upload</div>
            </div>
            <div className="grid grid-cols-3 border-b border-border/50 text-sm">
              <div className="p-4 text-muted-foreground">Dropbox</div>
              <div className="p-4 text-center font-mono text-xs text-muted-foreground">
                ~15 Mbps
              </div>
              <div className="p-4 text-right text-muted-foreground">~45 min</div>
            </div>
            <div className="grid grid-cols-3 border-b border-border/50 text-sm">
              <div className="p-4 text-muted-foreground">Google Drive</div>
              <div className="p-4 text-center font-mono text-xs text-muted-foreground">
                ~15 Mbps
              </div>
              <div className="p-4 text-right text-muted-foreground">~45 min</div>
            </div>
            <div className="grid grid-cols-3 text-sm bg-accent/5">
              <div className="p-4 font-medium text-foreground">Graphite</div>
              <div className="p-4 text-center font-mono text-xs text-success font-medium">
                1+ Gbps
              </div>
              <div className="p-4 text-right text-success font-medium">59 sec</div>
            </div>
          </div>

          {/* Decorative line */}
          <div className="mt-16 h-px w-32 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
