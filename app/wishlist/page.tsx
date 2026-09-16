"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductVisual from "@/app/components/catalog/ProductVisual";
import { useAuth } from "@/app/context/auth-context";
import { useShopCounts } from "@/app/context/shop-context";
import {
  addProductToCart,
  fetchWishlist,
  getShopProductById,
  removeWishlistItem,
} from "@/app/lib/shop-service";

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function EmptyWishlistIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="h-20 w-20 text-border" aria-hidden="true">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function stockInfo(stockTotal: number) {
  if (stockTotal <= 0) return { status: "Out of stock", count: 0 };
  if (stockTotal < 5) return { status: "Low stock", count: stockTotal };
  return { status: "In stock", count: stockTotal };
}

type WishItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  salePrice: number | null;
  accent: string;
  stockTotal: number;
};

export default function WishlistPage() {
  const { user } = useAuth();
  const { refreshCounts } = useShopCounts();
  const [items, setItems] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    function load() {
      if (!user) {
        setItems([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      fetchWishlist(user.id)
        .then((list) => {
          if (!active) return;
          setItems(
            list.map((item) => ({
              id: item.id,
              productId: item.productId,
              slug: item.slug,
              name: item.name,
              brand: item.brandName,
              price: item.price,
              salePrice: item.salePrice,
              accent: item.accent,
              stockTotal: item.stockTotal,
            })),
          );
        })
        .catch(() => {
          if (active) setItems([]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }
    load();
    return () => {
      active = false;
    };
  }, [user]);

  const removeItem = async (id: string) => {
    if (!user || busyId) return;
    setBusyId(id);
    const result = await removeWishlistItem(user.id, id);
    if (result.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      await refreshCounts();
    }
    setBusyId(null);
  };

  const addToCart = async (item: WishItem) => {
    if (busyId) return;
    setBusyId(item.id);
    setNotice(null);
    const product = await getShopProductById(item.productId);
    if (!product) {
      setNotice("This product is no longer available.");
    } else {
      const result = await addProductToCart(product, {});
      setNotice(result.ok ? "Added to your bag." : result.error);
      if (result.ok) await refreshCounts();
    }
    setBusyId(null);
  };

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -left-40 -top-40 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Saved items</p>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-4xl lg:text-5xl">Your Wishlist</h1>
            <p className="mt-4 text-sm text-muted">
              {loading
                ? "Loading…"
                : items.length > 0
                  ? `${items.length} ${items.length === 1 ? "item" : "items"} saved`
                  : "No saved items yet"}
            </p>
          </div>
        </section>

        <section aria-label="Wishlist items">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            {notice && (
              <p className="mb-6 w-fit rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 text-xs font-semibold text-accent">
                {notice}
              </p>
            )}

            {loading ? (
              <p className="text-sm text-muted">Loading your wishlist…</p>
            ) : items.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item) => {
                  const isSale = item.salePrice != null;
                  const stock = stockInfo(item.stockTotal);
                  const inStock = stock.status !== "Out of stock";
                  const lowStock = stock.status === "Low stock";

                  return (
                    <div key={item.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_8px_40px_rgba(163,230,53,0.12)]">
                      <Link href={`/product/${item.slug}`} className="flex h-full flex-col" aria-label={`View ${item.name}`}>
                        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-surface sm:aspect-[4/5]">
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-accent/[0.06]" aria-hidden="true" />
                          <ProductVisual category="t-shirts" color={item.accent} />
                          {isSale && (
                            <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-black">
                              Sale
                            </span>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">{item.brand}</span>
                          <h3 className="truncate text-sm font-bold text-foreground sm:text-base">{item.name}</h3>

                          <span className="flex items-baseline gap-2">
                            {isSale ? (
                              <>
                                <span className="text-sm font-black text-accent sm:text-base">{formatPrice(item.salePrice as number)}</span>
                                <span className="text-xs text-muted line-through">{formatPrice(item.price)}</span>
                              </>
                            ) : (
                              <span className="text-sm font-black text-foreground sm:text-base">{formatPrice(item.price)}</span>
                            )}
                          </span>

                          <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            inStock && !lowStock ? "bg-accent/10 text-accent" : lowStock ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"
                          }`}>
                            {stock.status}
                            {inStock && ` (${stock.count})`}
                          </span>
                        </div>
                      </Link>

                      <div className="flex gap-2 border-t border-border p-3">
                        <Link href={`/product/${item.slug}`} className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border py-2.5 text-[11px] font-bold uppercase tracking-wider text-foreground transition-colors hover:border-accent hover:text-accent sm:text-xs">
                          View Product
                        </Link>
                        {inStock && (
                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            disabled={busyId === item.id}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent py-2.5 text-[11px] font-bold uppercase tracking-wider text-black transition-colors hover:bg-accent-hover disabled:opacity-60 sm:text-xs"
                          >
                            <ShoppingBagIcon /> {busyId === item.id ? "Adding…" : "Add to Cart"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          disabled={busyId === item.id}
                          aria-label={`Remove ${item.name} from wishlist`}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-red-500/50 hover:text-red-400"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
                <EmptyWishlistIcon />
                <p className="mt-6 text-lg font-bold text-foreground">Your wishlist is empty</p>
                <p className="mt-2 max-w-sm text-sm text-muted">
                  Save items you love to your wishlist. Review them anytime and easily move them to your bag.
                </p>
                <Link href="/shop" className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}