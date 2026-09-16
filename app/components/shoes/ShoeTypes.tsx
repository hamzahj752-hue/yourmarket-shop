"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { SHOE_CATEGORIES, SHOE_PRODUCTS } from "../../lib/shoes";

const ALL_TYPES_ID = "types-all";

function SneakerGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M3 15.5h11.5a4.5 4.5 0 0 0 4.5-4.5v-.6a1.4 1.4 0 0 0-1.4-1.4h-4.6L10.6 6a1.2 1.2 0 0 0-1-.6H5.4a1.2 1.2 0 0 0-1.2 1.3L3 15.5Z" />
      <path d="M3 18h16.5" />
      <path d="M6.5 9.5 9.5 12" />
      <path d="M9.5 10.5 12 12.5" />
    </svg>
  );
}

export default function ShoeTypes() {
  const [activeId, setActiveId] = useState(ALL_TYPES_ID);

  const countFor = (categoryId: string) =>
    SHOE_PRODUCTS.filter((product) => product.categoryId === categoryId).length;

  return (
    <section id="types" className="border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
              Pick your lane
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Shoe Types
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Snapshot of the day. These categories will follow the catalog
            managed by YOURMARKET admin.
          </p>
        </div>

        <div
          role="group"
          aria-label="Select a shoe type"
          className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6"
        >
          <button
            type="button"
            aria-pressed={activeId === ALL_TYPES_ID}
            onClick={() => setActiveId(ALL_TYPES_ID)}
            className={`group flex flex-col items-start gap-4 rounded-3xl border p-5 text-left transition-all duration-200 ${
              activeId === ALL_TYPES_ID
                ? "border-lime-300/60 bg-lime-300/10 shadow-[0_0_28px_rgba(163,230,53,0.15)]"
                : "border-border bg-card hover:-translate-y-0.5 hover:border-lime-300/40"
            }`}
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors ${
                activeId === ALL_TYPES_ID
                  ? "border-lime-300/40 bg-lime-300/15 text-lime-300"
                  : "border-border bg-surface text-muted group-hover:text-lime-300"
              }`}
            >
              <SneakerGlyph />
            </span>
            <span>
              <span className="block text-base font-bold text-foreground">
                All Styles
              </span>
              <span className="mt-0.5 block text-sm text-muted">
                The complete lineup.
              </span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted">
              {SHOE_PRODUCTS.length} styles
            </span>
          </button>

          {SHOE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              aria-pressed={activeId === category.id}
              onClick={() => setActiveId(category.id)}
              className={`group flex flex-col items-start gap-4 rounded-3xl border p-5 text-left transition-all duration-200 ${
                activeId === category.id
                  ? "border-[color:var(--cat-accent)] bg-card shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9),0_0_30px_var(--cat-accent)]"
                  : "border-border bg-card hover:-translate-y-0.5 hover:bg-card-hover"
              }`}
              style={
                activeId === category.id
                  ? ({ "--cat-accent": category.accent } as CSSProperties)
                  : undefined
              }
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors ${
                  activeId === category.id
                    ? "border-transparent"
                    : "border-border bg-surface text-muted group-hover:text-foreground"
                }`}
                style={{
                  ...(activeId === category.id
                    ? { borderColor: `${category.accent}4d` }
                    : {}),
                  color: activeId === category.id ? category.accent : undefined,
                  backgroundColor: activeId === category.id ? `${category.accent}1f` : undefined,
                }}
              >
                <SneakerGlyph />
              </span>
              <span>
                <span className="block text-base font-bold text-foreground">
                  {category.name}
                </span>
                <span className="mt-0.5 block text-sm text-muted">
                  {category.description}
                </span>
              </span>
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{
                  color: activeId === category.id ? category.accent : undefined,
                }}
              >
                {countFor(category.id)} styles
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}