import { Logo } from "@/components/icons/logo";
import Link from "next/link";

const TALLY_FORM_URL = "https://tally.so/r/BzdXO4";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex h-14 items-center justify-between rounded-full glass glass-border px-6">
          <Link href="/" className="flex items-center opacity-0 animate-fade-in">
            <Logo />
          </Link>

          <div className="flex items-center gap-3 opacity-0 animate-fade-in delay-100">
            <a
              href={TALLY_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-5 py-2.5 text-sm font-medium overflow-hidden rounded-full bg-accent text-accent-foreground transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
            >
              <span className="relative z-10">Request Access</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent via-accent-muted to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
