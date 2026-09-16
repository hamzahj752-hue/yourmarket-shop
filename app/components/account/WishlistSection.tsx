"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/auth-context";
import { useShopCounts } from "@/app/context/shop-context";
import {
  addProductToCart,
  fetchWishlist,
  getShopProductBySlug,
  removeWishlistItem,
} from "@/app/lib/shop-service";
import { ArrowRightIcon, HeartIcon, TrashIcon } from "./icons";
import { Panel, SectionHeader } from "./ui";

type WishlistProduct = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  brandName: string;
  price: number;
  salePrice: number | null;
  accent: string;
  stockTotal: number;
};

function stockInfo(stockTotal: number): { label: string; tone: string; count: number } {
  if (stockTotal <= 0) return { label: "Out of stock", tone: "text-rose-400", count: 0 };
  if (stockTotal < 5) return { label: "Low stock", tone: "text-amber-400", count: stockTotal };
  return { label: "In stock", tone: "text-emerald-400", count: stockTotal };
}

export default function WishlistSection() {
  const { user } = useAuth();
  const { refreshCounts } = useShopCounts();
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [bagIds, setBagIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchWishlist(user.id).then((rows) => {
      setItems(rows);
      setLoading(false);
    });
  }, [user]);

  async function remove(id: string) {
    if (!user) return;
    const result = await removeWishlistItem(user.id, id);
    if (!result.ok) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    refreshCounts();
  }

  async function addToBag(id: string) {
    if (bagIds.includes(id)) return;
    const product = await getShopProductBySlug(items.find((i) => i.id === id)?.slug ?? "");
    if (!product) return;
    const result = await addProductToCart(product);
    if (!result.ok) return;
    setBagIds((prev) => [...prev, id]);
    refreshCounts();
  }

  if (loading) {
    return (
      <section aria-labelledby="wishlist-heading">
        <SectionHeader
          eyebrow="Wishlist"
          title="Your saved styles"
          description="Products you saved for later."
        />
        <Panel className="mt-6 p-6 text-sm text-muted">Loading your wishlist…</Panel>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section aria-labelledby="wishlist-heading">
        <SectionHeader
          eyebrow="Wishlist"
          title="Your saved styles"
          description="Products you saved for later."
        />
        <Panel className="mt-6 flex flex-col items-center gap-4 px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-muted">
            <HeartIcon className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Your wishlist is empty
            </h3>
            <p className="mt-1 text-sm text-muted">
              Save products you love and they will appear here.
            </p>
          </div>
          <a
            href="/shoes"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover"
          >
            Browse the shop
          </a>
        </Panel>
      </section>
    );
  }

  return (
    <section aria-labelledby="wishlist-heading">
      <SectionHeader
        eyebrow="Wishlist"
        title="Your saved styles"
        description={`${items.length} item${items.length === 1 ? "" : "s"} saved for later.`}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const stock = stockInfo(item.stockTotal);
          const inBag = bagIds.includes(item.id);
          const addable = item.stockTotal > 0;

          return (
            <Panel
              key={item.id}
              className="group flex flex-col overflow-hidden transition-colors"
            >
              <div
                className="relative flex h-40 items-center justify-center overflow-hidden sm:h-44"
                aria-hidden="true"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(120% 90% at 50% 0%, ${item.accent}55 0%, #111111 100%)`,
                  }}
                />
                <svg viewBox="0 0 240 300" className="relative h-32 w-auto drop-shadow-lg">
                  <path
                    d="M120 18 L78 44 L64 72 L86 84 L86 282 H154 L154 84 L176 72 L162 44 Z"
                    fill={item.accent}
                    stroke="#3f3f46"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M120 18 L78 44 L64 72 L86 84 L86 282 H154 L154 84 L176 72 L162 44 Z"
                    fill="url(#wl-gloss)"
                  />
                  <line
                    x1="120"
                    y1="96"
                    x2="120"
                    y2="268"
                    stroke="#a3e635"
                    strokeWidth="3"
                    strokeDasharray="1 7"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                  <defs>
                    <linearGradient id="wl-gloss" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#ffffff" stopOpacity="0.12" />
                      <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`Remove ${item.name} from wishlist`}
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 text-muted backdrop-blur transition-colors hover:border-rose-400 hover:text-rose-400"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                  {item.brandName}
                </p>
                <h3 className="mt-1 text-base font-bold text-foreground">
                  {item.name}
                </h3>

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-lg font-black tracking-tight text-foreground">
                    {item.salePrice ? (
                      <>
                        <span className="text-accent">${item.salePrice.toFixed(2)}</span>{" "}
                        <span className="text-sm font-medium text-muted line-through">
                          ${item.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      `$${item.price.toFixed(2)}`
                    )}
                  </p>
                  {item.salePrice && (
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
                      Sale
                    </span>
                  )}
                </div>

                <p className={`mt-1 text-xs font-medium ${stock.tone}`}>
                  {stock.label}
                  {stock.label === "Low stock"
                    ? ` — only ${stock.count} left`
                    : stock.label === "Out of stock"
                      ? " — restock soon"
                      : " · Ready to ship"}
                </p>

                <div className="mt-4 flex gap-2">
                  {addable && (
                    <button
                      type="button"
                      onClick={() => addToBag(item.id)}
                      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${
                        inBag
                          ? "border border-accent/40 bg-accent/10 text-accent"
                          : "bg-accent text-black hover:bg-accent-hover"
                      }`}
                    >
                      {inBag ? <>✓ Added</> : "Add to Bag"}
                    </button>
                  )}
                  <a
                    href={`/product/${item.slug}`}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    View Product
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </section>
  );
}