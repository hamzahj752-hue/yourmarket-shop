"use client";

import { type CSSProperties } from "react";
import Link from "next/link";
import ShoeVisual from "./ShoeVisual";
import { formatPrice, getBrandName } from "../../lib/shoes";
import type { ShoeProduct } from "../../lib/shoes";
import { useWishlist } from "../../lib/use-wishlist";

function StarIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5 text-amber-400"
      aria-hidden="true"
    >
      <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

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

export default function ShoeCard({ product }: { product: ShoeProduct }) {
  const { wished: wishlisted, toggle } = useWishlist(product.slug);

  const { name, slug, price, oldPrice, rating, reviewCount, colors, accent, isNew } =
    product;
  const brandName = getBrandName(product.brandId);
  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0;

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--accent)] hover:shadow-[0_24px_60px_-18px_rgba(0,0,0,0.8)]"
      style={{ "--accent": accent } as CSSProperties}
    >
      <Link
        href={`/product/${slug}`}
        aria-label={`View ${name} by ${brandName}, ${formatPrice(price)}`}
        className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]"
      />

      <div className="pointer-events-none relative aspect-[4/3] overflow-hidden bg-surface">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${accent}1f, transparent 55%)` }}
          aria-hidden="true"
        />
        <div
          className="absolute -right-8 -top-8 h-28 w-28 rounded-full"
          style={{ background: `${accent}26`, filter: "blur(36px)" }}
          aria-hidden="true"
        />

        <div className="flex h-full w-full items-center justify-center p-4 sm:p-6">
          <ShoeVisual
            accent={accent}
            className="h-auto w-full max-w-[230px] transition-transform duration-500 group-hover:scale-[1.05]"
          />
        </div>

        <div className="absolute left-3 top-3 z-20 flex flex-col gap-1.5">
          {isNew && (
            <span className="rounded-full bg-lime-300 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
              New
            </span>
          )}
          {oldPrice && (
            <span className="rounded-full bg-cyan-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
              -{discount}%
            </span>
          )}
        </div>

        <span className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex translate-y-2 items-center justify-center gap-1.5 rounded-full bg-foreground/10 px-3 py-2.5 text-xs font-bold uppercase tracking-widest opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          style={{ border: `1px solid ${accent}59`, color: accent }}
        >
          View Product
          <ArrowIcon />
        </span>
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={wishlisted}
        aria-label={
          wishlisted ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`
        }
        className={`absolute right-3 top-3 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition-colors duration-200 ${
          wishlisted
            ? "border-rose-400/60 bg-rose-400/20 text-rose-400"
            : "border-border bg-background/85 text-muted hover:text-rose-400"
        }`}
      >
        <HeartIcon filled={wishlisted} />
      </button>

      <div className="relative flex flex-1 flex-col gap-2.5 p-3.5 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: accent }}
          >
            {brandName}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted">
            <StarIcon />
            <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
            <span className="text-muted/60">({reviewCount})</span>
          </span>
        </div>

        <h3 className="text-sm font-bold leading-snug text-foreground sm:text-base">
          {name}
        </h3>

        <div className="mt-0.5 flex items-center gap-1.5">
          {colors.map((color) => (
            <span
              key={color.name}
              className="h-3 w-3 rounded-full ring-1 ring-inset ring-white/20"
              style={{ background: color.hex }}
              title={color.name}
              aria-hidden="true"
            />
          ))}
          <span className="sr-only">
            Available colors: {colors.map((color) => color.name).join(", ")}
          </span>
          <span className="ml-1 text-[11px] text-muted/70">
            {colors.length} colors
          </span>
        </div>

        <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
          <span className="text-base font-black text-foreground sm:text-lg">
            {formatPrice(price)}
          </span>
          {oldPrice && (
            <span className="text-xs font-medium text-muted/70 line-through">
              {formatPrice(oldPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}