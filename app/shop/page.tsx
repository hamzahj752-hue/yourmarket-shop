"use client";

import { useMemo, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/catalog/ProductCard";
import {
  allProducts,
  ALL_BRANDS,
  ALL_CATEGORIES,
  PRICE_RANGES,
  ALL_COLORS,
  CATEGORY_LABELS,
} from "@/app/data/store";

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none h-4 w-4" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M3 6h18" /><path d="M7 12h10" /><path d="M10 18h4" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <span className="relative inline-flex shrink-0">
      <label htmlFor={label} className="sr-only">{label}</label>
      <select id={label} value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none rounded-full border border-border bg-card py-2 pl-4 pr-9 text-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent">
        {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted"><ChevronDownIcon /></span>
    </span>
  );
}

const SORT_OPTIONS = [
  { value: "featured", label: "Sort: Featured" },
  { value: "newest", label: "Sort: Newest" },
  { value: "price-asc", label: "Sort: Price Low to High" },
  { value: "price-desc", label: "Sort: Price High to Low" },
  { value: "rating", label: "Sort: Top Rated" },
];

const RATING_OPTIONS = [
  { value: "0", label: "Min rating: Any" },
  { value: "4", label: "Min rating: 4.0+" },
  { value: "4.5", label: "Min rating: 4.5+" },
];

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [saleOnly, setSaleOnly] = useState(false);
  const [minRating, setMinRating] = useState("0");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const toggleColor = (c: string) => setSelectedColors((v) => v.includes(c) ? v.filter((x) => x !== c) : [...v, c]);

  const filtered = useMemo(() => {
    const list = allProducts.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
      }
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
      if (selectedBrand !== "All" && p.brand !== selectedBrand) return false;
      if (saleOnly && p.salePrice == null) return false;
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
  }, [search, selectedCategory, selectedBrand, sortBy, saleOnly, minRating, selectedPriceRange, selectedColors]);

  const resultText = filtered.length === allProducts.length
    ? `${allProducts.length} products`
    : `Showing ${filtered.length} of ${allProducts.length}`;

  const clearAll = () => {
    setSelectedCategory("All");
    setSelectedBrand("All");
    setSortBy("featured");
    setSaleOnly(false);
    setMinRating("0");
    setSelectedPriceRange("All");
    setSelectedColors([]);
    setSearch("");
  };

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -left-40 -top-40 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-40 -right-40 h-64 w-64 rounded-full bg-accent/5 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Yourmarket</p>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-4xl lg:text-5xl">All Products</h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              Browse the complete YOURMARKET collection. Filter by category, brand, size or price to find exactly what you need.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
              <span><strong className="font-bold text-foreground">{allProducts.length}</strong> products</span>
              <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
              <span><strong className="font-bold text-foreground">{ALL_CATEGORIES.length}</strong> categories</span>
              <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
              <span><strong className="font-bold text-foreground">{ALL_BRANDS.length}</strong> brands</span>
            </div>
          </div>
        </section>

        <section className="border-b border-border" aria-label="Catalog filters">
          <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="relative mb-4 max-w-md">
              <label htmlFor="shop-search" className="sr-only">Search products</label>
              <input id="shop-search" type="search" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-full border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted"><SearchIcon /></span>
            </div>

            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0" role="group" aria-label="Category">
              {["All", ...ALL_CATEGORIES].map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button key={cat} type="button" onClick={() => setSelectedCategory(cat)} className={`inline-flex shrink-0 items-center rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors duration-200 ${active ? "border-accent bg-accent text-black" : "border-border bg-card text-muted hover:border-accent/50 hover:text-accent"}`}>
                    {cat === "All" ? "All" : CATEGORY_LABELS[cat] || cat}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-sm text-muted">{resultText}</span>
              <span className="hidden h-4 w-px bg-border sm:block" aria-hidden="true" />
              <span className="flex flex-1 flex-wrap items-center gap-2 sm:justify-end sm:gap-3">
                <Select label="Brand" value={selectedBrand} onChange={setSelectedBrand} options={[{ value: "All", label: "All brands" }, ...ALL_BRANDS.map((b) => ({ value: b, label: b }))]} />
                <Select label="Sort by" value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} />
                <button type="button" onClick={() => setFiltersOpen((v) => !v)} aria-expanded={filtersOpen} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-accent/50 hover:text-accent">
                  <FilterIcon /> Filters
                </button>
              </span>
            </div>

            {filtersOpen && (
              <div className="mt-4 grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3 sm:p-5">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Price Range</p>
                  <div className="flex flex-wrap gap-2">
                    {["All", ...PRICE_RANGES.map((r) => r.label)].map((range) => (
                      <button key={range} type="button" onClick={() => setSelectedPriceRange(range)} className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${selectedPriceRange === range ? "border-accent bg-accent text-black" : "border-border bg-surface text-muted hover:border-accent/50"}`}>
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Rating</p>
                  <Select label="Minimum rating" value={minRating} onChange={setMinRating} options={RATING_OPTIONS} />
                </div>

                <label className="flex items-center gap-3 text-sm text-foreground">
                  <input type="checkbox" checked={saleOnly} onChange={(e) => setSaleOnly(e.target.checked)} className="h-5 w-5 rounded border-border bg-surface accent-[#a3e635]" />
                  <span>On sale only <span className="ml-1.5 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-bold text-accent">{allProducts.filter((p) => p.salePrice != null).length}</span></span>
                </label>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Colors</p>
                  <div className="flex flex-wrap gap-2">
                    {ALL_COLORS.map((c) => (
                      <button key={c.hex} type="button" onClick={() => toggleColor(c.hex)} title={c.name} className={`h-7 w-7 rounded-full border-2 transition-all ${selectedColors.includes(c.hex) ? "border-accent scale-110" : "border-border hover:border-accent/50"}`} style={{ backgroundColor: c.hex }} aria-label={c.name} />
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <button type="button" onClick={clearAll} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold text-muted transition-colors hover:border-accent/50 hover:text-accent">
                    <XIcon /> Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section aria-label="Product catalog">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
                <p className="text-lg font-bold text-foreground">No products found</p>
                <p className="mt-2 max-w-sm text-sm text-muted">Try adjusting your search or filters to find what you are looking for.</p>
                <button type="button" onClick={clearAll} className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover">
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
