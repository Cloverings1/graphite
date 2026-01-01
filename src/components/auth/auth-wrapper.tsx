"use client";

import { ReactNode, useState, useEffect } from "react";
import {
  SignInButton as ClerkSignInButton,
  SignUpButton as ClerkSignUpButton,
  SignedIn as ClerkSignedIn,
  SignedOut as ClerkSignedOut,
  UserButton as ClerkUserButton,
  SignOutButton as ClerkSignOutButton,
} from "@clerk/nextjs";

// Check if Clerk is configured
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Hook to check if we're on the client (after hydration)
function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
}

// Wrapper components that fall back gracefully when Clerk is not configured
// or during server-side rendering
export function SignedOut({ children }: { children: ReactNode }) {
  const isClient = useIsClient();

  // During SSR or when Clerk is not configured, show signed out content
  if (!isClient || !isClerkConfigured) {
    return <>{children}</>;
  }
  return <ClerkSignedOut>{children}</ClerkSignedOut>;
}

export function SignedIn({ children }: { children: ReactNode }) {
  const isClient = useIsClient();

  // During SSR or when Clerk is not configured, hide signed in content
  if (!isClient || !isClerkConfigured) {
    return null;
  }
  return <ClerkSignedIn>{children}</ClerkSignedIn>;
}

export function SignInButton({
  children,
  mode,
}: {
  children: ReactNode;
  mode?: "modal" | "redirect";
}) {
  const isClient = useIsClient();

  if (!isClient || !isClerkConfigured) {
    return <>{children}</>;
  }
  return <ClerkSignInButton mode={mode}>{children}</ClerkSignInButton>;
}

export function SignUpButton({
  children,
  mode,
}: {
  children: ReactNode;
  mode?: "modal" | "redirect";
}) {
  const isClient = useIsClient();

  if (!isClient || !isClerkConfigured) {
    return <>{children}</>;
  }
  return <ClerkSignUpButton mode={mode}>{children}</ClerkSignUpButton>;
}

export function UserButton({ afterSignOutUrl }: { afterSignOutUrl?: string }) {
  const isClient = useIsClient();

  if (!isClient || !isClerkConfigured) {
    return null;
  }
  return <ClerkUserButton afterSignOutUrl={afterSignOutUrl} />;
}

export function SignOutButton({
  children,
  redirectUrl,
}: {
  children: ReactNode;
  redirectUrl?: string;
}) {
  const isClient = useIsClient();

  if (!isClient || !isClerkConfigured) {
    return <>{children}</>;
  }
  return <ClerkSignOutButton redirectUrl={redirectUrl}>{children}</ClerkSignOutButton>;
}
