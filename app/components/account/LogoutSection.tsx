"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { supabaseClient } from "@/app/lib/supabase/client";
import { CheckIcon, LogoutIcon } from "./icons";
import { Panel } from "./ui";

export default function LogoutSection({
  onCancel,
}: {
  onCancel?: () => void;
}) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [confirmed, setConfirmed] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleConfirm() {
    setSigningOut(true);
    await supabaseClient.auth.signOut();
    setUser(null);
    setConfirmed(true);
    setSigningOut(false);
  }

  if (confirmed) {
    return (
      <Panel className="mt-6 flex flex-col items-center gap-3 border-accent/30 px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
          <CheckIcon className="h-6 w-6" />
        </span>
        <div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            You&apos;ve logged out
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Thanks for stopping by. Your bag and wishlist will be waiting for
            you when you&apos;re back.
          </p>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover"
          >
            Back to Home
          </Link>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <LogoutIcon className="h-4 w-4" />
            Sign in again
          </button>
        </div>
      </Panel>
    );
  }

  return (
    <section aria-labelledby="logout-heading">
      <Panel className="flex flex-col items-center gap-3 px-6 py-14 text-center sm:gap-5 sm:py-16">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-400">
          <LogoutIcon className="h-6 w-6" />
        </span>
        <div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            Log out of YOURMARKET?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
            You&apos;ll need to sign in again to manage your account, orders and
            saved items. Your bag and wishlist stay saved to your account.
          </p>
        </div>
        <div className="mt-2 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            disabled={signingOut}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={signingOut}
            onClick={handleConfirm}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-rose-400 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-rose-300 disabled:opacity-60"
          >
            {signingOut ? "Signing out…" : "Confirm Logout"}
          </button>
        </div>
      </Panel>
    </section>
  );
}