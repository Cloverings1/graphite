export function SocialProof() {
  const companies = ["Studio A", "Creative Co", "Media Labs", "Design Inc", "Film Pro"];

  return (
    <section className="py-16 border-y border-border/50 bg-background-secondary/30">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs tracking-widest uppercase text-muted mb-10">
          Trusted by creators and startups
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
          {companies.map((name, index) => (
            <div
              key={name}
              className="text-xl font-serif italic text-muted-foreground/30 transition-colors duration-300 hover:text-muted-foreground/60"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
