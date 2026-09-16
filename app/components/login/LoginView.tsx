"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { supabaseClient } from "@/app/lib/supabase/client";

const WAVE_HEIGHT = 1600;
const WAVE_STEP = 96;

function scallopPath(bump: number) {
  let d = `M0,0`;
  for (let y = 0; y < WAVE_HEIGHT; y += WAVE_STEP) {
    const y2 = y + WAVE_STEP;
    d += `C ${-bump} ${y + WAVE_STEP * 0.5}, ${bump} ${y + WAVE_STEP * 0.5}, 0 ${y2}`;
  }
  d += ` L120 ${WAVE_HEIGHT} L120 0 Z`;
  return d;
}

const FRONT_WAVE = scallopPath(84);
const BACK_WAVE = scallopPath(116);

function WaveLayer({
  path,
  color,
  className = "",
}: {
  path: string;
  color: string;
  className?: string;
}) {
  return (
    <svg
      viewBox={`0 0 120 ${WAVE_HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 h-full ${className}`}
      style={{
        color,
        maskImage: "linear-gradient(to right, black, black 55%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, black, black 55%, transparent)",
      }}
    >
      <path d={path} fill="currentColor" />
    </svg>
  );
}

function LeafSvg({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M100 14C58 16 22 48 20 88c40 3 78-30 80-74Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path d="M26 86c24-26 44-40 62-50" stroke="white" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ArchSvg({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      className={className}
      aria-hidden="true"
    >
      <path d="M40 196c-12-58 8-100 34-128M160 196c12-58-8-100-34-128M40 196h120" />
      <path d="M64 196c-8-44 6-74 24-96M136 196c8-44-6-74-24-96M64 196h72" />
      <circle cx="100" cy="70" r="10" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon({ off }: { off?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {off ? (
        <>
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <line x1="2" x2="22" y1="2" y2="22" />
        </>
      ) : (
        <>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3 text-white"
      aria-hidden="true"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#2a5232] text-xl font-black text-white shadow-[0_10px_25px_-8px_rgba(42,82,50,0.6)]">
        Y
      </span>
      <span className="text-xl font-black tracking-[0.18em] text-[#1a2419]">
        YOUR
        <span className="text-[#2a5232]">MARKET</span>
      </span>
    </div>
  );
}

export default function LoginView({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remembered, setRemembered] = useState(true);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { data, error: signInError } =
        await supabaseClient.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
      if (signInError || !data.user) {
        setError(
          signInError?.message === "Invalid login credentials"
            ? "The email or password is incorrect."
            : signInError?.message || "Could not log you in. Please try again.",
        );
        return;
      }
      setUser(data.user);
      router.replace(nextPath && nextPath.startsWith("/") ? nextPath : "/account");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] lg:bg-[radial-gradient(110%_90%_at_50%_-10%,#12231a_0%,#0a0a0a_70%)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden bg-[radial-gradient(130%_105%_at_82%_12%,#3f6f49_0%,#2a5232_34%,#173525_68%,#0b2013_100%)] lg:hidden"
      >
        <div className="absolute -left-20 -top-16 h-80 w-80 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="absolute -right-16 top-1/3 h-72 w-72 rounded-full bg-lime-200/15 blur-3xl" />
        <div className="absolute bottom-24 left-8 h-40 w-40 rounded-full bg-emerald-200/10 blur-2xl" />
        <ArchSvg className="absolute -right-20 top-16 h-72 w-72 rotate-12 text-white opacity-20" />
        <LeafSvg className="absolute right-4 top-24 h-24 w-24 rotate-12 text-emerald-100" />
        <LeafSvg className="absolute bottom-16 left-3 h-20 w-20 -rotate-45 text-lime-100" />
      </div>

      <div className="relative mx-auto w-full max-w-[560px] px-4 py-10 sm:px-6 sm:py-14 lg:max-w-[1320px] lg:px-10 lg:py-16 xl:px-14">
        <div className="lg:mx-auto lg:grid lg:max-w-[1180px] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:overflow-hidden lg:rounded-[2.5rem] lg:shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]">
          <div className="relative rounded-[2rem] bg-white/60 px-6 py-10 shadow-[0_30px_60px_-30px_rgba(10,20,12,0.6)] ring-1 ring-white/30 backdrop-blur-xl sm:px-10 sm:py-12 lg:flex lg:min-h-[720px] lg:flex-col lg:justify-center lg:rounded-none lg:bg-[linear-gradient(160deg,#fbf8f1_0%,#f4eee0_48%,#eee7d6_100%)] lg:px-14 lg:py-16 lg:shadow-none lg:ring-0 lg:backdrop-blur-0 xl:px-20">
            <div className="mx-auto w-full min-w-0 max-w-[480px]">
              <div className="lg:hidden">
                <Brand />
              </div>

              <div className="sr-only lg:not-sr-only">
                <Brand />
              </div>

              <div className="mt-10 lg:mt-0">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7a6f52]">
                  Welcome back
                </p>
                <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-[#1a2419] sm:text-4xl">
                  Log in to{" "}
                  <span className="text-[#2a5232]">YOURMARKET</span>
                </h1>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#6f6d5f]">
                  Sign in to continue to your premium shopping experience.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-6 space-y-4 sm:space-y-5"
              >
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-[#6f6d5f]"
                  >
                    Email or phone
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#9a937f]">
                      <MailIcon />
                    </span>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      className="w-full rounded-2xl border border-white/80 bg-white/75 py-3 pl-12 pr-4 text-[15px] text-[#1a2419] shadow-sm outline-none transition placeholder:text-[#b0aa98] focus:border-[#37663f] focus:ring-2 focus:ring-[#37663f]/20 sm:py-4"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-[#6f6d5f]"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-semibold text-[#37663f] transition-colors hover:text-[#1d4024]"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#9a937f]">
                      <LockIcon />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      className="w-full rounded-2xl border border-white/80 bg-white/75 py-3 pl-12 pr-12 text-[15px] text-[#1a2419] shadow-sm outline-none transition placeholder:text-[#b0aa98] focus:border-[#37663f] focus:ring-2 focus:ring-[#37663f]/20 sm:py-4"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-4 flex items-center text-[#9a937f] transition-colors hover:text-[#37663f]"
                    >
                      <EyeIcon off={showPassword} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={remembered}
                    onClick={() => setRemembered((v) => !v)}
                    className="flex items-center gap-2.5 text-sm text-[#6f6d5f] transition-colors hover:text-[#1a2419]"
                  >
                    <span
                      className={`grid h-5 w-5 place-items-center rounded-md border transition-colors ${
                        remembered
                          ? "border-[#2a5232] bg-[#2a5232]"
                          : "border-[#c9c2ae] bg-white/80"
                      }`}
                    >
                      {remembered && <CheckIcon />}
                    </span>
                    Remember me
                  </button>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-2xl border border-rose-300/60 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl bg-[#2a5232] py-3 text-[15px] font-semibold text-white shadow-[0_12px_30px_-12px_rgba(42,82,50,0.65)] transition-all duration-200 hover:bg-[#37663f] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
                >
                  {submitting ? "Logging in…" : "Log in"}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <span className="h-px flex-1 bg-black/10" />
                <span className="text-xs font-medium uppercase tracking-widest text-[#9a937f]">
                  or continue with
                </span>
                <span className="h-px flex-1 bg-black/10" />
              </div>

              <button
                type="button"
                onClick={async () => {
                  setError(null);
                  const { error: oauthError } = await supabaseClient.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                      redirectTo: `${window.location.origin}/auth/callback`,
                    },
                  });
                  if (oauthError) setError(oauthError.message);
                }}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white/85 py-3 text-[15px] font-semibold text-[#1a2419] shadow-sm transition hover:bg-white hover:shadow-md active:scale-[0.99] sm:py-4"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <p className="mt-6 text-center text-sm text-[#6f6d5f]">
                New to YOURMARKET?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-[#2a5232] transition-colors hover:text-[#1d4024]"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          <div className="relative hidden bg-[linear-gradient(165deg,#22402a_0%,#173425_55%,#0b2013_100%)] lg:block lg:min-h-[720px]">
            <div aria-hidden="true" className="absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
            <div aria-hidden="true" className="absolute -left-16 bottom-10 h-72 w-72 rounded-full bg-lime-300/10 blur-3xl" />
            <ArchSvg className="absolute right-8 top-10 h-56 w-56 text-white opacity-15" />
            <LeafSvg className="absolute right-16 bottom-24 h-24 w-24 rotate-12 text-emerald-200" />
            <LeafSvg className="absolute right-40 top-36 h-14 w-14 -rotate-45 text-lime-200" />

            <WaveLayer path={BACK_WAVE} color="#e0d9c6" className="-left-[13rem] z-[2] w-[25rem]" />
            <WaveLayer path={FRONT_WAVE} color="#f6f2e7" className="-left-[9rem] z-[3] w-[20rem]" />

            <div className="relative z-10 flex min-h-[720px] flex-col justify-between pl-48 pr-10 py-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-100/70">
                YOURMARKET&nbsp;Members
              </p>

              <div className="max-w-sm">
                <h2 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white xl:text-5xl">
                  The art of shopping{" "}
                  <span className="italic text-emerald-200">better.</span>
                </h2>
                <div className="mt-8 rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15 backdrop-blur-md">
                  <p className="text-sm leading-relaxed text-emerald-50/90">
                    Members-only drops, early access and a checkout as smooth as
                    silk.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-emerald-100/60">
                <span className="h-px w-10 bg-emerald-100/40" />
                Est.&nbsp;2021&nbsp;—&nbsp;Johannesburg
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}