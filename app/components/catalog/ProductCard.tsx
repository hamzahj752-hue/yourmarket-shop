"use client";

import Link from "next/link";
import type { Product } from "@/app/data/products";
import ProductVisual from "./ProductVisual";
import StarRating from "./StarRating";
import { useWishlist } from "@/app/lib/use-wishlist";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const { wished, toggle } = useWishlist(product.slug);
  const isSale = product.salePrice != null;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_8px_40px_rgba(163,230,53,0.12)]">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={wished}
        aria-label={
          wished
            ? `Remove ${product.name} from wishlist`
            : `Add ${product.name} to wishlist`
        }
        className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 text-muted backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
      >
        <HeartIcon filled={wished} />
      </button>

      <Link
        href={`/product/${product.slug}`}
        className="flex h-full flex-col"
        aria-label={`View product: ${product.name} by ${product.brand}`}
      >
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-surface sm:aspect-[4/5]">
          <div
            className="absolute inset-0 bg-gradient-to-br from-transparent to-accent/[0.06]"
            aria-hidden="true"
          />
          <ProductVisual category={product.category} color={product.colors[0]} />
          {isSale && (
            <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-black">
              Sale
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-2.5 sm:p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            {product.brand}
          </span>
          <h3 className="truncate text-sm font-bold text-foreground sm:text-base">
            {product.name}
          </h3>

          <span className="inline-flex items-center gap-1.5">
            <StarRating rating={product.rating} hideNumber />
            <span className="text-xs text-muted">
              {product.rating} ({product.ratingCount})
            </span>
          </span>

          <span className="flex items-center gap-1.5">
            {product.colors.length > 0 ? (
              product.colors.map((hex) => (
                <span
                  key={hex}
                  className="h-3.5 w-3.5 rounded-full border border-white/20"
                  style={{ backgroundColor: hex }}
                  aria-hidden="true"
                />
              ))
            ) : (
              <span className="text-xs text-muted">One color</span>
            )}
          </span>

          <span className="flex items-baseline gap-2">
            {isSale ? (
              <>
                <span className="text-sm font-black text-accent sm:text-base">
                  {formatPrice(product.salePrice as number)}
                </span>
                <span className="text-xs text-muted line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-sm font-black text-foreground sm:text-base">
                {formatPrice(product.price)}
              </span>
            )}
          </span>

          <span className="mt-auto inline-flex items-center justify-center gap-1.5 pt-2.5">
            <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-border py-2.5 text-[11px] font-bold uppercase tracking-wider text-foreground transition-colors duration-300 group-hover:border-accent group-hover:text-accent sm:text-xs">
              View Product
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </span>
        </div>
      </Link>
    </div>
  );
}