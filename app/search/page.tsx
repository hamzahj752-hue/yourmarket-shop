"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/catalog/ProductCard";
import { allProducts, ALL_BRANDS, ALL_CATEGORIES, PRICE_RANGES, ALL_COLORS, CATEGORY_LABELS } from "@/app/data/store";

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none h-4 w-4" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <span className="relative inline-flex shrink-0">
      <label htmlFor={label} className="sr-only">{label}</label>
      <select id={label} value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none rounded-full border border-border bg-card py-2.5 pl-4 pr-9 text-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent">
        {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted"><ChevronDownIcon /></span>
    </span>
  );
}

const SORT_OPTIONS = [
  { value: "recommended", label: "Sort: Recommended" },
  { value: "newest", label: "Sort: Newest" },
  { value: "price-asc", label: "Sort: Price Low to High" },
  { value: "price-desc", label: "Sort: Price High to Low" },
  { value: "rating", label: "Sort: Top Rated" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [minRating, setMinRating] = useState("0");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const toggleColor = (c: string) => setSelectedColors((v) => v.includes(c) ? v.filter((x) => x !== c) : [...v, c]);

  const filtered = useMemo(() => {
    const list = allProducts.filter((p) => {
      if (query) {
        const q = query.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
      }
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
      if (selectedBrand !== "All" && p.brand !== selectedBrand) return false;
      if (Number(minRating) > 0 && p.rating < Number(minRating)) return false;
      if (selectedPriceRange !== "All") {
        const range = PRICE_RANGES.find((r) => r.label === selectedPriceRange);
        if (range && (p.price < range.min || p.price >= range.max)) return false;
      }
      if (selectedColors.length > 0) {
        const hasColor = selectedColors.some((c) => p.colors.includes(c));
        if (!hasColor) return false;
      }
      return true;
    });

    switch (sortBy) {
      case "price-asc": return [...list].sort((a, b) => a.price - b.price);
      case "price-desc": return [...list].sort((a, b) => b.price - a.price);
      case "rating": return [...list].sort((a, b) => b.rating - a.rating);
      case "newest": return [...list].sort((a, b) => ((b as { isNew?: boolean }).isNew ? 1 : 0) - ((a as { isNew?: boolean }).isNew ? 1 : 0));
      default: return list;
    }
  }, [query, selectedCategory, selectedBrand, sortBy, minRating, selectedPriceRange, selectedColors]);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -left-40 -top-40 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Search</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              {query ? <>Results for &ldquo;{query}&rdquo;</> : "Search Products"}
            </h1>
            <p className="mt-4 text-base text-muted">
              {filtered.length} {filtered.length === 1 ? "product" : "products"} found
            </p>
          </div>
        </section>

        <section className="border-b border-border" aria-label="Search filters">
          <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="relative mb-4 max-w-md">
              <label htmlFor="search-input" className="sr-only">Search products</label>
              <input id="search-input" type="search" placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-full border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></svg>
              </span>
            </div>

            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0" role="group" aria-label="Category">
              {["All", ...ALL_CATEGORIES].map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button key={cat} type="button" onClick={() => setSelectedCategory(cat)} className={`inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${active ? "border-accent bg-accent text-black" : "border-border bg-card text-muted hover:border-accent/50 hover:text-accent"}`}>
                    {cat === "All" ? "All" : CATEGORY_LABELS[cat] || cat}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
              <Select label="Brand" value={selectedBrand} onChange={setSelectedBrand} options={[{ value: "All", label: "All brands" }, ...ALL_BRANDS.map((b) => ({ value: b, label: b }))]} />
              <Select label="Sort by" value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} />
              <Select label="Rating" value={minRating} onChange={setMinRating} options={[{ value: "0", label: "Any rating" }, { value: "4", label: "4.0+" }, { value: "4.5", label: "4.5+" }]} />
              <Select label="Price" value={selectedPriceRange} onChange={setSelectedPriceRange} options={[{ value: "All", label: "Any price" }, ...PRICE_RANGES.map((r) => ({ value: r.label, label: r.label }))]} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted">Colors:</span>
              {ALL_COLORS.map((c) => (
                <button key={c.hex} type="button" onClick={() => toggleColor(c.hex)} title={c.name} className={`h-6 w-6 rounded-full border-2 transition-all ${selectedColors.includes(c.hex) ? "border-accent scale-110" : "border-border hover:border-accent/50"}`} style={{ backgroundColor: c.hex }} aria-label={c.name} />
              ))}
            </div>
          </div>
        </section>

        <section aria-label="Search results">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
                <div className="mb-4 text-muted opacity-30">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></svg>
                </div>
                <p className="text-lg font-bold text-foreground">No results found</p>
                <p className="mt-2 max-w-sm text-sm text-muted">
                  {query ? <>We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try different keywords or browse all products.</> : "Enter a search query to find products."}
                </p>
                <Link href="/shop" className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover">
                  Browse All Products
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background text-muted">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
