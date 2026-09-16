import type { ReactNode } from "react";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/app/lib/status";

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {description}
        </p>
      )}
    </div>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-card ${className}`}>
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-xs font-semibold uppercase tracking-widest text-muted">
        {label}
        {hint && <span className="font-normal normal-case tracking-normal text-muted/70">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export const inputClasses =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors sm:py-3";

type BadgeTone = "muted" | "lime" | "emerald" | "cyan" | "amber" | "rose";

const badgeTones: Record<BadgeTone, string> = {
  muted: "border-border text-muted",
  lime: "border-accent/40 bg-accent/10 text-accent",
  emerald: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
  cyan: "border-cyan-400/40 bg-cyan-400/10 text-cyan-400",
  amber: "border-amber-400/40 bg-amber-400/10 text-amber-400",
  rose: "border-rose-400/40 bg-rose-400/10 text-rose-400",
};

export function StatusBadge({
  tone = "muted",
  children,
  dot = false,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${badgeTones[tone]}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

const orderTone: Record<string, BadgeTone> = {
  new: "muted",
  confirmed: "cyan",
  processing: "amber",
  shipped: "cyan",
  out_for_delivery: "cyan",
  delivered: "emerald",
  cancelled: "rose",
  returned: "rose",
  refunded: "rose",
};

const paymentTone: Record<string, BadgeTone> = {
  paid: "emerald",
  pending: "amber",
  failed: "rose",
  refunded: "rose",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <StatusBadge tone={orderTone[status] ?? "muted"} dot>
      {ORDER_STATUS_LABELS[status] ?? status}
    </StatusBadge>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <StatusBadge tone={paymentTone[status] ?? "muted"}>
      {PAYMENT_STATUS_LABELS[status] ?? status}
    </StatusBadge>
  );
}

export function Avatar({
  name,
  className = "h-16 w-16",
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`${className} flex shrink-0 items-center justify-center rounded-full border border-accent/50 bg-gradient-to-br from-accent/25 to-surface text-lg font-black tracking-widest text-accent`}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export function ProductThumb({
  name,
  accent,
  className = "h-16 w-16",
}: {
  name: string;
  accent: string;
  className?: string;
}) {
  const uid = `pthumb-${name.replace(/[^a-z0-9]/gi, "").toLowerCase()}`;
  const gradId = `${uid}-grad`;
  const glossId = `${uid}-gloss`;

  return (
    <div
      className={`${className} flex shrink-0 items-center justify-center rounded-xl border border-border bg-surface overflow-hidden`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="h-full w-full">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={accent} stopOpacity="0.55" />
            <stop offset="1" stopColor="#111111" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id={glossId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" fill={`url(#${gradId})`} />
        <rect width="64" height="64" fill={`url(#${glossId})`} />
        <path
          d="M32 14 L21 24 L22 26 L30 27 L30 50 H34 L34 27 L42 26 L43 24 Z"
          fill="#ededed"
          opacity="0.92"
        />
        <circle cx="32" cy="42" r="2.5" fill="#a3e635" />
      </svg>
    </div>
  );
}