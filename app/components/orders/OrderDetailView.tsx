"use client";

import { useState } from "react";
import Link from "next/link";
import { DELIVERY_STEPS } from "@/app/data/account";
import type { ShopOrder } from "@/app/lib/shop-service";
import { orderStatusLabel } from "@/app/lib/status";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  ProductThumb,
} from "@/app/components/account/ui";

const money = (value: number) => `$${value.toFixed(2)}`;

const STEP_KEYS = [
  "new",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

function formatDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function PrinterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 9V3h12v6" />
      <rect width="14" height="10" x="5" y="13" rx="2" />
      <path d="M17 17h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3" />
      <path d="M7 21h10v-4H7z" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 12a9 9 0 0 0-15.6-6.2L3 8" />
      <path d="M3 3v5h5" />
      <path d="m3 12 2.6 3.9A9 9 0 0 0 21 12" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function TrackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 10c0 4.99-5.54 10.19-7.4 11.77a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

export default function OrderDetailView({ order }: { order: ShopOrder }) {
  const [toast, setToast] = useState<string | null>(null);

  const { order: data, items, history } = order;
  const cancelled =
    data.status === "cancelled" ||
    data.status === "returned" ||
    data.status === "refunded";
  const statusLabel = orderStatusLabel(data.status);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(
      () => setToast((prev) => (prev === message ? null : prev)),
      2600,
    );
  };

  const progressIndex = Math.min(
    DELIVERY_STEPS.length - 1,
    Math.max(0, STEP_KEYS.indexOf(data.status)),
  );

  const timeline =
    history.length > 0
      ? history.map((entry, index) => ({
          id: entry.id ?? `h-${index}`,
          label: orderStatusLabel(entry.status),
          timestamp: formatDate(entry.created_at ?? undefined),
          description: entry.note ?? undefined,
          completed: !cancelled,
          cancelled,
        }))
      : [
          {
            id: "placed",
            label: statusLabel,
            timestamp: formatDate(data.created_at ?? undefined),
            description: "Order placed.",
            completed: !cancelled,
            cancelled,
          },
        ];

  const shippingAddress = (data.shipping_address ??
    {}) as Record<string, unknown>;
  const paymentMethod =
    data.payment_method === "cod"
      ? "Cash on Delivery"
      : data.payment_method ?? "—";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted transition-colors hover:text-accent"
      >
        <BackIcon className="h-3.5 w-3.5" />
        Back to My Account
      </Link>

      {/* Order header */}
      <div className="mt-4 rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Order detail
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              <span className="text-muted">#</span>{data.order_number}
            </h1>
            <p className="mt-2 text-sm text-muted">
              Placed on {formatDate(data.created_at ?? undefined) ?? "—"}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <OrderStatusBadge status={data.status} />
              <PaymentStatusBadge status={data.payment_status} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                showToast("Invoice downloads will be available here.");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <DownloadIcon className="h-4 w-4" />
              Invoice
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <PrinterIcon className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="mx-auto mt-4 w-fit rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 text-xs font-semibold text-accent">
          {toast}
        </div>
      )}

      {/* Delivery progress */}
      {cancelled ? (
        <div className="mt-8 rounded-3xl border border-rose-400/30 bg-rose-400/[0.06] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rose-400/40 bg-rose-400/10 text-lg font-black text-rose-400">
              ✕
            </span>
            <div>
              <h2 className="text-xl font-black tracking-tight text-foreground">
                {statusLabel}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                This order was marked as{" "}
                <span className="font-semibold text-foreground">{statusLabel.toLowerCase()}</span>.
                Contact support if you have questions.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
            Delivery progress
          </h2>
          <div className="no-scrollbar mt-6 overflow-x-auto">
            <div className="min-w-[620px]">
              <ProgressStepper progressIndex={progressIndex} />
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 gap-6 xl:grid xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6 xl:min-w-0">
          {/* Timeline */}
          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
              Order timeline
            </h2>
            <ol className="mt-6 space-y-0">
              {timeline.map((event, index) => (
                <li key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                        event.cancelled
                          ? "border-rose-400/50 bg-rose-400/10 text-rose-400"
                          : event.completed
                            ? "border-accent bg-accent text-black"
                            : "border-border bg-surface text-muted"
                      }`}
                    >
                      {event.cancelled ? (
                        <span className="text-xs font-black">✕</span>
                      ) : event.completed ? (
                        <CheckIcon className="h-4 w-4" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-current" />
                      )}
                    </span>
                    {index < timeline.length - 1 && (
                      <span
                        className={`mt-1 w-px flex-1 ${
                          timeline[index + 1].completed ||
                          timeline[index + 1].cancelled
                            ? "bg-accent/50"
                            : "border-l border-border"
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="min-w-0 pb-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3
                        className={`text-sm font-bold ${
                          event.cancelled
                            ? "text-rose-400"
                            : event.completed
                              ? "text-foreground"
                              : "text-muted"
                        }`}
                      >
                        {event.label}
                      </h3>
                      {event.timestamp && (
                        <span className="font-mono text-xs text-muted">
                          {event.timestamp}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {event.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Order items */}
          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
              Order items
            </h2>
            <ul className="mt-5 divide-y divide-border">
              {items.map((item) => (
                <li
                  key={`${item.product_slug}-${item.size}`}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <ProductThumb
                    name={item.product_name}
                    accent={item.variant_color_value ?? "#a3e635"}
                    className="h-20 w-20"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${item.product_slug}`}
                      className="block truncate text-sm font-bold text-foreground transition-colors hover:text-accent sm:text-base"
                    >
                      {item.product_name}
                    </Link>
                    <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted">
                      {item.variant_color_name && (
                        <span>Color: {item.variant_color_name}</span>
                      )}
                      {item.size && <span>Size: {item.size}</span>}
                      <span>Qty: {item.quantity}</span>
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-black text-foreground">
                      {money(item.line_total)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {money(item.unit_price)} each
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Tracking information */}
          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted">
                <TrackIcon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
                  Tracking information
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Tracking details will appear here once your order ships.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6 xl:min-w-0">
          {/* Deliver to + payment */}
          <section className="rounded-3xl border border-border bg-card p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                <MapPinIcon className="h-5 w-5" />
              </span>
              <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
                Shipping address
              </h2>
            </div>
            <address className="mt-4 not-italic text-sm leading-relaxed text-muted">
              {typeof shippingAddress.full_name === "string" && (
                <>
                  {shippingAddress.full_name}
                  <br />
                </>
              )}
              {typeof shippingAddress.street === "string" &&
                shippingAddress.street}
              {typeof shippingAddress.city === "string" && (
                <br />
              )}
              {typeof shippingAddress.city === "string" &&
                shippingAddress.city}
              {typeof shippingAddress.country === "string" && (
                <>
                  <br />
                  {shippingAddress.country}
                </>
              )}
            </address>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                <CardIcon className="h-5 w-5" />
              </span>
              <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
                Payment method
              </h2>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">
                {paymentMethod}
              </p>
              <PaymentStatusBadge status={data.payment_status} />
            </div>
          </section>

          {/* Summary */}
          <section className="rounded-3xl border border-border bg-card p-6 sm:p-7">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
              Summary
            </h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-semibold text-foreground">
                  {money(data.subtotal)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Discount</dt>
                <dd className="font-semibold text-accent">
                  {data.discount > 0 ? `−${money(data.discount)}` : "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd
                  className={
                    data.shipping === 0
                      ? "font-semibold text-accent"
                      : "font-semibold text-foreground"
                  }
                >
                  {data.shipping === 0 ? "Free" : money(data.shipping)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Tax</dt>
                <dd className="font-semibold text-foreground">
                  {money(data.tax)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-border pt-4">
                <dt className="text-sm font-bold uppercase tracking-widest text-foreground">
                  Grand total
                </dt>
                <dd className="text-2xl font-black tracking-tight text-accent">
                  {money(data.total)}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <section className="flex flex-col items-start gap-4 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
              <PhoneIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Contact support
              </h3>
              <p className="mt-0.5 text-sm text-muted">
                Questions about this order? We&apos;re here 7 days a week.
              </p>
            </div>
          </div>
          <Link
            href="/account"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover"
          >
            Contact support
          </Link>
        </section>

        {!cancelled && (
          <section className="flex flex-col items-start gap-4 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                <RefreshIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Buy again
                </h3>
                <p className="mt-0.5 text-sm text-muted">
                  Reorder your favourites in one tap.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              {items.map((item) => (
                <Link
                  key={`${item.product_slug}-${item.size}`}
                  href={`/product/${item.product_slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  <RefreshIcon className="h-3.5 w-3.5" />
                  {item.product_name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <p className="mt-6 text-xs text-muted">
        Order details are read directly from your account.
      </p>
    </div>
  );
}

function ProgressStepper({ progressIndex }: { progressIndex: number }) {
  return (
    <div className="relative">
      <div
        className="absolute left-8 right-8 top-[17px] hidden h-0.5 sm:block"
        aria-hidden="true"
      >
        <div className="h-full w-full rounded-full bg-border" />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-accent transition-all duration-700"
          style={{
            width: `${((progressIndex - (progressIndex === DELIVERY_STEPS.length - 1 ? 0 : 0.5)) / (DELIVERY_STEPS.length - 1)) * 100}%`,
          }}
        />
      </div>

      <ol className="relative z-10 grid grid-cols-3 gap-y-6 sm:grid-cols-6">
        {DELIVERY_STEPS.map((step, index) => {
          const completed = index <= progressIndex;
          const isLast = index === DELIVERY_STEPS.length - 1;
          const current = index === progressIndex && !isLast;
          const reached = index === progressIndex;

          return (
            <li
              key={step}
              className={`flex flex-col items-center text-center ${index % 3 !== 0 ? "pl-2" : ""} sm:pl-0`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${
                  completed
                    ? "border-accent bg-accent text-black"
                    : "border-border bg-surface text-muted"
                } ${current ? "animate-[ym-fade-scale_0.6s_ease] border-accent/70 ring-4 ring-accent/25" : ""}`}
                aria-hidden="true"
              >
                {completed ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-current" />
                )}
              </span>
              <span
                className={`mt-2.5 text-[11px] font-semibold ${
                  completed ? "text-foreground" : "text-muted/60"
                }`}
              >
                {step}
              </span>
              <span
                className={`mt-0.5 text-[10px] uppercase tracking-widest ${
                  reached
                    ? "font-bold text-accent"
                    : completed
                      ? "text-muted"
                      : "text-muted/40"
                }`}
              >
                {completed ? (reached && !isLast ? "Current" : "Done") : "Upcoming"}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}