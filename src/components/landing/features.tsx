import { Zap, Shield, Upload } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Blazing Fast",
    description: "Max out your connection. Every time.",
    detail: "940 Mbps",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "End-to-end encryption. Your files, yours.",
    detail: "AES-256",
  },
  {
    icon: Upload,
    title: "Simple",
    description: "Drag. Drop. Done.",
    detail: "Zero friction",
  },
];

export function Features() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif">
            Built for <span className="italic text-gradient">speed</span>
          </h2>
          <p className="mt-4 text-foreground-muted max-w-lg mx-auto">
            Everything you need, nothing you don&apos;t.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl glass glass-border p-8 transition-all duration-500 hover:border-accent/30 hover-shine"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon container */}
              <div className="mb-6 inline-flex rounded-xl bg-accent/10 p-3 transition-all duration-300 group-hover:bg-accent/20 group-hover:shadow-lg group-hover:shadow-accent/10">
                <feature.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h3 className="mb-2 text-xl font-medium tracking-tight">
                {feature.title}
              </h3>
              <p className="text-foreground-muted text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Detail badge */}
              <div className="mt-6 pt-6 border-t border-border/50">
                <span className="text-xs font-mono text-accent tracking-wider">
                  {feature.detail}
                </span>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
