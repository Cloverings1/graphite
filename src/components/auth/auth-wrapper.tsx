"use client";

import { ReactNode } from "react";

// CLERK DISABLED - To enable:
// 1. Add your Vercel domain to Clerk Dashboard → Domains
// 2. Set ENABLE_CLERK=true below
const ENABLE_CLERK = false;

// Stub components that render without Clerk
export function SignedOut({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function SignedIn({ children }: { children: ReactNode }) {
  if (!ENABLE_CLERK) return null;
  return <>{children}</>;
}

export function SignInButton({
  children,
}: {
  children: ReactNode;
  mode?: "modal" | "redirect";
}) {
  return <>{children}</>;
}

export function SignUpButton({
  children,
}: {
  children: ReactNode;
  mode?: "modal" | "redirect";
}) {
  return <>{children}</>;
}

export function UserButton({ afterSignOutUrl }: { afterSignOutUrl?: string }) {
  return null;
}

export function SignOutButton({
  children,
}: {
  children: ReactNode;
  redirectUrl?: string;
}) {
  return <>{children}</>;
}
