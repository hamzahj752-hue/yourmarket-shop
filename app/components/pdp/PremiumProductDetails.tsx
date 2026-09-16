"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/app/data/products";
import { useWishlist } from "@/app/lib/use-wishlist";
import { addToBag } from "@/app/lib/add-to-bag";
import {
  getProductBackgroundText,
  getProductBackgroundTextStyle,
  getProductDescription,
  getProductsByCategory,
  getProductSizes,
  getProductVariants,
} from "@/app/data/products";
import ProductVisual from "../catalog/ProductVisual";
import StarRating from "../catalog/StarRating";
import NextProduct from "./NextProduct";
import { BACKGROUND_TEXT_STYLES, getEditorialTheme, relativeLuminance } from "@/app/lib/presentation";
import type { EditorialTheme } from "@/app/lib/presentation";

const CATEGORY_LINKS: Record<string, { label: string; href: string }> = {
  "t-shirts": { label: "T-Shirts", href: "/category/t-shirts" },
  pants: { label: "Pants", href: "/category/pants" },
  "shirts-jackets": { label: "Shirts & Jackets", href: "/category/shirts-jackets" },
  sunglasses: { label: "Sunglasses", href: "/category/sunglasses" },
};

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

function ChevronLeftIcon() {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

export default function PremiumProductDetails({ product }: { product: Product }) {
  const router = useRouter();
  const [colorIndex, setColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
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
        colorValue: variant.colorValue,
        size: selectedSize,
        quantity,
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

  const variants = useMemo(() => getProductVariants(product), [product]);
  const variant = variants[colorIndex];
  const color = variant.colorValue;

  const sizes = getProductSizes(product);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    sizes.length > 0 ? sizes[0] : null
  );

  const theme = useMemo<EditorialTheme>(() => {
    const base = getEditorialTheme(color);
    const accent = variant.accentColor ?? base.accent;
    const cta = variant.accentColor ?? base.cta;
    return {
      ...base,
      pageBg: variant.themeColor ?? base.pageBg,
      text: variant.textColor ?? base.text,
      accent,
      cta,
      ctaText: relativeLuminance(cta) > 0.5 ? "#0b0b0c" : "#ffffff",
    };
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
  }, [color, variant]);

  const backgroundText = getProductBackgroundText(product);
  const backgroundTextStyle = getProductBackgroundTextStyle(product);
  const bgTextPreset = BACKGROUND_TEXT_STYLES[backgroundTextStyle];
  const bgTextColor =
    product.backgroundTextColor ?? variant.backgroundTextColor ?? theme.ghost;

  const categoryLink = CATEGORY_LINKS[product.category] ?? {
    label: product.category,
    href: "/shop",
  };
  const isSale = product.salePrice != null;
  const price = isSale ? (product.salePrice as number) : product.price;
  const savings =
    isSale && product.salePrice != null
      ? product.price - product.salePrice
      : 0;

  const categoryProducts = getProductsByCategory(product.category);
  const currentIndex = categoryProducts.findIndex((p) => p.slug === product.slug);
  const nextProduct =
    currentIndex >= 0
      ? categoryProducts[(currentIndex + 1) % categoryProducts.length]
      : undefined;

  const nextCard = nextProduct ? (
    <NextProduct
      href={`/product/${nextProduct.slug}`}
      name={nextProduct.name}
      price={formatPrice(nextProduct.salePrice ?? nextProduct.price)}
      accent={theme.accent}
      tone={theme.isLight ? "light" : "dark"}
      visual={
        <ProductVisual
          category={nextProduct.category}
          color={nextProduct.colors[0]}
        />
      }
    />
  ) : null;

  return (
    <section
      className="relative overflow-hidden border-b transition-colors duration-700 lg:h-[calc(100dvh-80px)]"
      style={{
        backgroundColor: theme.pageBg,
        borderColor: theme.isLight ? "rgba(0,0,0,0.14)" : "#262626",
      }}
    >
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full blur-3xl transition-colors duration-700"
        style={{ backgroundColor: theme.glowA }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full blur-3xl transition-colors duration-700"
        style={{ backgroundColor: theme.glowB }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-[84rem] flex-col overflow-hidden px-4 pb-5 pt-4 sm:px-6 lg:px-10 lg:pb-6 lg:pt-5 xl:max-w-[100rem] 2xl:max-w-[112rem] 2xl:px-16">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
          <Link
            href={categoryLink.href}
            className="inline-flex items-center gap-1 font-semibold transition-opacity hover:opacity-75"
            style={{ color: theme.subtle }}
          >
            <ChevronLeftIcon />
            {categoryLink.label}
          </Link>
          <span
            className="h-1 w-1 rounded-full"
            style={{ backgroundColor: theme.hairline }}
            aria-hidden="true"
          />
          <span style={{ color: theme.subtle }}>{product.brand}</span>
        </nav>

        <div className="relative mt-3 grid min-h-0 flex-1 items-stretch lg:grid-cols-[7fr_5fr]">
              <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden px-4 py-10 sm:min-h-[440px] sm:px-6 sm:py-14 lg:min-h-0 lg:py-8">
                {/* Soft editorial stage — tonal lift that fades instead of a boxed boundary */}
                <div
                  className="pointer-events-none absolute inset-0 transition-colors duration-700"
                  style={{
                    backgroundImage: `radial-gradient(ellipse 90% 80% at 42% 48%, ${theme.cardBg}, transparent 72%)`,
                  }}
                  aria-hidden="true"
                />

                {/* Oversized background display text behind the product */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
                >
                  <span
                    className={`whitespace-nowrap leading-none ${bgTextPreset.className}`}
                    style={{
                      color: bgTextPreset.stroke ? "transparent" : bgTextColor,
                      WebkitTextStroke: bgTextPreset.stroke
                        ? `1.5px ${bgTextColor}`
                        : undefined,
                      fontSize: "clamp(2.8rem, 10vw, 7.5rem)",
                      letterSpacing: bgTextPreset.letterSpacing,
                      fontWeight: bgTextPreset.fontWeight,
                      opacity: bgTextPreset.opacity,
                    }}
                  >
                    {backgroundText}
                  </span>
                </div>

                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[62%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] transition-colors duration-700"
                  style={{ backgroundColor: `${color}35` }}
                  aria-hidden="true"
                />

                <div
                  key={color}
                  className="relative z-10 animate-[ym-rise_0.5s_ease]"
                >
                  <div
                    className="flex items-center justify-center rounded-full p-4 transition-colors duration-700 sm:p-8 lg:p-7"
                    style={{
                      backgroundColor: theme.isLight
                        ? "rgba(255,255,255,0.55)"
                        : "rgba(255,255,255,0.02)",
                      border: `1px solid ${
                        theme.isLight
                          ? "rgba(0,0,0,0.08)"
                          : "rgba(255,255,255,0.05)"
                      }`,
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                    }}
                  >
                    <ProductVisual category={product.category} color={color} />
                  </div>
                </div>

                {nextCard && (
                  <div className="absolute bottom-6 left-6 z-30 hidden w-[320px] max-w-[calc(100%-3rem)] lg:block sm:bottom-8 sm:left-8">
                    {nextCard}
                  </div>
                )}

                <span
                  className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-bold uppercase tracking-widest backdrop-blur transition-colors duration-700 sm:left-8 sm:top-8"
                  style={{
                    backgroundColor: theme.isLight
                      ? "rgba(255,255,255,0.6)"
                      : theme.chipBg,
                    borderColor: theme.chipBorder,
                    color: theme.chipText,
                  }}
                >
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <span
                      className="relative inline-flex h-2 w-2 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                  </span>
                  In Stock
                </span>

                {isSale && (
                  <span
                    className="absolute right-5 top-5 z-20 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors duration-700 sm:right-8 sm:top-8"
                    style={{ backgroundColor: theme.cta, color: theme.ctaText }}
                  >
                    Sale
                  </span>
                )}
              </div>

              <div
                className="relative min-h-0 border-t p-4 transition-colors duration-700 sm:p-8 lg:border-l lg:border-t-0 lg:flex lg:flex-col lg:overflow-y-auto lg:px-8 lg:py-6"
                style={{ borderColor: theme.hairline }}
              >
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest transition-colors duration-700"
                    style={{ color: theme.subtle }}
                  >
                    {product.brand}
                    <span
                      className="mx-2"
                      style={{ color: theme.hairline }}
                      aria-hidden="true"
                    >
                      /
                    </span>
                    {product.type}
                  </p>

                  <h1
                    className="mt-2 text-2xl font-black tracking-tight transition-colors duration-700 sm:text-3xl lg:text-3xl"
                    style={{ color: theme.text }}
                  >
                    {product.name}
                  </h1>

                  <span className="mt-2 inline-flex items-center gap-1.5">
                    <StarRating rating={product.rating} hideNumber />
                    <span
                      className="text-xs transition-colors duration-700"
                      style={{ color: theme.subtle }}
                    >
                      {product.rating.toFixed(1)} ({product.ratingCount} reviews)
                    </span>
                  </span>
                </div>

                <p
                  className="mt-3 text-sm leading-relaxed transition-colors duration-700 sm:text-base"
                  style={{ color: theme.body }}
                >
                  {getProductDescription(product)}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 text-sm">
                  <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <span
                      className="relative inline-flex h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                  </span>
                  <span
                    className="font-bold transition-colors duration-700"
                    style={{ color: theme.text }}
                  >
                    Availability:
                  </span>
                  <span
                    className="transition-colors duration-700"
                    style={{ color: theme.body }}
                  >
                    In stock — ships within 24h
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span
                    className="text-2xl font-black tracking-tight transition-colors duration-700 sm:text-3xl"
                    style={{ color: theme.accent }}
                  >
                    {formatPrice(price)}
                  </span>
                  {isSale && (
                    <>
                      <span
                        className="text-base font-medium line-through transition-colors duration-700 sm:text-lg"
                        style={{ color: theme.subtle }}
                      >
                        {formatPrice(product.price)}
                      </span>
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-bold transition-colors duration-700"
                        style={{
                          backgroundColor: theme.accentSoft,
                          color: theme.accent,
                        }}
                      >
                        Save {formatPrice(savings)}
                      </span>
                    </>
                  )}
                </div>

                <div
                  className="mt-4 border-t pt-4 transition-colors duration-700"
                  style={{ borderColor: theme.hairline }}
                >
                  <div className="flex items-center justify-between">
                    <p
                      className="text-xs font-bold uppercase tracking-widest transition-colors duration-700"
                      style={{ color: theme.subtle }}
                    >
                      Select color —{" "}
                      <span
                        className="transition-colors duration-700"
                        style={{ color: theme.text }}
                      >
                        {variant.colorName}
                      </span>
                    </p>
                  </div>

                  <div
                    className="mt-3 flex flex-wrap items-center gap-2.5"
                    role="group"
                    aria-label="Select color"
                  >
                    {variants.map((swatch, index) => {
                      const active = index === colorIndex;
                      return (
                        <button
                          key={swatch.colorValue}
                          type="button"
                          aria-pressed={active}
                          aria-label={swatch.colorName}
                          title={swatch.colorName}
                          onClick={() => setColorIndex(index)}
                          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
                          style={{
                            boxShadow: active
                              ? `0 0 0 2px ${theme.text}, 0 0 16px ${swatch.colorValue}80`
                              : theme.isLight
                                ? "0 0 0 1px rgba(0,0,0,0.25)"
                                : "0 0 0 1px rgba(255,255,255,0.18)",
                          }}
                        >
                          <span
                            className="h-[26px] w-[26px] rounded-full ring-1 ring-inset ring-black/30 transition-transform duration-200"
                            style={{ backgroundColor: swatch.colorValue }}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <p
                    className="mt-2 text-xs transition-colors duration-700"
                    style={{ color: theme.subtle }}
                  >
                    {`${colorIndex + 1} of ${variants.length} — swatches update the image above instantly.`}
                  </p>
                </div>

                {sizes.length > 0 && (
                  <div
                    className="mt-4 border-t pt-4 transition-colors duration-700"
                    style={{ borderColor: theme.hairline }}
                  >
                    <div className="flex items-center justify-between">
                      <p
                        className="text-xs font-bold uppercase tracking-widest transition-colors duration-700"
                        style={{ color: theme.subtle }}
                      >
                        Select size
                      </p>
                      <button
                        type="button"
                        className="text-xs font-semibold underline-offset-2 transition-colors hover:underline"
                        style={{ color: theme.subtle }}
                      >
                        Size guide
                      </button>
                    </div>
                    <div
                      className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5"
                      role="group"
                      aria-label="Product sizes"
                    >
                      {sizes.map((size) => {
                        const active = selectedSize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setSelectedSize(size)}
                            className="rounded-xl border py-2 text-sm font-bold transition-all duration-200 hover:brightness-110 sm:py-2.5"
                            style={
                              active
                                ? {
                                    backgroundColor: theme.cta,
                                    color: theme.ctaText,
                                    borderColor: "transparent",
                                    boxShadow: `0 0 20px ${theme.cta}40`,
                                  }
                                : {
                                    color: theme.body,
                                    borderColor: theme.isLight
                                      ? "rgba(0,0,0,0.18)"
                                      : "rgba(255,255,255,0.14)",
                                    backgroundColor: theme.ctaSoft,
                                  }
                            }
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div
                  className="mt-4 border-t pt-4 transition-colors duration-700"
                  style={{ borderColor: theme.hairline }}
                >
                  <div className="flex items-center justify-between">
                    <p
                      className="text-xs font-bold uppercase tracking-widest transition-colors duration-700"
                      style={{ color: theme.subtle }}
                    >
                      Quantity
                    </p>
                    <span
                      className="text-xs transition-colors duration-700"
                      style={{ color: theme.subtle }}
                    >
                      {product.type} · {product.category}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border transition-all hover:brightness-110 active:scale-95"
                      style={{
                        color: theme.body,
                        borderColor: theme.isLight
                          ? "rgba(0,0,0,0.2)"
                          : "rgba(255,255,255,0.16)",
                        backgroundColor: theme.ctaSoft,
                      }}
                    >
                      <MinusIcon />
                    </button>
                    <span
                      className="w-10 text-center text-lg font-black tabular-nums transition-colors duration-700"
                      style={{ color: theme.text }}
                    >
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border transition-all hover:brightness-110 active:scale-95"
                      style={{
                        color: theme.body,
                        borderColor: theme.isLight
                          ? "rgba(0,0,0,0.2)"
                          : "rgba(255,255,255,0.16)",
                        backgroundColor: theme.ctaSoft,
                      }}
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  {banner && (
                    <p
                      role={banner.tone === "error" ? "alert" : "status"}
                      style={{ color: banner.tone === "error" ? "#f87171" : "#34d399" }}
                      className="text-xs font-bold"
                    >
                      {banner.text}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={toggleWishlist}
                      aria-pressed={wishlisted}
                      aria-label={
                        wishlisted
                          ? `Remove ${product.name} from wishlist`
                          : `Add ${product.name} to wishlist`
                      }
                      className={`inline-flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                        wishlisted
                          ? "border-rose-400/60 bg-rose-400/15 text-rose-400"
                          : "hover:brightness-110"
                      }`}
                      style={
                        !wishlisted
                          ? {
                              borderColor: theme.isLight
                                ? "rgba(0,0,0,0.22)"
                                : "rgba(255,255,255,0.16)",
                              backgroundColor: theme.ctaSoft,
                              color: theme.body,
                            }
                          : undefined
                      }
                    >
                      <HeartIcon filled={wishlisted} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddToBag(false)}
                      disabled={busy}
                      className="inline-flex w-full items-center justify-center rounded-full px-6 py-2.5 sm:px-7 sm:py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                      style={{
                        backgroundColor: theme.cta,
                        color: theme.ctaText,
                        boxShadow: `0 14px 38px -14px ${theme.cta}80`,
                      }}
                    >
                      {busy ? "Adding…" : "Add to Cart"}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddToBag(true)}
                    disabled={busy}
                    className="inline-flex w-full items-center justify-center rounded-full border px-6 py-2.5 sm:px-7 sm:py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      borderColor: theme.isLight
                        ? "rgba(0,0,0,0.22)"
                        : "rgba(255,255,255,0.16)",
                      backgroundColor: theme.ctaSoft,
                      color: theme.text,
                    }}
                  >
                    Buy Now
                  </button>
                </div>

                <div
                  className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-widest transition-colors duration-700 lg:mt-auto"
                  style={{ color: theme.subtle }}
                >
                  <span>Free shipping</span>
                  <span
                    className="h-1 w-1 rounded-full"
                    style={{ backgroundColor: theme.hairline }}
                    aria-hidden="true"
                  />
                  <span>30-day returns</span>
                  <span
                    className="h-1 w-1 rounded-full"
                    style={{ backgroundColor: theme.hairline }}
                    aria-hidden="true"
                  />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>

        {nextCard && <div className="mt-6 lg:hidden">{nextCard}</div>}
      </div>
    </section>
  );
}