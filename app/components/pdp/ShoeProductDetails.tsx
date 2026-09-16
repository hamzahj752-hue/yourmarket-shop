"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ShoeVisual from "../shoes/ShoeVisual";
import NextProduct from "./NextProduct";
import { useWishlist } from "../../lib/use-wishlist";
import { addToBag } from "../../lib/add-to-bag";
import {
  formatPrice,
  getBrandName,
  getShoeBackgroundText,
  getShoeBackgroundTextStyle,
  SHOE_PRODUCTS,
} from "../../lib/shoes";
import type { ShoeProduct } from "../../lib/shoes";
import {
  BACKGROUND_TEXT_STYLES,
  getColorTheme,
  relativeLuminance,
  resolveVariant,
} from "../../lib/presentation";

const SHOE_SIZES = [
  "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12", "13",
];

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-amber-400" aria-hidden="true">
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

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export default function ShoeProductDetails({
  product,
}: {
  product: ShoeProduct;
}) {
  const router = useRouter();
  const [colorIndex, setColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(SHOE_SIZES[4]);
  const { wished: wishlisted, toggle: toggleWishlist } = useWishlist(product.slug);
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  async function handleAddToBag(buyNow: boolean) {
    if (busy) return;
    setBusy(true);
    setBanner(null);
    try {
      const result = await addToBag({
        slug: product.slug,
        colorName: variant.colorName,
        size: selectedSize,
      });
      if (!result.ok) {
        setBanner({ tone: "error", text: result.error });
        if (result.error.toLowerCase().includes("log in")) {
          router.push("/login?next=/checkout");
        }
        return;
      }
      if (buyNow) {
        router.push("/checkout");
        return;
      }
      setBanner({ tone: "success", text: "Added to your bag." });
    } finally {
      setBusy(false);
    }
  }

  const color = product.colors[colorIndex];
  const hex = color.hex;

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const variant = useMemo(() => {
    const computed = resolveVariant(hex, color.name);
    return {
      colorName: color.name ?? computed.colorName,
      colorValue: color.hex ?? computed.colorValue,
      image: color.image ?? computed.image ?? "",
      themeColor: color.themeColor ?? computed.themeColor,
      accentColor: color.accentColor ?? computed.accentColor,
      textColor: color.textColor ?? computed.textColor,
      backgroundTextColor: color.backgroundTextColor ?? computed.backgroundTextColor,
    };
  }, [hex, color]);

  const theme = useMemo(() => {
    const base = getColorTheme(hex);
    const cta = variant.accentColor ?? base.cta;
    return {
      ...base,
      heroBg: variant.themeColor ?? base.heroBg,
      accent: variant.accentColor ?? base.accent,
      cta,
      ctaText: relativeLuminance(cta) > 0.5 ? "#111113" : "#ffffff",
      text: variant.textColor ?? base.text,
    };
  }, [hex, variant]);

  const brandName = getBrandName(product.brandId);
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const backgroundText = getShoeBackgroundText(product);
  const backgroundStyle = getShoeBackgroundTextStyle(product);
  const bgTextPreset = BACKGROUND_TEXT_STYLES[backgroundStyle];
  const bgTextColor = product.backgroundTextColor ?? variant.backgroundTextColor;

  const currentIndex = SHOE_PRODUCTS.findIndex((p) => p.slug === product.slug);
  const nextProduct =
    currentIndex >= 0
      ? SHOE_PRODUCTS[(currentIndex + 1) % SHOE_PRODUCTS.length]
      : null;
  const nextColor = nextProduct?.colors[0];

  const nextCard = nextProduct && nextColor ? (
    <NextProduct
      href={`/product/${nextProduct.slug}`}
      name={nextProduct.name}
      price={formatPrice(nextProduct.price)}
      oldPrice={nextProduct.oldPrice ? formatPrice(nextProduct.oldPrice) : undefined}
      accent={nextProduct.accent}
      tone={theme.isLight ? "light" : "dark"}
      visual={
        <ShoeVisual
          accent={nextColor.hex}
          color={nextColor.hex}
          label=""
          className="h-auto w-[74px] scale-110"
        />
      }
    />
  ) : null;

  return (
    <section
      className="relative isolate overflow-hidden border-b transition-colors duration-700 lg:h-[calc(100dvh-80px)]"
      style={{
        backgroundColor: theme.heroBg,
        borderColor: theme.isLight ? "rgba(0,0,0,0.12)" : "#262626",
      }}
    >
      {/* Ambient background blurs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute -left-32 -top-24 h-[28rem] w-[28rem] rounded-full blur-[120px] transition-colors duration-700"
          style={{ backgroundColor: `${theme.glow}18` }}
        />
        <div
          className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full blur-[120px] transition-colors duration-700"
          style={{ backgroundColor: `${theme.glow}10` }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[84rem] flex-col overflow-hidden px-4 pb-4 pt-4 sm:px-6 sm:pb-6 lg:px-10 lg:pb-8 lg:pt-5 xl:max-w-[100rem] 2xl:max-w-[112rem] 2xl:px-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <Link
            href="/shoes"
            className="inline-flex items-center gap-1 text-sm font-semibold transition-colors duration-700 hover:opacity-80"
            style={{ color: theme.isLight ? "#6b6b73" : theme.text }}
          >
            <ChevronLeftIcon />
            Shoe Catalog
          </Link>
        </nav>

        {/* Two-column layout: Hero + Info */}
        <div className="mt-2 grid min-h-0 flex-1 items-stretch gap-4 lg:grid-cols-[1.45fr_0.62fr] lg:gap-6">
          {/* ─── LEFT: Hero visual area ─── */}
          <div className="relative order-1 flex min-h-0 flex-col overflow-hidden transition-colors duration-700">
            {/* Subtle glass overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-black/20" aria-hidden="true" />

            {/* Accent glow orb top-right */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-[26rem] w-[26rem] rounded-full blur-[100px] transition-colors duration-700"
              style={{ backgroundColor: theme.glow, opacity: theme.isLight ? 0.12 : 0.18 }}
              aria-hidden="true"
            />

            {/* Oversized background display text behind the shoe */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-hidden select-none"
            >
              <span
                className={`whitespace-nowrap leading-none ${bgTextPreset.className}`}
                style={{
                  color: bgTextPreset.stroke ? "transparent" : bgTextColor,
                  WebkitTextStroke: bgTextPreset.stroke
                    ? `1.5px ${bgTextColor}`
                    : undefined,
                  fontSize: "clamp(4rem, 12vw, 11rem)",
                  letterSpacing: bgTextPreset.letterSpacing,
                  fontWeight: bgTextPreset.fontWeight,
                  opacity: bgTextPreset.opacity,
                }}
              >
                {backgroundText}
              </span>
            </div>

            {/* Main shoe visual — large floating hero */}
            <div className="relative z-10 flex min-h-[320px] w-full flex-1 items-center justify-center py-8 sm:min-h-[400px] sm:py-12 lg:min-h-0 lg:py-6">
              <div className="relative w-[88%] translate-y-[3%] sm:w-[78%] lg:w-[82%]">
                <div key={color.name} className="animate-[ym-rise_0.5s_ease]">
                  <div className="relative">
                    <div
                      className="absolute left-1/2 top-1/2 h-[85%] w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px] transition-colors duration-700"
                      style={{ backgroundColor: `${theme.glow}40` }}
                      aria-hidden="true"
                    />
                    <ShoeVisual
                      accent={hex}
                      color={hex}
                      label={`${product.name} in the ${color.name} colorway`}
                      className="relative h-auto w-full animate-[ym-float_6s_ease-in-out_infinite]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Badges top-left */}
            <span
              className="absolute left-5 top-5 z-20 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest backdrop-blur-md transition-colors duration-700 sm:left-7 sm:top-7"
              style={{
                color: theme.chip,
                borderColor: theme.chipBorder,
                backgroundColor: theme.chipBg,
              }}
            >
              Free shipping · Easy returns
            </span>

            {/* Badges top-right */}
            <div className="absolute right-5 top-5 z-20 flex flex-col items-end gap-2 sm:right-7 sm:top-7">
              {product.isNew && (
                <span
                  className="rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md transition-colors duration-700"
                  style={{
                    color: theme.chip,
                    borderColor: theme.chipBorder,
                    backgroundColor: theme.chipBg,
                  }}
                >
                  New Drop
                </span>
              )}
              {discount > 0 && (
                <span className="rounded-full bg-cyan-400 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Next Product teaser — inside hero, bottom-left (desktop only) */}
            {nextCard && (
              <div className="absolute bottom-5 left-5 z-30 hidden w-[280px] max-w-[calc(100%-2.5rem)] lg:block sm:bottom-7 sm:left-7">
                {nextCard}
              </div>
            )}
          </div>

          {/* ─── RIGHT: Compact product info panel ─── */}
          <div className="order-2 min-h-0 p-3 transition-colors duration-700 sm:p-5 lg:flex lg:flex-col lg:overflow-y-auto lg:border-l lg:px-6 lg:py-5" style={{ borderColor: theme.isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)" }}>
            {/* Brand + name */}
            <p
              className="text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-700 lg:text-[10px]"
              style={{ color: theme.accent }}
            >
              {brandName}
            </p>
            <h1
              className="mt-0.5 text-xl font-black leading-tight tracking-tight sm:text-2xl lg:text-[1.4rem] lg:leading-snug transition-colors duration-700"
              style={{ color: theme.text }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm" style={{ color: theme.isLight ? "#71717a" : "#a1a1aa" }}>
              <span className="flex items-center gap-1">
                <StarIcon />
                <span className="font-bold" style={{ color: theme.text }}>{product.rating.toFixed(1)}</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-current opacity-40" aria-hidden="true" />
              <span>{product.reviewCount} reviews</span>
            </div>

            {/* Price */}
            <div className="mt-2 flex flex-wrap items-baseline gap-2.5">
              <span
                className="text-2xl font-black tracking-tight sm:text-3xl transition-colors duration-700"
                style={{ color: theme.text }}
              >
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-sm font-medium line-through transition-colors duration-700" style={{ color: theme.isLight ? "#a1a1aa" : "#71717a" }}>
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              {discount > 0 && (
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-bold transition-colors duration-700"
                  style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
                >
                  Save {formatPrice(product.oldPrice! - product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            <p
              className="mt-2 max-w-sm text-[13px] leading-relaxed transition-colors duration-700 lg:text-xs lg:leading-normal"
              style={{ color: theme.isLight ? "#71717a" : "#737373" }}
            >
              Same flawless fit, same premium build — pick the color that matches your energy.
            </p>

            {/* Divider */}
            <div className="mt-2.5 h-px w-full transition-colors duration-700" style={{ backgroundColor: theme.panelBorder }} />

            {/* Color selector */}
            <div className="mt-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-700" style={{ color: theme.isLight ? "#71717a" : "#737373" }}>
                  Colorway
                </p>
                <span
                  className="text-xs font-bold transition-colors duration-700"
                  style={{ color: theme.accent }}
                >
                  {variant.colorName}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2.5 lg:gap-2" role="group" aria-label="Colorway">
                {product.colors.map((option, index) => {
                  const active = index === colorIndex;
                  return (
                    <button
                      key={option.name}
                      type="button"
                      aria-pressed={active}
                      aria-label={`${option.name} colorway`}
                      title={option.name}
                      onClick={() => setColorIndex(index)}
                      className="relative inline-flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 lg:h-8 lg:w-8"
                      style={{
                        boxShadow: active
                          ? `0 0 0 2px ${option.hex}, 0 0 18px ${option.hex}70`
                          : theme.isLight
                            ? "0 0 0 1px rgba(0,0,0,0.2)"
                            : "0 0 0 1px rgba(255,255,255,0.15)",
                      }}
                    >
                      <span
                        className="h-6 w-6 rounded-full ring-1 ring-inset ring-black/30"
                        style={{ backgroundColor: option.hex }}
                      />
                      {active && (
                        <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow" aria-hidden="true">
                          <CheckIcon />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size selector */}
            <div className="mt-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-700" style={{ color: theme.isLight ? "#71717a" : "#737373" }}>
                  Select size
                </p>
                <span
                  className="text-[11px] font-semibold transition-colors duration-700"
                  style={{ color: theme.accent }}
                >
                  US
                </span>
              </div>
              <div
                className="mt-2 grid grid-cols-4 gap-1.5 sm:grid-cols-6 lg:grid-cols-6 lg:gap-1.5 xl:grid-cols-6"
                role="group"
                aria-label="Shoe sizes"
              >
                {SHOE_SIZES.map((size) => {
                  const active = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-xl border py-1.5 text-sm font-bold transition-all duration-200 lg:py-1.5 ${
                        active
                          ? "border-transparent text-black"
                          : theme.isLight
                            ? "bg-white/50 hover:border-black/30 hover:bg-white/80"
                            : "border-border bg-card hover:border-white/30 hover:bg-card-hover"
                      }`}
                      style={
                        active
                          ? ({
                              backgroundColor: theme.cta,
                              color: theme.ctaText,
                              boxShadow: `0 0 20px ${theme.cta}50`,
                            } as CSSProperties)
                          : { color: theme.text, borderColor: theme.isLight ? "rgba(0,0,0,0.16)" : undefined }
                      }
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="mt-2.5 h-px w-full transition-colors duration-700" style={{ backgroundColor: theme.panelBorder }} />

            {/* CTA buttons */}
            <div className="mt-3 flex flex-col gap-1.5 lg:gap-2">
              {banner && (
                <p
                  role={banner.tone === "error" ? "alert" : "status"}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-colors duration-700 ${
                    banner.tone === "error" ? "bg-rose-500/15 text-rose-400" : "bg-emerald-500/15 text-emerald-400"
                  }`}
                >
                  {banner.text}
                </p>
              )}
              <button
                type="button"
                onClick={() => handleAddToBag(false)}
                disabled={busy}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 sm:px-7 sm:py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 lg:py-3"
                style={{
                  backgroundColor: theme.cta,
                  color: theme.ctaText,
                  boxShadow: `0 12px 34px -10px ${theme.cta}88`,
                }}
              >
                {busy ? "Adding…" : `Add to Bag — ${formatPrice(product.price)}`}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={toggleWishlist}
                  aria-pressed={wishlisted}
                  aria-label={
                    wishlisted
                      ? `Remove ${product.name} from wishlist`
                      : `Add ${product.name} to wishlist`
                  }
                  className={`inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border transition-colors duration-200 lg:h-[44px] lg:w-[44px] ${
                    wishlisted
                      ? "border-rose-400/60 bg-rose-400/15 text-rose-400"
                      : "border-border bg-card hover:border-white/30"
                  }`}
                  style={!wishlisted ? { color: theme.text } : undefined}
                >
                  <HeartIcon filled={wishlisted} />
                </button>
                <button
                  type="button"
                  onClick={() => handleAddToBag(true)}
                  disabled={busy}
                  className="inline-flex w-full items-center justify-center rounded-full border px-6 py-2.5 sm:px-7 sm:py-3 text-sm font-bold uppercase tracking-widest backdrop-blur transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 lg:py-2.5"
                  style={{
                    borderColor: `${theme.cta}55`,
                    color: theme.cta,
                    backgroundColor: `${theme.cta}12`,
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Meta info */}
            <div
              className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t pt-2.5 text-[11px] font-semibold uppercase tracking-widest transition-colors duration-700 lg:mt-auto lg:pt-2"
              style={{
                borderColor: theme.panelBorder,
                color: theme.isLight ? "#a1a1aa" : "#52525b",
              }}
            >
              <span>Size: {selectedSize}</span>
              <span className="h-1 w-1 rounded-full bg-current opacity-40" aria-hidden="true" />
              <span>{product.colors.length} colorways</span>
              <span className="h-1 w-1 rounded-full bg-current opacity-40" aria-hidden="true" />
              <span>In stock</span>
            </div>
          </div>
        </div>

        {/* Next Product teaser — mobile, below main content */}
        {nextCard && <div className="mt-6 lg:hidden">{nextCard}</div>}
      </div>
    </section>
  );
}