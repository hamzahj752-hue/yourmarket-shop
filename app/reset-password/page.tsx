"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
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

function WaveLayer({ path, color, className = "" }: { path: string; color: string; className?: string }) {
  return (
    <svg viewBox={`0 0 120 ${WAVE_HEIGHT}`} preserveAspectRatio="none" aria-hidden="true" className={`pointer-events-none absolute inset-y-0 h-full ${className}`} style={{ color, maskImage: "linear-gradient(to right, black, black 55%, transparent)", WebkitMaskImage: "linear-gradient(to right, black, black 55%, transparent)" }}>
      <path d={path} fill="currentColor" />
    </svg>
  );
}

function LeafSvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <path d="M100 14C58 16 22 48 20 88c40 3 78-30 80-74Z" fill="currentColor" opacity="0.9" />
      <path d="M26 86c24-26 44-40 62-50" stroke="white" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ArchSvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="3" className={className} aria-hidden="true">
      <path d="M40 196c-12-58 8-100 34-128M160 196c12-58-8-100-34-128M40 196h120" />
      <path d="M64 196c-8-44 6-74 24-96M136 196c8-44-6-74-24-96M64 196h72" />
      <circle cx="100" cy="70" r="10" />
    </svg>
  );
}

function LockIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>);
}

function EyeIcon({ off }: { off?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      {off ? (<><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></>) : (<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>)}
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16 text-[#2a5232]" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" />
    </svg>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#2a5232] text-xl font-black text-white shadow-[0_10px_25px_-8px_rgba(42,82,50,0.6)]">Y</span>
      <span className="text-xl font-black tracking-[0.18em] text-[#1a2419]">YOUR<span className="text-[#2a5232]">MARKET</span></span>
    </div>
  );
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [reset, setReset] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords don’t match.");
      return;
    }
    setSubmitting(true);
    try {
      const { error: updateError } = await supabaseClient.auth.updateUser({
        password,
      });
      if (updateError) {
        setError(
          updateError.message ||
            "Could not reset your password. The link may have expired — request a new one.",
        );
        return;
      }
      setReset(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] lg:bg-[radial-gradient(110%_90%_at_50%_-10%,#12231a_0%,#0a0a0a_70%)]">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[radial-gradient(130%_105%_at_82%_12%,#3f6f49_0%,#2a5232_34%,#173525_68%,#0b2013_100%)] lg:hidden">
        <div className="absolute -left-20 -top-16 h-80 w-80 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="absolute -right-16 top-1/3 h-72 w-72 rounded-full bg-lime-200/15 blur-3xl" />
        <ArchSvg className="absolute -right-20 top-16 h-72 w-72 rotate-12 text-white opacity-20" />
        <LeafSvg className="absolute right-4 top-24 h-24 w-24 rotate-12 text-emerald-100" />
      </div>

      <div className="relative mx-auto w-full max-w-[560px] px-4 py-10 sm:px-6 sm:py-14 lg:max-w-[1320px] lg:px-10 lg:py-16 xl:px-14">
        <div className="lg:mx-auto lg:grid lg:max-w-[1180px] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:overflow-hidden lg:rounded-[2.5rem] lg:shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]">
          <div className="relative rounded-[2rem] bg-white/60 px-6 py-10 shadow-[0_30px_60px_-30px_rgba(10,20,12,0.6)] ring-1 ring-white/30 backdrop-blur-xl sm:px-10 sm:py-12 lg:flex lg:min-h-[600px] lg:flex-col lg:justify-center lg:rounded-none lg:bg-[linear-gradient(160deg,#fbf8f1_0%,#f4eee0_48%,#eee7d6_100%)] lg:px-14 lg:py-16 lg:shadow-none lg:ring-0 lg:backdrop-blur-0 xl:px-20">
            <div className="mx-auto w-full min-w-0 max-w-[480px]">
              <div className="lg:hidden"><Brand /></div>
              <div className="sr-only lg:not-sr-only"><Brand /></div>

              <div className="mt-8 lg:mt-0">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7a6f52]">Set new password</p>
                <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#1a2419] sm:text-4xl">
                  Reset your <span className="text-[#2a5232]">password</span>
                </h1>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#6f6d5f]">
                  Enter your new password below. Make sure it is at least 8 characters long.
                </p>
              </div>

              {!reset ? (
                <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="newPassword" className="text-sm font-medium text-[#6f6d5f]">New Password</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#9a937f]"><LockIcon /></span>
                      <input id="newPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Min 8 characters" value={password} onChange={(e) => { setPassword(e.target.value); setError(null); }} className="w-full rounded-2xl border border-white/80 bg-white/75 py-4 pl-12 pr-12 text-[15px] text-[#1a2419] shadow-sm outline-none transition placeholder:text-[#b0aa98] focus:border-[#37663f] focus:ring-2 focus:ring-[#37663f]/20" />
                      <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((v) => !v)} className="absolute inset-y-0 right-4 flex items-center text-[#9a937f] transition-colors hover:text-[#37663f]">
                        <EyeIcon off={showPassword} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-[#6f6d5f]">Confirm Password</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#9a937f]"><LockIcon /></span>
                      <input id="confirmPassword" type={showConfirm ? "text" : "password"} autoComplete="new-password" placeholder="Repeat your password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }} className="w-full rounded-2xl border border-white/80 bg-white/75 py-4 pl-12 pr-12 text-[15px] text-[#1a2419] shadow-sm outline-none transition placeholder:text-[#b0aa98] focus:border-[#37663f] focus:ring-2 focus:ring-[#37663f]/20" />
                      <button type="button" aria-label={showConfirm ? "Hide password" : "Show password"} onClick={() => setShowConfirm((v) => !v)} className="absolute inset-y-0 right-4 flex items-center text-[#9a937f] transition-colors hover:text-[#37663f]">
                        <EyeIcon off={showConfirm} />
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p role="alert" className="rounded-2xl border border-rose-300/60 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                      {error}
                    </p>
                  )}

                  <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-[#2a5232] py-4 text-[15px] font-semibold text-white shadow-[0_12px_30px_-12px_rgba(42,82,50,0.65)] transition-all duration-200 hover:bg-[#37663f] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">
                    {submitting ? "Resetting…" : "Reset Password"}
                  </button>
                </form>
              ) : (
                <div className="mt-8 flex flex-col items-center text-center">
                  <CheckCircleIcon />
                  <p className="mt-6 text-lg font-bold text-[#1a2419]">Password reset successfully</p>
                  <p className="mt-2 text-sm text-[#6f6d5f]">
                    Your password has been updated. You can now log in with your new password.
                  </p>
                  <Link href="/login" className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#2a5232] px-8 py-4 text-[15px] font-semibold text-white shadow-[0_12px_30px_-12px_rgba(42,82,50,0.65)] transition-all duration-200 hover:bg-[#37663f] active:scale-[0.99]">
                    Go to Log in
                  </Link>
                  <p className="mt-4 text-xs text-[#9a937f]">
                    You can close this tab once your password is saved.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="relative hidden bg-[linear-gradient(165deg,#22402a_0%,#173425_55%,#0b2013_100%)] lg:block lg:min-h-[600px]">
            <div aria-hidden="true" className="absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
            <ArchSvg className="absolute right-8 top-10 h-56 w-56 text-white opacity-15" />
            <LeafSvg className="absolute right-16 bottom-24 h-24 w-24 rotate-12 text-emerald-200" />
            <WaveLayer path={BACK_WAVE} color="#e0d9c6" className="-left-[13rem] z-[2] w-[25rem]" />
            <WaveLayer path={FRONT_WAVE} color="#f6f2e7" className="-left-[9rem] z-[3] w-[20rem]" />

            <div className="relative z-10 flex min-h-[600px] flex-col justify-between pl-48 pr-10 py-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-100/70">YOURMARKET&nbsp;Security</p>
              <div className="max-w-sm">
                <h2 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white xl:text-5xl">
                  Fresh start, <span className="italic text-emerald-200">fresh password.</span>
                </h2>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-emerald-100/60">
                <span className="h-px w-10 bg-emerald-100/40" />Est.&nbsp;2021&nbsp;—&nbsp;Johannesburg
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
