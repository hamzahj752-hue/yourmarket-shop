"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ProductDetail } from "@/app/data/productDetails";
import StarRating from "../catalog/StarRating";
import ProductGalleryMain, { ThumbnailStrip } from "./ProductGallery";

function formatPrice(value: number): string {
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

function isLightColor(hex: string): boolean {
  const clean = hex.replace("#", "");
  const red = parseInt(clean.slice(0, 2), 16);
  const green = parseInt(clean.slice(2, 4), 16);
  const blue = parseInt(clean.slice(4, 6), 16);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 150;
}

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

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3 shrink-0"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function StockInfo({ product }: { product: ProductDetail }) {
  if (product.stock === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-400" aria-hidden="true" />
        Sold out
      </span>
    );
  }

  if (product.stock <= 8) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
        Low stock — {product.stock} left
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
      In stock — {product.stock} available
    </span>
  );
}

type InfoPanelProps = {
  product: ProductDetail;
  colorIndex: number;
  setColorIndex: (index: number) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string) => void;
  sizeError: boolean;
  quantity: number;
  setQuantity: (quantity: number) => void;
  wished: boolean;
  setWished: (wished: boolean) => void;
  added: boolean;
  buyNote: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
};

function InfoPanel({
  product,
  colorIndex,
  setColorIndex,
  selectedSize,
  setSelectedSize,
  sizeError,
  quantity,
  setQuantity,
  wished,
  setWished,
  added,
  buyNote,
  onAddToCart,
  onBuyNow,
}: InfoPanelProps) {
  const savePct =
    product.salePrice != null
      ? Math.round((1 - product.salePrice / product.price) * 100)
      : 0;
  const maxQty = Math.min(Math.max(product.stock, 1), 99);
  const soldOut = product.stock === 0;

  return (
    <div className="min-w-0 lg:border-l lg:border-border lg:pl-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          {product.categoryLabel}
        </p>
        <StockInfo product={product} />
      </div>

      <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">
        {product.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="text-sm font-bold uppercase tracking-widest text-foreground/70">
          {product.brand}
        </span>
        <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
        <span className="flex items-center gap-1.5">
          <StarRating rating={product.rating} />
          <span className="text-xs text-muted/80">
            · {product.ratingCount} reviews
          </span>
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-3xl font-black tracking-tight sm:text-4xl">
          {formatPrice(product.salePrice ?? product.price)}
        </span>
        {product.salePrice != null && (
          <span className="text-lg font-medium text-muted line-through">
            {formatPrice(product.price)}
          </span>
        )}
        {savePct > 0 && (
          <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-bold text-accent">
            Save {savePct}%
          </span>
        )}
      </div>

      <p className="mt-5 max-w-prose text-base leading-relaxed text-muted">
        {product.description}
      </p>

      <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {product.highlights.map((highlight) => (
          <li
            key={highlight}
            className="flex items-center gap-2 text-sm text-foreground/80"
          >
            <span className="inline-flex items-center justify-center rounded-full bg-accent/15 p-0.5 text-accent">
              <CheckIcon />
            </span>
            {highlight}
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-border" aria-hidden="true" />

      {product.sizes && product.sizes.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-muted">
              Size
            </span>
            <span className="text-sm font-semibold text-accent">
              {selectedSize ?? "Select"}
            </span>
          </div>
          <div
            role="group"
            aria-label="Select size"
            className="mt-3 flex flex-wrap gap-2"
          >
            {product.sizes.map((size) => {
              const active = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size);
                  }}
                  aria-pressed={active}
                  className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full border px-4 text-sm font-bold transition-colors duration-200 ${
                    active
                      ? "border-accent bg-accent text-black"
                      : "border-border bg-card text-foreground hover:border-accent/60 hover:text-accent"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
          {sizeError && (
            <p
              id="size-error"
              role="alert"
              className="mt-2 text-xs font-medium text-rose-400"
            >
              Please select a size to continue.
            </p>
          )}
        </div>
      )}

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-muted">
            Color
          </span>
          <span className="text-sm font-semibold text-foreground">
            {product.colors[colorIndex]?.name}
          </span>
        </div>
        <div
          role="group"
          aria-label="Select color"
          className="mt-3 flex flex-wrap gap-2.5"
        >
          {product.colors.map((color, index) => {
            const active = index === colorIndex;
            const light = isLightColor(color.hex);
            return (
              <button
                key={color.hex}
                type="button"
                onClick={() => setColorIndex(index)}
                aria-pressed={active}
                aria-label={`${color.name} colorway`}
                className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border transition-transform duration-200 ${
                  active
                    ? "scale-105 ring-2 ring-accent ring-offset-2 ring-offset-background"
                    : "border-white/25 hover:scale-105"
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {active && (
                  <span
                    className={`text-xs font-black ${light ? "text-black" : "text-white"}`}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex h-12 items-center rounded-full border border-border bg-card p-1">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-xl text-foreground transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:text-zinc-600"
          >
            −
          </button>
          <span
            className="w-10 text-center text-sm font-bold tabular-nums"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
            disabled={quantity >= maxQty}
            aria-label="Increase quantity"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-xl text-foreground transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:text-zinc-600"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => setWished(!wished)}
          aria-pressed={wished}
          aria-label={
            wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
          }
          className={`inline-flex h-12 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors duration-200 ${
            wished
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-muted hover:border-accent hover:text-accent"
          }`}
        >
          <HeartIcon filled={wished} />
          {wished ? "Wishlisted" : "Wishlist"}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onAddToCart}
          disabled={soldOut || added}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-4 text-sm font-bold uppercase tracking-widest text-black transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
        >
          {added ? <CheckIcon /> : <CartIcon />}
          {added ? "Added" : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={onBuyNow}
          disabled={soldOut}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-4 text-sm font-bold uppercase tracking-widest text-background transition-colors duration-200 hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
        >
          Buy Now
        </button>
      </div>

      {buyNote && (
        <p className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-xs text-muted">
          <ShieldIcon />
          Checkout is coming soon — it is wired up next with the YOURMARKET
          admin.
        </p>
      )}

      <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-5">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <TruckIcon />
          <span className="text-[11px] font-medium leading-tight text-muted">
            Free
            <br />
            shipping
          </span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <ReturnIcon />
          <span className="text-[11px] font-medium leading-tight text-muted">
            Easy
            <br />
            30-day returns
          </span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <ShieldIcon />
          <span className="text-[11px] font-medium leading-tight text-muted">
            Secure
            <br />
            checkout
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailView({
  product,
}: {
  product: ProductDetail;
}) {
  const [colorIndex, setColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const [buyNote, setBuyNote] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const addTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (addTimer.current != null) window.clearTimeout(addTimer.current);
    };
  }, []);

  const currentImage = product.images[colorIndex] ?? product.images[0];
  const categoryHref =
    product.category === "shoes" ? "/shoes" : `/category/${product.category}`;

  function selectionValid() {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return false;
    }
    setSizeError(false);
    return true;
  }

  function handleAddToCart() {
    if (!selectionValid()) return;
    setBuyNote(false);
    if (addTimer.current != null) window.clearTimeout(addTimer.current);
    setAdded(true);
    addTimer.current = window.setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    if (!selectionValid()) return;
    setAdded(false);
    setBuyNote(true);
  }

  function handleSizeSelect(size: string) {
    setSelectedSize(size);
    setSizeError(false);
  }

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-4 select-none overflow-hidden lg:top-8"
      >
        <span className="block whitespace-nowrap text-[clamp(3rem,13vw,10.5rem)] font-black uppercase leading-[0.75] tracking-tight text-foreground/[0.04] [-webkit-text-stroke:1.5px_rgba(237,237,237,0.07)]">
          {product.name}
        </span>
      </div>

      <div
        className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full opacity-70"
        style={{ background: `${product.accent}11`, filter: "blur(90px)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-16 h-72 w-72 rounded-full bg-accent/[0.05] opacity-70"
        style={{ filter: "blur(90px)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8 lg:pb-20">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-xs text-muted sm:text-sm"
        >
          <Link href="/" className="transition-colors hover:text-accent">
            Home
          </Link>
          <ChevronRightIcon />
          <Link
            href={categoryHref}
            className="transition-colors hover:text-accent"
          >
            {product.categoryLabel}
          </Link>
          <ChevronRightIcon />
          <span className="max-w-[14rem] truncate font-medium text-foreground sm:max-w-xs">
            {product.name}
          </span>
        </nav>

        <div className="mt-6 grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:mt-10 lg:grid-cols-[5.5rem_minmax(0,1fr)_minmax(0,27rem)] lg:items-start lg:gap-x-10">
          <aside className="hidden lg:block" aria-label="Product thumbnail gallery">
            {product.images.length > 1 && (
              <ThumbnailStrip
                product={product}
                activeIndex={colorIndex}
                onSelect={setColorIndex}
                className="flex-col"
              />
            )}
          </aside>

          <div className="min-w-0">
            <ProductGalleryMain
              product={product}
              colorHex={currentImage.colorHex}
            />
            {product.images.length > 1 && (
              <ThumbnailStrip
                product={product}
                activeIndex={colorIndex}
                onSelect={setColorIndex}
                className="mt-3 overflow-x-auto overflow-y-hidden sm:mt-4 lg:hidden"
              />
            )}
          </div>

          <InfoPanel
            product={product}
            colorIndex={colorIndex}
            setColorIndex={setColorIndex}
            selectedSize={selectedSize}
            setSelectedSize={handleSizeSelect}
            sizeError={sizeError}
            quantity={quantity}
            setQuantity={setQuantity}
            wished={wished}
            setWished={setWished}
            added={added}
            buyNote={buyNote}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </div>
      </div>
    </section>
  );
}