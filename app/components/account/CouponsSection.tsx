"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/app/lib/supabase/client";
import type { CouponRow } from "@/app/types/shop";
import { CheckIcon, CopyIcon, TicketIcon } from "./icons";
import { Panel, SectionHeader } from "./ui";

const money = (value: number) => `$${value.toFixed(2)}`;

function discountLabel(coupon: CouponRow): string {
  if (coupon.type === "percentage") {
    return `${coupon.value}% off`;
  }
  return `${money(coupon.value)} off`;
}

function minOrderLabel(coupon: CouponRow): string {
  if (coupon.min_order != null && coupon.min_order > 0) {
    return `Min. order ${money(coupon.min_order)}`;
  }
  return "No minimum";
}

function expiryLabel(coupon: CouponRow): string {
  if (!coupon.expiry_date) return "No expiry";
  return `Expires ${new Date(coupon.expiry_date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

export default function CouponsSection() {
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data } = await supabaseClient
        .from("coupons")
        .select("code,type,value,min_order,max_discount,start_date,expiry_date,active")
        .eq("active", true)
        .order("value", { ascending: false });
      if (active) setCoupons((data as CouponRow[] | null) ?? []);
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  async function copyCode(id: string, code: string) {
    try {
      await navigator.clipboard?.writeText(code);
    } catch {
      // Clipboard unavailable — still show feedback.
    }
    setCopied(id);
    window.setTimeout(
      () => setCopied((prev) => (prev === id ? null : prev)),
      2400,
    );
  }

  return (
    <section aria-labelledby="coupons-heading">
      <SectionHeader
        eyebrow="Coupons"
        title="Coupons & offers"
        description="Active promo codes available to your account."
      />

      {loading ? (
        <p className="mt-6 text-sm text-muted">Loading coupons…</p>
      ) : coupons.length === 0 ? (
        <Panel className="mt-5 p-5 text-center">
          <TicketIcon className="mx-auto h-6 w-6 text-muted" />
          <p className="mt-3 text-sm text-muted">
            No active coupons right now — check back soon.
          </p>
        </Panel>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
          {coupons.map((coupon) => {
            const isCopied = copied === coupon.code;
            return (
              <Panel
                key={coupon.code}
                className="flex items-center gap-3 border-dashed p-5 transition-colors hover:border-accent/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                  <TicketIcon className="h-5 w-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-mono text-base font-bold tracking-wider text-foreground">
                    {coupon.code}
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-sm text-muted">
                    <span className="font-semibold text-accent">
                      {discountLabel(coupon)}
                    </span>
                    <span>{minOrderLabel(coupon)}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted/70">
                    {expiryLabel(coupon)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyCode(coupon.code, coupon.code)}
                  aria-label={`Copy code ${coupon.code}`}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${
                    isCopied
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
                      : "border-border bg-surface text-foreground hover:border-accent hover:text-accent"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <CheckIcon className="h-3.5 w-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-3.5 w-3.5" />
                      Copy Code
                    </>
                  )}
                </button>
              </Panel>
            );
          })}
        </div>
      )}

      <Panel className="mt-5 p-5">
        <p className="text-sm leading-relaxed text-muted">
          Coupons are validated against your account at checkout. Promo codes
          are applied to the order total.
        </p>
      </Panel>
    </section>
  );
}