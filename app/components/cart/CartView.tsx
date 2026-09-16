"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/auth-context";
import { useShopCounts } from "@/app/context/shop-context";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  TAX_RATE,
} from "@/app/data/cart";
import {
  fetchCart,
  removeCartItem,
  updateCartItemQuantity,
} from "@/app/lib/shop-service";
import type { ShopCartLine } from "@/app/types/shop";
import { validateCouponCode } from "@/app/actions/orders";
import {
  CheckIcon,
  CreditCardIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  TagIcon,
  TrashIcon,
  TruckIcon,
} from "./icons";

const money = (value: number) => `$${value.toFixed(2)}`;

type BagLine = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  color: { hex: string; name: string };
  size: string | null;
  price: number;
  compareAt: number | null;
  quantity: number;
  accent: string;
  stock: number;
};

function toBagLine(line: ShopCartLine): BagLine {
  return {
    id: line.id,
    slug: line.slug,
    brand: line.brandName,
    name: line.name,
    color: { hex: line.colorValue, name: line.colorName },
    size: line.size,
    price: line.price,
    compareAt: line.compareAt,
    quantity: line.quantity,
    accent: line.colorValue,
    stock: line.stock,
  };
}

export default function CartView() {
  const { user } = useAuth();
  const { refreshCounts } = useShopCounts();
  const [lines, setLines] = useState<BagLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState<{ code: string; discount: number } | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoBusy, setPromoBusy] = useState(false);

  useEffect(() => {
    let active = true;
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLines([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchCart(user.id)
      .then((items) => {
        if (active) {
          setLines(items.map(toBagLine));
          setApplied(null);
        }
      })
      .catch(() => {
        if (active) setLines([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-20 text-center">
        <p className="text-sm text-muted">
          Please log in to view your shopping bag.
        </p>
      </div>
    );
  }

  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );
  const discount = applied?.discount ?? 0;
  const delivery =
    subtotal - discount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const tax = (subtotal - discount + delivery) * TAX_RATE;
  const total = subtotal - discount + delivery + tax;

  const applyPromo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (promoBusy) return;
    const code = promoInput.trim();
    if (!code) return;
    setPromoBusy(true);
    setPromoError(null);
    try {
      const result = await validateCouponCode(code, subtotal);
      if (!result.ok) {
        setPromoError(result.error);
        setApplied(null);
        return;
      }
      setApplied({ code: result.code, discount: result.discount });
      setPromoInput("");
    } finally {
      setPromoBusy(false);
    }
  };

  const setQuantity = (id: string, quantity: number, stock: number) => {
    const next = Math.min(Math.max(1, quantity), Math.max(stock, 1));
    const previousQuantity = lines.find((line) => line.id === id)?.quantity;
    setLines((prev) =>
      prev.map((line) =>
        line.id === id ? { ...line, quantity: next } : line,
      ),
    );
    if (previousQuantity !== next) {
      updateCartItemQuantity(user.id, id, next).then((result) => {
        if (!result.ok) {
          setLines((prev) =>
            prev.map((line) =>
              line.id === id
                ? { ...line, quantity: previousQuantity ?? next }
                : line,
            ),
          );
        }
        return refreshCounts();
      });
    }
  };

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((line) => line.id !== id));
    removeCartItem(user.id, id).then(() => refreshCounts());
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">
        Shopping Cart
      </p>
      <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground sm:text-4xl">
        Your bag
      </h1>
      <p className="mt-2 text-sm text-muted">
        {loading
          ? "Loading your bag…"
          : `${totalItems} item${totalItems === 1 ? "" : "s"} ready to check out.`}
      </p>

      {!loading && lines.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-border bg-card px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-muted">
            <CreditCardIcon className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-xl font-black tracking-tight text-foreground">
              Your bag is empty
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
              Nothing here yet. Explore the collection and add something you
              love.
            </p>
          </div>
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 gap-5 lg:mt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            {loading ? (
              <p className="text-sm text-muted">Loading your bag…</p>
            ) : (
              <ul className="space-y-4">
                {lines.map((line) => (
                  <li
                    key={line.id}
                    className="rounded-2xl border border-border bg-card p-3 transition-colors hover:border-border sm:p-5"
                  >
                    <div className="flex gap-3">
                      <Link
                        href={`/product/${line.slug}`}
                        className="group relative block h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-surface sm:h-28 sm:w-28"
                        aria-label={`View ${line.name}`}
                      >
                        <LineArt accent={line.accent} colorHex={line.color.hex} />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                              {line.brand}
                            </p>
                            <Link
                              href={`/product/${line.slug}`}
                              className="mt-0.5 block truncate text-sm font-bold text-foreground transition-colors hover:text-accent sm:text-base"
                            >
                              {line.name}
                            </Link>
                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                              <span className="inline-flex items-center gap-1.5">
                                <span
                                  className="h-3 w-3 rounded-full border border-border"
                                  style={{ backgroundColor: line.color.hex }}
                                  aria-hidden="true"
                                />
                                {line.color.name}
                              </span>
                              {line.size && (
                                <span className="inline-flex items-center gap-1.5">
                                  <span className="h-1 w-4 rounded-full bg-border" aria-hidden="true" />
                                  Size: {line.size}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-black tracking-tight text-foreground">
                              {money(line.price * line.quantity)}
                            </p>
                            {line.compareAt && line.compareAt > line.price && (
                              <p className="mt-0.5 text-xs text-muted line-through">
                                {money(line.compareAt)}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                          <div className="flex items-center rounded-full border border-border bg-surface">
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${line.name}`}
                              onClick={() => setQuantity(line.id, line.quantity - 1, line.stock)}
                              className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:text-accent disabled:opacity-40 disabled:hover:text-muted"
                              disabled={line.quantity <= 1}
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-foreground">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={`Increase quantity of ${line.name}`}
                              onClick={() => setQuantity(line.id, line.quantity + 1, line.stock)}
                              className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-muted"
                              disabled={line.stock <= line.quantity}
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <Link
                              href={`/product/${line.slug}`}
                              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-muted transition-colors hover:text-accent"
                            >
                              <HeartIcon className="h-4 w-4" />
                              View product
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeLine(line.id)}
                              aria-label={`Remove ${line.name} from bag`}
                              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-muted transition-colors hover:text-rose-400"
                            >
                              <TrashIcon className="h-4 w-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="mt-8 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-7">
              <h2 className="text-base font-black uppercase tracking-widest text-foreground">
                Order Summary
              </h2>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Total items</dt>
                  <dd className="font-semibold text-foreground">{totalItems}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="font-semibold text-foreground">{money(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="inline-flex items-center gap-1.5 text-muted">
                    <TruckIcon className="h-4 w-4" />
                    Delivery
                  </dt>
                  <dd className={`font-semibold ${delivery === 0 ? "text-accent" : "text-foreground"}`}>
                    {delivery === 0 ? "Free" : money(delivery)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Estimated tax</dt>
                  <dd className="font-semibold text-foreground">{money(tax)}</dd>
                </div>
                {applied && discount > 0 && (
                  <div className="flex items-center justify-between rounded-xl border border-accent/30 bg-accent/10 px-3 py-2">
                    <dt className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
                      <TagIcon className="h-3.5 w-3.5" />
                      {applied.code}
                    </dt>
                    <dd className="flex items-center gap-2 font-semibold text-accent">
                      −{money(discount)}
                      <button
                        type="button"
                        onClick={() => setApplied(null)}
                        aria-label="Remove coupon"
                        className="text-muted transition-colors hover:text-rose-400"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </button>
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-5 flex items-baseline justify-between border-t border-border pt-5">
                <span className="text-sm font-bold uppercase tracking-widest text-foreground">
                  Final total
                </span>
                <span className="text-2xl font-black tracking-tight text-accent">
                  {money(total)}
                </span>
              </div>

              <form className="mt-6" onSubmit={applyPromo}>
                <label
                  htmlFor="promo-code"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted"
                >
                  Promo code
                </label>
                <div className="flex gap-2">
                  <input
                    id="promo-code"
                    type="text"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value);
                      setPromoError(null);
                    }}
                    placeholder="e.g. WELCOME15"
                    className="w-full min-w-0 rounded-full border border-border bg-surface px-4 py-2.5 text-sm uppercase text-foreground placeholder:normal-case placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <button
                    type="submit"
                    disabled={promoBusy}
                    className="shrink-0 rounded-full border border-accent/50 bg-accent/10 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="mt-2 text-xs text-rose-400">{promoError}</p>
                )}
                {applied && !promoError && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-accent">
                    <CheckIcon className="h-3.5 w-3.5" />
                    {applied.code} applied
                  </p>
                )}
              </form>

              <Link
                href={applied ? `/checkout?code=${applied.code}` : "/checkout"}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover"
              >
                Checkout
              </Link>
              <Link
                href="/shoes"
                className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Continue shopping
              </Link>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
                <CheckIcon className="h-3.5 w-3.5" />
                Cash on Delivery — no online payment is processed.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function XIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function LineArt({ accent, colorHex }: { accent: string; colorHex: string }) {
  const gradId = `cartline-${accent.replace("#", "")}`;
  const glossId = `${gradId}-gloss`;
  return (
    <svg viewBox="0 0 96 96" className="h-full w-full">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={colorHex} stopOpacity="0.72" />
          <stop offset="1" stopColor="#111111" stopOpacity="0.96" />
        </linearGradient>
        <linearGradient id={glossId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="96" height="96" fill={`url(#${gradId})`} />
      <rect width="96" height="96" fill={`url(#${glossId})`} />
      <path
        d="M48 22 L38 32 L39 34 L46 35 L46 74 H50 L50 35 L57 34 L58 32 Z"
        fill="#ededed"
        opacity="0.92"
      />
      <circle cx="48" cy="62" r="3" fill="#a3e635" />
    </svg>
  );
}