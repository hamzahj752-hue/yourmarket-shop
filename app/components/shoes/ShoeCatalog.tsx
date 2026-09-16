"use client";

import { useMemo, useState } from "react";
import {
  SHOE_FILTERS,
  SHOE_PRODUCTS,
  SORT_OPTIONS,
} from "../../lib/shoes";
import type { SortId } from "../../lib/shoes";
import ShoeCard from "./ShoeCard";

function SortIcon() {
  return (
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function FilterIcon() {
  return (
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
  );
}

export default function ShoeCatalog() {
  const [sortId, setSortId] = useState<SortId>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const products = useMemo(() => {
    const list = [...SHOE_PRODUCTS];
    switch (sortId) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort(
          (a, b) => Number(b.isNew ?? false) - Number(a.isNew ?? false),
        );
        break;
      case "featured":
      default:
        break;
    }
    return list;
  }, [sortId]);

  return (
    <section id="catalog" className="border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">
              The collection
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">
              Shoe Catalog
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Premium picks across every brand. Tap any pair to open its product
            page.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 sm:px-5">
          <p className="text-sm text-muted">
            <span className="font-bold text-foreground">{products.length}</span>{" "}
            styles
            {sortId !== "featured" && (
              <span className="hidden sm:inline">
                {" "}
                sorted by{" "}
                {SORT_OPTIONS.find((option) => option.id === sortId)?.label}
              </span>
            )}
          </p>

          <div className="flex items-center gap-2">
            <label className="relative block">
              <span className="sr-only">Sort products</span>
              <select
                value={sortId}
                onChange={(event) => setSortId(event.target.value as SortId)}
                className="appearance-none rounded-full border border-border bg-surface py-2 pl-4 pr-10 text-sm font-medium text-foreground transition-colors hover:border-lime-300/40 focus:border-lime-300 focus:outline-none sm:py-2.5"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted">
                <SortIcon />
              </span>
            </label>

            <button
              type="button"
              onClick={() => setFiltersOpen((value) => !value)}
              aria-expanded={filtersOpen}
              aria-controls="shoe-filters"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                filtersOpen
                  ? "border-lime-300/60 bg-lime-300/10 text-lime-300"
                  : "border-border bg-surface text-foreground hover:border-lime-300/50 hover:text-lime-300"
              }`}
            >
              <FilterIcon />
              Filters
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  filtersOpen ? "bg-lime-300 text-black" : "bg-card text-muted"
                }`}
              >
                {SHOE_FILTERS.length}
              </span>
            </button>
          </div>
        </div>

        {filtersOpen && (
          <div
            id="shoe-filters"
            className="mt-4 rounded-3xl border border-border bg-card p-5 sm:p-6"
          >
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-5">
              {SHOE_FILTERS.map((filter) => (
                <fieldset key={filter.id}>
                  <legend className="text-xs font-bold uppercase tracking-widest text-muted">
                    {filter.label}
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {filter.options.map((option) => (
                      <span
                        key={option}
                        className="cursor-default rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted/70">{filter.hint}</p>
                </fieldset>
              ))}
            </div>
            <p className="mt-6 border-t border-border pt-4 text-xs text-muted/70">
              Live filtering arrives with the YOURMARKET admin. Sorting works
              right now.
            </p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ShoeCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}