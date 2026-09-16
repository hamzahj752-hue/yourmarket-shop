"use client";

import { useState } from "react";
import { SHOE_BRANDS } from "../../lib/shoes";

const ALL_BRANDS_ID = "brands-all";

export default function ShopByBrand() {
  const [activeId, setActiveId] = useState(ALL_BRANDS_ID);

  const activeName =
    activeId === ALL_BRANDS_ID
      ? "all"
      : SHOE_BRANDS.find((brand) => brand.id === activeId)?.name ?? "all";

  return (
    <section id="brands" className="border-b border-border bg-surface/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-lime-300">
              Find your label
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">
              Shop By Brand
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Text-based brand tags for now. Logos and the full catalog arrive
            with the YOURMARKET admin.
          </p>
        </div>

        <div
          role="group"
          aria-label="Select a shoe brand"
          className="-mx-4 mt-8 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
        >
          <button
            type="button"
            aria-pressed={activeId === ALL_BRANDS_ID}
            onClick={() => setActiveId(ALL_BRANDS_ID)}
            className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 sm:px-5 sm:py-3 ${
              activeId === ALL_BRANDS_ID
                ? "border-lime-300/60 bg-lime-300/10 text-lime-300 shadow-[0_0_24px_rgba(163,230,53,0.2)]"
                : "border-border bg-card text-muted hover:border-lime-300/40 hover:text-foreground"
            }`}
          >
            All
          </button>
          {SHOE_BRANDS.map((brand) => (
            <button
              key={brand.id}
              type="button"
              aria-pressed={activeId === brand.id}
              onClick={() => setActiveId(brand.id)}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 sm:px-5 sm:py-3 ${
                activeId === brand.id
                  ? "border-lime-300/60 bg-lime-300/10 text-lime-300 shadow-[0_0_24px_rgba(163,230,53,0.2)]"
                  : "border-border bg-card text-muted hover:border-lime-300/40 hover:text-foreground"
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          {activeId === ALL_BRANDS_ID
            ? "Showing the full lineup, every brand, every drop."
            : `Exploring ${activeName} this season.`}
        </p>
      </div>
    </section>
  );
}