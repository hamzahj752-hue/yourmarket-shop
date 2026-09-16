"use client";

import { useState } from "react";
import {
  CheckIcon,
  KeyIcon,
  LogoutIcon,
  MonitorIcon,
  ShieldIcon,
  TrashIcon,
} from "./icons";
import { Field, Panel, SectionHeader, inputClasses } from "./ui";

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors ${
        checked
          ? "border-accent/60 bg-accent"
          : "border-border bg-surface"
      }`}
    >
      <span
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-foreground transition-[left] duration-200 ${
          checked ? "left-[calc(100%-1.25rem)] bg-black" : "left-1"
        }`}
      />
    </button>
  );
}

export default function PrivacySection() {
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordSaved, setPasswordSaved] = useState(false);

  const [preferences, setPreferences] = useState({
    profileVisible: false,
    orderInsights: true,
    recommendations: true,
    usageData: false,
  });

  const [marketing, setMarketing] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const [confirmDelete, setConfirmDelete] = useState(false);

  function updatePassword(key: keyof typeof passwordForm) {
    return (value: string) => {
      setPasswordForm((prev) => ({ ...prev, [key]: value }));
      setPasswordSaved(false);
    };
  }

  function savePassword() {
    setPasswordSaved(true);
    setPasswordForm({ current: "", next: "", confirm: "" });
    window.setTimeout(() => setPasswordSaved(false), 2600);
  }

  const preferenceRows: { key: keyof typeof preferences; label: string; hint: string }[] = [
    { key: "profileVisible", label: "Public profile", hint: "Show your profile to other members" },
    { key: "orderInsights", label: "Order insights", hint: "Personal order trends and highlights" },
    { key: "recommendations", label: "Personalized recommendations", hint: "Tailor the shop to your taste" },
    { key: "usageData", label: "Usage analytics", hint: "Help us improve the experience" },
  ];

  const marketingRows: { key: keyof typeof marketing; label: string; hint: string }[] = [
    { key: "email", label: "Email", hint: "Offers, drops and editorial in your inbox" },
    { key: "sms", label: "SMS", hint: "Time-sensitive alerts and offers" },
    { key: "push", label: "Push notifications", hint: "Instant updates in your browser" },
  ];

  return (
    <section aria-labelledby="privacy-heading">
      <SectionHeader
        eyebrow="Privacy & Security"
        title="Control your account"
        description="Manage your password, privacy preferences and how we communicate with you."
      />

      <div className="mt-5 space-y-4">
        <Panel className="p-4 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
              <KeyIcon className="h-4 w-4" />
            </span>
            <h3 className="text-base font-bold text-foreground">Password</h3>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-4">
            <Field label="Current password">
              <input
                type="password"
                className={inputClasses}
                placeholder="••••••••"
                value={passwordForm.current}
                onChange={(e) => updatePassword("current")(e.target.value)}
              />
            </Field>
            <Field label="New password">
              <input
                type="password"
                className={inputClasses}
                placeholder="Min. 8 characters"
                value={passwordForm.next}
                onChange={(e) => updatePassword("next")(e.target.value)}
              />
            </Field>
            <Field label="Confirm new password">
              <input
                type="password"
                className={inputClasses}
                placeholder="Repeat new password"
                value={passwordForm.confirm}
                onChange={(e) => updatePassword("confirm")(e.target.value)}
              />
            </Field>
          </div>
          <div className="mt-4">
            {passwordSaved ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-400">
                <CheckIcon className="h-4 w-4" />
                Password updated
              </span>
            ) : (
              <button
                type="button"
                onClick={savePassword}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover"
              >
                <KeyIcon className="h-4 w-4" />
                Update Password
              </button>
            )}
          </div>
        </Panel>

        <Panel className="p-4 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
              <ShieldIcon className="h-4 w-4" />
            </span>
            <h3 className="text-base font-bold text-foreground">
              Privacy preferences
            </h3>
          </div>
          <div className="mt-5 divide-y divide-border">
            {preferenceRows.map((row) => (
              <div
                key={row.key}
                className="flex items-center justify-between gap-4 py-3 sm:py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{row.label}</p>
                  <p className="mt-0.5 text-sm text-muted">{row.hint}</p>
                </div>
                <Toggle
                  checked={preferences[row.key]}
                  label={row.label}
                  onChange={(value) =>
                    setPreferences((prev) => ({ ...prev, [row.key]: value }))
                  }
                />
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-4 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
              <LogoutIcon className="h-4 w-4" />
            </span>
            <h3 className="text-base font-bold text-foreground">
              Marketing communication
            </h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Choose where you want to hear from YOURMARKET. You can change these
            anytime.
          </p>
          <div className="mt-3 divide-y divide-border">
            {marketingRows.map((row) => (
              <div
                key={row.key}
                className="flex items-center justify-between gap-4 py-3 sm:py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{row.label}</p>
                  <p className="mt-0.5 text-sm text-muted">{row.hint}</p>
                </div>
                <Toggle
                  checked={marketing[row.key]}
                  label={row.label}
                  onChange={(value) =>
                    setMarketing((prev) => ({ ...prev, [row.key]: value }))
                  }
                />
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-4 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
              <MonitorIcon className="h-4 w-4" />
            </span>
            <h3 className="text-base font-bold text-foreground">
              Active sessions
            </h3>
          </div>
          <div className="mt-4 rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <MonitorIcon className="h-5 w-5 text-muted" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    This device · Chrome on Windows
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    Portland, OR · Current session
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Active
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted">
              Signed-in devices will appear here once Supabase auth is connected.
            </p>
            <button
              type="button"
              className="shrink-0 rounded-full border border-border bg-surface px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-accent"
            >
              Manage Sessions
            </button>
          </div>
        </Panel>

        <Panel className="border-rose-400/30 p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rose-400/40 bg-rose-400/10 text-rose-400">
                <TrashIcon className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Delete account
                </h3>
                <p className="mt-0.5 max-w-md text-sm leading-relaxed text-muted">
                  Permanently delete your account, orders and saved data. This
                  cannot be undone.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-rose-400/40 bg-rose-400/10 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-rose-400 transition-colors hover:bg-rose-400 hover:text-black"
            >
              <TrashIcon className="h-4 w-4" />
              Delete Account
            </button>
          </div>
        </Panel>
      </div>

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <Panel className="w-full max-w-md p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rose-400/40 bg-rose-400/10 text-rose-400">
                <TrashIcon className="h-5 w-5" />
              </span>
              <h3 id="delete-account-title" className="text-lg font-bold text-foreground">
                Delete your account?
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              This will permanently remove your profile, orders, addresses and
              saved items. This action cannot be undone.
            </p>
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                Keep my account
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-rose-400 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-rose-300"
              >
                Delete permanently
              </button>
            </div>
          </Panel>
        </div>
      )}
    </section>
  );
}