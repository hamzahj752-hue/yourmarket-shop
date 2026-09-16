"use client";

import ProductVisual from "../catalog/ProductVisual";
import ShoeVisual from "../shoes/ShoeVisual";
import type { ProductDetail } from "@/app/data/productDetails";

function galleryMainClass(product: ProductDetail): string {
  return product.category === "shoes" ? "aspect-[4/3]" : "aspect-[4/5]";
}

function GalleryBadge({ product }: { product: ProductDetail }) {
  const savePct =
    product.salePrice != null
      ? Math.round((1 - product.salePrice / product.price) * 100)
      : 0;

  if (savePct > 0) {
    return (
      <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-black sm:left-4 sm:top-4">
        Save {savePct}%
      </span>
    );
  }

  return null;
}

export default function ProductGalleryMain({
  product,
  colorHex,
}: {
  product: ProductDetail;
  colorHex: string;
}) {
  const isShoe = product.category === "shoes";
  const accent = isShoe ? colorHex : product.accent;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-3xl border border-border bg-surface ${galleryMainClass(product)}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${accent}1a, transparent 55%)`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -right-10 -top-10 h-56 w-56 rounded-full sm:h-72 sm:w-72"
        style={{ background: `${accent}21`, filter: "blur(60px)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30"
        aria-hidden="true"
      />

      <GalleryBadge product={product} />

      <div className="relative flex items-center justify-center p-4 sm:p-8 lg:p-10">
        {isShoe ? (
          <ShoeVisual
            accent={accent}
            className="h-auto w-full max-w-[min(100%,16rem)] drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] sm:max-w-[22rem]"
          />
        ) : (
          <div className="scale-[1.55] sm:scale-[1.7]">
            <ProductVisual category={product.category} color={colorHex} />
          </div>
        )}
      </div>
    </div>
  );
}

export function ThumbnailStrip({
  product,
  activeIndex,
  onSelect,
  className = "",
}: {
  product: ProductDetail;
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}) {
  const isShoe = product.category === "shoes";

  return (
    <div
      role="group"
      aria-label={`${product.name} images`}
      className={`no-scrollbar flex gap-2.5 sm:gap-3 ${className}`}
    >
      {product.images.map((image, index) => {
        const active = index === activeIndex;
        const accent = isShoe ? image.colorHex : product.accent;
        return (
          <button
            key={image.id}
            type="button"
            onClick={() => onSelect(index)}
            aria-pressed={active}
            aria-label={`View ${image.alt}`}
            className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-surface transition-all duration-200 ${
              isShoe ? "h-12 w-16 sm:h-14 sm:w-20" : "aspect-[4/5] h-14 w-12 sm:h-16 sm:w-[3.25rem]"
            } ${
              active
                ? "border-accent ring-1 ring-accent"
                : "border-border hover:border-accent/60"
            }`}
          >
            <span
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${accent}14, transparent 60%)`,
              }}
              aria-hidden="true"
            />
            {isShoe ? (
              <ShoeVisual
                accent={accent}
                className="h-auto w-full max-w-[3.25rem]"
              />
            ) : (
              <ProductVisual category={product.category} color={image.colorHex} />
            )}
          </button>
        );
      })}
    </div>
  );
}