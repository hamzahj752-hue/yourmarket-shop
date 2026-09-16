"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/app/context/auth-context";
import {
  deleteAddress,
  fetchAddresses,
  upsertAddress,
} from "@/app/lib/shop-service";
import type { AddressRow } from "@/app/types/shop";
import { CheckIcon, LogoutIcon, MapPinIcon, PencilIcon, PlusIcon, TrashIcon, UserIcon } from "./icons";
import { Panel, SectionHeader, inputClasses } from "./ui";

const kindIcon: Record<string, typeof MapPinIcon> = {
  Home: UserIcon,
  Work: LogoutIcon,
};

const kindIconClass: Record<string, string> = {
  Home: "bg-accent/10 border-accent/40 text-accent",
  Work: "bg-cyan-400/10 border-cyan-400/40 text-cyan-400",
};

const emptyDraft = {
  label: "Home",
  full_name: "",
  phone: "",
  street: "",
  city: "",
  country: "United States",
};

export default function AddressesSection() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [addresses, setAddresses] = useState<AddressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<AddressRow | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!userId) return;
    const list = await fetchAddresses(userId);
    setAddresses(list);
  }, [userId]);

  useEffect(() => {
    let active = true;
    if (!userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAddresses([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchAddresses(userId)
      .then((list) => {
        if (active) setAddresses(list);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const draftState = adding ? "adding" : editing ? "editing" : "closed";

  function openAdd() {
    setEditing(null);
    setDraft(emptyDraft);
    setAdding(true);
  }

  function openEdit(address: AddressRow) {
    setAdding(false);
    setEditing(address);
    setDraft({
      label: address.label ?? "Home",
      full_name: address.full_name ?? "",
      phone: address.phone ?? "",
      street: address.street ?? "",
      city: address.city ?? "",
      country: address.country ?? "",
    });
  }

  function closeDraft() {
    setAdding(false);
    setEditing(null);
  }

  async function setDefault(id: string) {
    if (!userId || busyId) return;
    setBusyId(id);
    await upsertAddress(userId, { id, is_default: true });
    await reload();
    setBusyId(null);
  }

  async function remove(id: string) {
    if (!userId || busyId) return;
    setBusyId(id);
    await deleteAddress(userId, id);
    await reload();
    setBusyId(null);
  }

  async function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId || saving) return;
    setSaving(true);
    const result = await upsertAddress(userId, {
      id: editing?.id,
      label: draft.label || "Home",
      full_name: draft.full_name,
      street: draft.street,
      city: draft.city,
      country: draft.country,
      phone: draft.phone,
    });
    if (result.ok) {
      closeDraft();
      await reload();
    }
    setSaving(false);
  }

  return (
    <section aria-labelledby="addresses-heading">
      <SectionHeader
        eyebrow="Saved Addresses"
        title="Delivery addresses"
        description="Manage the addresses you ship to. Your default is selected at checkout."
      />

      {loading && addresses.length === 0 ? (
        <p className="mt-6 text-sm text-muted">Loading addresses…</p>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
          {addresses.map((address) => {
            const KindIcon = kindIcon[address.label ?? ""] ?? MapPinIcon;
            const tone = kindIconClass[address.label ?? ""] ?? "bg-surface border-border text-muted";
            return (
              <Panel key={address.id} className="flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border ${tone}`}
                    >
                      <KindIcon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-foreground">{address.label ?? "Home"}</p>
                      <p className="text-xs text-muted">{address.full_name ?? ""}</p>
                    </div>
                  </div>
                  {address.is_default && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-accent">
                      <MapPinIcon className="h-3 w-3" />
                      Default
                    </span>
                  )}
                </div>

                <address className="mt-4 not-italic text-sm leading-relaxed text-muted">
                  {address.street}
                  <br />
                  {address.city}
                  <br />
                  {address.country}
                  {address.phone ? (
                    <>
                      <br />
                      {address.phone}
                    </>
                  ) : null}
                </address>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  {!address.is_default && (
                    <button
                      type="button"
                      onClick={() => setDefault(address.id)}
                      disabled={busyId === address.id}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
                    >
                      <CheckIcon className="h-3.5 w-3.5" />
                      Set Default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openEdit(address)}
                    disabled={busyId === address.id}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
                  >
                    <PencilIcon className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(address.id)}
                    disabled={busyId === address.id}
                    aria-label={`Delete ${address.label ?? "address"}`}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-rose-400 hover:text-rose-400 disabled:opacity-50"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </Panel>
            );
          })}

          <button
            type="button"
            onClick={openAdd}
            className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-8 text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border">
              <PlusIcon className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold uppercase tracking-widest">
              Add Address
            </span>
          </button>
        </div>
      )}

      {draftState !== "closed" && (
        <Panel className="mt-5 p-4 sm:p-8">
          <h3 className="text-base font-bold text-foreground">
            {draftState === "adding" ? "Add a new address" : "Edit address"}
          </h3>
          <form onSubmit={saveDraft} className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                Label
              </span>
              <input
                type="text"
                placeholder="e.g. Home, Work, Annex"
                className={inputClasses}
                value={draft.label}
                onChange={(e) => setDraft((prev) => ({ ...prev, label: e.target.value }))}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                Full name
              </span>
              <input
                type="text"
                placeholder="Alex Morgan"
                className={inputClasses}
                value={draft.full_name}
                onChange={(e) => setDraft((prev) => ({ ...prev, full_name: e.target.value }))}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                Street address
              </span>
              <input
                type="text"
                placeholder="Street, building, apartment"
                className={inputClasses}
                value={draft.street}
                onChange={(e) => setDraft((prev) => ({ ...prev, street: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                City / State / ZIP
              </span>
              <input
                type="text"
                placeholder="Portland, OR 97205"
                className={inputClasses}
                value={draft.city}
                onChange={(e) => setDraft((prev) => ({ ...prev, city: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                Country
              </span>
              <input
                type="text"
                placeholder="United States"
                className={inputClasses}
                value={draft.country}
                onChange={(e) => setDraft((prev) => ({ ...prev, country: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                Phone
              </span>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                className={inputClasses}
                value={draft.phone}
                onChange={(e) => setDraft((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </label>
            <div className="mt-5 flex flex-wrap gap-2.5 sm:col-span-2 sm:gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover disabled:opacity-60"
              >
                <CheckIcon className="h-4 w-4" />
                {draftState === "adding" ? "Save Address" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={closeDraft}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Cancel
              </button>
            </div>
          </form>
        </Panel>
      )}

      <p className="mt-4 text-xs text-muted">
        Addresses are saved to your account and reused at checkout.
      </p>
    </section>
  );
}