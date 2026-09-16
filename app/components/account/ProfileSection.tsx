"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/auth-context";
import { fetchProfile, upsertProfile } from "@/app/lib/shop-service";
import { supabaseClient } from "@/app/lib/supabase/client";
import { CheckIcon, PencilIcon } from "./icons";
import { Field, Panel, SectionHeader, inputClasses } from "./ui";

export default function ProfileSection() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const email = user.email ?? "";
    fetchProfile(user.id).then((profile) => {
      setForm((prev) => ({
        ...prev,
        name: profile?.full_name ?? "",
        email,
        phone: profile?.phone ?? "",
        dateOfBirth: profile?.date_of_birth ?? "",
      }));
    });
  }, [user]);

  function update(key: keyof typeof form) {
    return (value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setSaved(false);
      setError("");
    };
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      const result = await upsertProfile({
        full_name: form.name.trim(),
        phone: form.phone.trim(),
        date_of_birth: form.dateOfBirth || null,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (form.email.trim() !== (user.email ?? "")) {
        const { error: emailError } = await supabaseClient.auth.updateUser({
          email: form.email.trim(),
        });
        if (emailError) {
          setError("Could not update your email. Please try again.");
          return;
        }
      }
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2600);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section aria-labelledby="profile-heading">
      <SectionHeader
        eyebrow="My Profile"
        title="Personal information"
        description="Keep your details up to date so orders, delivery and support stay smooth."
      />

      <Panel className="mt-5 p-4 sm:p-8">
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-5">
          <Field label="Full Name">
            <input
              type="text"
              className={inputClasses}
              value={form.name}
              onChange={(e) => update("name")(e.target.value)}
            />
          </Field>

          <Field label="Email" hint="Changing this sends a confirmation email">
            <input
              type="email"
              className={inputClasses}
              value={form.email}
              onChange={(e) => update("email")(e.target.value)}
            />
          </Field>

          <Field label="Phone" hint="Visible to you only">
            <input
              type="tel"
              className={inputClasses}
              value={form.phone}
              onChange={(e) => update("phone")(e.target.value)}
            />
          </Field>

          <Field label="Date of Birth">
            <input
              type="date"
              className={inputClasses}
              value={form.dateOfBirth}
              onChange={(e) => update("dateOfBirth")(e.target.value)}
            />
          </Field>

          <Field label="Gender" hint="Optional">
            <div className="relative">
              <select
                className={`${inputClasses} appearance-none pr-10`}
                value={form.gender}
                onChange={(e) => update("gender")(e.target.value)}
              >
                <option value="" className="bg-surface">
                  Select… (optional)
                </option>
                <option value="Female" className="bg-surface">
                  Female
                </option>
                <option value="Male" className="bg-surface">
                  Male
                </option>
                <option value="Non-binary" className="bg-surface">
                  Non-binary
                </option>
                <option value="Prefer not to say" className="bg-surface">
                  Prefer not to say
                </option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>
          </Field>

          <div className="flex items-end sm:col-span-2">
            <div className="flex items-center gap-3">
              {saved ? (
                <span className="inline-flex flex-1 items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-400">
                  <CheckIcon className="h-4 w-4" />
                  Saved
                </span>
              ) : (
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover disabled:opacity-60"
                >
                  <PencilIcon className="h-4 w-4" />
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              )}
              {error && <span className="text-sm text-rose-400">{error}</span>}
            </div>
          </div>
        </div>
      </Panel>

      <p className="mt-4 text-xs text-muted">
        Your profile is synced with your YOURMARKET account.
      </p>
    </section>
  );
}