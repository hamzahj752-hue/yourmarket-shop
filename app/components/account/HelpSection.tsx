"use client";

import { useMemo, useState } from "react";
import { helpArticles } from "@/app/data/account";
import {
  CreditCardIcon,
  LifeBuoyIcon,
  RotateIcon,
  SearchIcon,
  ShieldIcon,
  TruckIcon,
  UserIcon,
} from "./icons";
import { Panel, SectionHeader } from "./ui";

const helpCategories = [
  { id: "Orders & Delivery", icon: TruckIcon },
  { id: "Returns & Refunds", icon: RotateIcon },
  { id: "Payments", icon: CreditCardIcon },
  { id: "Account", icon: ShieldIcon },
];

export default function HelpSection() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return helpArticles.filter((article) => {
      if (activeCategory !== "All" && article.category !== activeCategory) {
        return false;
      }
      if (!trimmed) return true;
      return (
        article.title.toLowerCase().includes(trimmed) ||
        article.description.toLowerCase().includes(trimmed) ||
        article.category.toLowerCase().includes(trimmed)
      );
    });
  }, [query, activeCategory]);

  return (
    <section aria-labelledby="help-heading">
      <SectionHeader
        eyebrow="Help Center"
        title="How can we help?"
        description="Search articles or browse the topics below. Our support team is one message away."
      />

      <div className="relative mt-6">
        <label htmlFor="help-search" className="sr-only">
          Search help articles
        </label>
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted">
          <SearchIcon className="h-5 w-5" />
        </span>
        <input
          id="help-search"
          type="search"
          placeholder="Search help… e.g. return an item"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full border border-border bg-surface py-3 pl-12 pr-5 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
        {["All", ...helpCategories.map((category) => category.id)].map(
          (category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
                activeCategory === category
                  ? "border-accent/60 bg-accent/10 text-accent"
                  : "border-border bg-surface text-muted hover:text-foreground"
              }`}
            >
              {category === "All" ? "All topics" : category}
            </button>
          ),
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:gap-4 lg:grid-cols-2">
        {results.map((article) => (
          <Panel
            key={article.id}
            className="group flex cursor-pointer flex-col gap-2 p-5 transition-colors hover:border-accent/40"
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-accent">
                {article.category}
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground">
              {article.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted">
              {article.description}
            </p>
          </Panel>
        ))}
      </div>

      {results.length === 0 && (
        <Panel className="mt-4 flex flex-col items-center gap-3 px-6 py-14 text-center">
          <SearchIcon className="h-6 w-6 text-muted" />
          <div>
            <h3 className="text-base font-bold text-foreground">
              No results for “{query}”
            </h3>
            <p className="mt-1 text-sm text-muted">
              Try different keywords or contact support below.
            </p>
          </div>
        </Panel>
      )}

      <Panel className="mt-5 flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
            <LifeBuoyIcon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-foreground">Contact Support</h3>
            <p className="mt-0.5 text-sm text-muted">
              Our team replies within 24 hours, 7 days a week.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover"
        >
          <UserIcon className="h-4 w-4" />
          Start a chat
        </button>
      </Panel>
    </section>
  );
}