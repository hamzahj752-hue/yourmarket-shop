"use client";

import { useMemo, useState } from "react";
import type { Category } from "@/app/data/categories";
import type { Product } from "@/app/data/products";
import ProductCard from "./ProductCard";
import ProductVisual from "./ProductVisual";

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none h-4 w-4"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <span className="relative inline-flex shrink-0">
      <label htmlFor={label} className="sr-only">
        {label}
      </label>
      <select
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-full border border-border bg-card py-2.5 pl-4 pr-9 text-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted">
        <ChevronDownIcon />
      </span>
    </span>
  );
}

const SORT_OPTIONS = [
  { value: "featured", label: "Sort: Featured" },
  { value: "price-asc", label: "Sort: Price Low to High" },
  { value: "price-desc", label: "Sort: Price High to Low" },
  { value: "rating", label: "Sort: Top Rated" },
];

const RATING_OPTIONS = [
  { value: "0", label: "Min rating: Any" },
  { value: "4", label: "Min rating: 4.0+" },
  { value: "4.5", label: "Min rating: 4.5+" },
];

export default function CategoryView({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  const [selectedType, setSelectedType] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [saleOnly, setSaleOnly] = useState(false);
  const [minRating, setMinRating] = useState("0");

  const filtered = useMemo(() => {
    const list = products.filter(
      (product) =>
        (selectedType === "All" || product.type === selectedType) &&
        (selectedBrand === "All" || product.brand === selectedBrand) &&
        (!saleOnly || product.salePrice != null) &&
        product.rating >= Number(minRating)
    );

    switch (sortBy) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "rating":
        return [...list].sort((a, b) => b.rating - a.rating);
      default:
        return list;
    }
  }, [products, selectedType, selectedBrand, sortBy, saleOnly, minRating]);

  const resultText =
    filtered.length === products.length
      ? `${products.length} products`
      : `Showing ${filtered.length} of ${products.length}`;

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute -left-40 -top-40 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-40 -right-40 h-64 w-64 rounded-full bg-accent/5 blur-3xl sm:h-96 sm:w-96"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              {category.eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              {category.name}
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              {category.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
              <span>
                <strong className="font-bold text-foreground">
                  {products.length}
                </strong>{" "}
                styles
              </span>
              <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
              <span>
                <strong className="font-bold text-foreground">
                  {category.types.length}
                </strong>{" "}
                types
              </span>
              <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
              <span>
                <strong className="font-bold text-foreground">
                  {category.brands.length}
                </strong>{" "}
                brands
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto max-w-sm overflow-hidden rounded-3xl border border-border bg-card p-5 sm:p-8">
              <div
                className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-accent/10 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface">
                <ProductVisual category={category.slug} color="#a3e635" />
              </div>
              <p className="mt-5 text-center text-sm font-semibold text-muted">
                {category.name.toLowerCase()} collection
              </p>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted">
              <span className="h-px w-10 bg-border" aria-hidden="true" />
              <span>Free shipping on every order</span>
              <span className="h-px w-10 bg-border" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border" aria-label="Catalog filters">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div
            className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0"
            role="group"
            aria-label="Product type"
          >
            {["All", ...category.types].map((type) => {
              const active = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? "border-accent bg-accent text-black"
                      : "border-border bg-card text-muted hover:border-accent/50 hover:text-accent"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-sm text-muted">
              {resultText}
            </span>

            <span className="hidden h-4 w-px bg-border sm:block" aria-hidden="true" />

            <span className="flex flex-1 flex-wrap items-center gap-2 sm:justify-end sm:gap-3">
              <Select
                label="Brand"
                value={selectedBrand}
                onChange={setSelectedBrand}
                options={[
                  { value: "All", label: "All brands" },
                  ...category.brands.map((brand) => ({
                    value: brand,
                    label: brand,
                  })),
                ]}
              />

              <Select
                label="Sort by"
                value={sortBy}
                onChange={setSortBy}
                options={SORT_OPTIONS}
              />

              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                aria-expanded={filtersOpen}
                aria-controls="filter-panel"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-accent/50 hover:text-accent"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M3 6h18" />
                  <path d="M7 12h10" />
                  <path d="M10 18h4" />
                </svg>
                Filters
              </button>
            </span>
          </div>

          {filtersOpen && (
            <div
              id="filter-panel"
              className="mt-4 grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2 sm:gap-6 sm:p-5"
            >
              <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={saleOnly}
                  onChange={(e) => setSaleOnly(e.target.checked)}
                  className="h-5 w-5 rounded border-border bg-surface accent-[#a3e635]"
                />
                <span>
                  On sale only
                  <span className="ml-1.5 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-bold text-accent">
                    {products.filter((p) => p.salePrice != null).length}
                  </span>
                </span>
              </label>

              <Select
                label="Minimum rating"
                value={minRating}
                onChange={setMinRating}
                options={RATING_OPTIONS}
              />
            </div>
          )}
        </div>
      </section>

      <section aria-label="Product catalog">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
              <p className="text-lg font-bold text-foreground">
                No products match your filters
              </p>
              <p className="mt-2 max-w-sm text-sm text-muted">
                Try changing the type, brand or clearing the filters to see more
                of the {category.name} range.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedType("All");
                  setSelectedBrand("All");
                  setSortBy("featured");
                  setSaleOnly(false);
                  setMinRating("0");
                }}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}