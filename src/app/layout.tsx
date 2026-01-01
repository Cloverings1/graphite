import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Graphite - Your files, faster",
  description:
    "Blazing fast cloud storage. No throttling. No limits. Your full internet speed, every time.",
  keywords: [
    "cloud storage",
    "fast upload",
    "file storage",
    "creators",
    "video editing",
  ],
  authors: [{ name: "Graphite" }],
  openGraph: {
    title: "Graphite - Your files, faster",
    description:
      "Cloud storage that actually uses your internet speed. No throttling. No limits. Just fast.",
    type: "website",
  },
};

const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#64748b",
    colorBackground: "#09090b",
    colorInputBackground: "#18181b",
    colorInputText: "#fafafa",
    colorText: "#fafafa",
    colorTextSecondary: "#a1a1aa",
    colorDanger: "#dc2626",
    colorSuccess: "#22c55e",
    borderRadius: "0.5rem",
  },
  elements: {
    card: "bg-[#09090b] border border-[#18181b]",
    headerTitle: "text-white",
    headerSubtitle: "text-zinc-400",
    socialButtonsBlockButton: "bg-[#18181b] border-[#27272a] hover:bg-[#27272a]",
    formButtonPrimary: "bg-slate-500 hover:bg-slate-600",
    footerActionLink: "text-slate-400 hover:text-slate-300",
    userButtonAvatarBox: "w-8 h-8 rounded-full",
    userButtonAvatarImage: "rounded-full",
    avatarBox: "bg-[#18181b] border border-[#27272a]",
    avatarImage: "rounded-full",
    userButtonPopoverCard: "bg-[#09090b] border border-[#18181b]",
    userButtonPopoverActionButton: "hover:bg-[#18181b]",
    userButtonPopoverActionButtonText: "text-zinc-300",
    userButtonPopoverFooter: "hidden",
    userPreviewAvatarBox: "bg-[#18181b]",
    userPreviewTextContainer: "text-zinc-300",
  },
};

// Temporarily disabled - enable after adding Vercel domain to Clerk dashboard
// Go to: https://dashboard.clerk.com → Your App → Domains → Add: graphite-dou5.vercel.app
const hasClerkKey = false; // !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );

  // If Clerk is not configured, render without ClerkProvider
  if (!hasClerkKey) {
    return content;
  }

  return (
    <ClerkProvider appearance={clerkAppearance}>
      {content}
    </ClerkProvider>
  );
}
