import Link from "next/link";
import type { ReactNode } from "react";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

type NextProductProps = {
  href: string;
  name: string;
  price: string;
  oldPrice?: string;
  accent?: string;
  visual: ReactNode;
  tone?: "dark" | "light";
};

export default function NextProduct({
  href,
  name,
  price,
  oldPrice,
  accent = "#a3e635",
  visual,
  tone = "dark",
}: NextProductProps) {
  const normalizedAccent = /^#[0-9a-fA-F]{6}$/.test(accent)
    ? accent
    : "#a3e635";

  const isLight = tone === "light";

  return (
    <Link
      href={href}
      className={
        isLight
          ? "group flex items-center gap-3 overflow-hidden rounded-2xl border border-black/10 bg-white/85 p-2.5 shadow-[0_22px_50px_-22px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-black/25"
          : "group flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-2.5 shadow-[0_22px_50px_-22px_rgba(0,0,0,0.9)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25"
      }
      aria-label={`Next product: ${name}, ${price}`}
    >
      <span
        className={
          isLight
            ? "inline-flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-white/70"
            : "inline-flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-surface"
        }
      >
        {visual}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={
            isLight
              ? "block text-[10px] font-bold uppercase tracking-[0.2em] text-black/45 transition-colors duration-300 group-hover:text-black/70"
              : "block text-[10px] font-bold uppercase tracking-[0.2em] text-white/45 transition-colors duration-300 group-hover:text-white/70"
          }
        >
          Next Product
        </span>
        <span
          className={
            isLight
              ? "mt-0.5 block truncate text-sm font-bold text-black"
              : "mt-0.5 block truncate text-sm font-bold text-foreground"
          }
        >
          {name}
        </span>
        <span className="mt-0.5 flex flex-wrap items-baseline gap-1.5">
          <span
            className="text-sm font-black"
            style={{ color: normalizedAccent }}
          >
            {price}
          </span>
          {oldPrice && (
            <span
              className={
                isLight
                  ? "text-xs font-medium text-black/35 line-through"
                  : "text-xs font-medium text-white/35 line-through"
              }
            >
              {oldPrice}
            </span>
          )}
        </span>
      </span>

      <span
        className={
          isLight
            ? "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 group-hover:bg-black/10 group-hover:border-black/30"
            : "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/30"
        }
        style={{
          color: normalizedAccent,
          borderColor: `${normalizedAccent}59`,
        }}
        aria-hidden="true"
      >
        <ArrowIcon />
      </span>
    </Link>
  );
}