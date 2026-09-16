"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const FAQ_CATEGORIES = [
  {
    id: "orders",
    label: "Orders",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="M16.5 9.4-9-5.19" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="m3.27 6.96 8.73 5.04 8.73-5.04" /><path d="M12 22.08V12" />
      </svg>
    ),
    items: [
      { q: "How do I place an order?", a: "Browse our collection, add items to your cart and proceed to checkout. You can pay with major credit cards, PayPal or digital wallets." },
      { q: "Can I modify my order after placing it?", a: "Orders can be modified within 1 hour of placement. After that, our team begins processing. Contact support for urgent changes." },
      { q: "How do I track my order?", a: "Go to Account > Orders to view real-time tracking for any shipped order. You will also receive email updates at each stage." },
      { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, PayPal, Apple Pay and Google Pay. Cash on delivery is available in select regions." },
    ],
  },
  {
    id: "delivery",
    label: "Delivery",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" /><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
      </svg>
    ),
    items: [
      { q: "How long does delivery take?", a: "Standard delivery takes 3-5 business days. Express shipping delivers within 1-2 business days. International delivery may take 7-14 business days." },
      { q: "Is shipping free?", a: "Standard shipping is free on all orders over $50. Express shipping rates are calculated at checkout based on your location." },
      { q: "Do you ship internationally?", a: "Yes, we ship to most countries worldwide. International shipping costs and delivery times are calculated at checkout." },
      { q: "My package is delayed. What should I do?", a: "Check your tracking number in Account > Orders for updates. If your order is more than 5 business days late, contact our support team." },
    ],
  },
  {
    id: "returns",
    label: "Returns",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
      </svg>
    ),
    items: [
      { q: "What is your return policy?", a: "You can return unworn items within 30 days of delivery for a full refund. Items must be in original packaging with tags attached." },
      { q: "How do I start a return?", a: "Go to Account > Orders, select the order and click 'Return items'. You will receive a prepaid return label via email." },
      { q: "When will I receive my refund?", a: "Refunds are processed within 5-7 business days after we receive your return. The amount is credited to your original payment method." },
      { q: "Can I exchange an item instead of returning it?", a: "Yes, during the return process you can select 'Exchange' and choose a different size or color. Exchanges are subject to availability." },
    ],
  },
  {
    id: "payments",
    label: "Payments",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" />
      </svg>
    ),
    items: [
      { q: "Is my payment information secure?", a: "Yes. All transactions are encrypted using SSL technology. We never store your full card details on our servers." },
      { q: "Why was my payment declined?", a: "Common reasons include insufficient funds, incorrect card details, or your bank blocking the transaction. Try again or use a different payment method." },
      { q: "Do you offer installment payments?", a: "Installment options may be available at checkout depending on your region and payment provider. Look for 'Pay in installments' during checkout." },
    ],
  },
  {
    id: "account",
    label: "Account",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
    items: [
      { q: "How do I create an account?", a: "Click 'Sign Up' on the login page or follow the 'Create Account' link. You only need an email and password to get started." },
      { q: "How do I change my password?", a: "Go to Account > Profile and click 'Change Password'. You will need to verify your current password first." },
      { q: "How do I update my email address?", a: "Go to Account > Profile, edit your email and save. We will send a verification link to your new address." },
    ],
  },
  {
    id: "products",
    label: "Products",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
      </svg>
    ),
    items: [
      { q: "How do I find my size?", a: "Each product page includes a size guide. Measure yourself and compare with our charts for the best fit." },
      { q: "Are the colors accurate to what I see on screen?", a: "We strive for accuracy but colors may vary slightly depending on your screen settings. Our product photography is color-calibrated." },
      { q: "How do I care for my purchase?", a: "Care instructions are included on the product label and detail page. Generally, we recommend following the specific garment care guidelines provided." },
    ],
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
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

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) =>
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const categories = useMemo(() => {
    if (!activeCategory) return FAQ_CATEGORIES;
    return FAQ_CATEGORIES.filter((c) => c.id === activeCategory);
  }, [activeCategory]);

  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    const q = search.toLowerCase();
    return categories.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)),
    })).filter((cat) => cat.items.length > 0);
  }, [categories, search]);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -left-40 -top-40 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Help Center</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">How can we help?</h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              Find answers to frequently asked questions or browse by category.
            </p>

            <div className="relative mt-6 max-w-md">
              <label htmlFor="help-search" className="sr-only">Search help articles</label>
              <input id="help-search" type="search" placeholder="Search for answers..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-full border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted"><SearchIcon /></span>
            </div>
          </div>
        </section>

        <section aria-label="Help categories">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-4 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0" role="group" aria-label="FAQ categories">
              <button type="button" onClick={() => setActiveCategory(null)} className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${activeCategory === null ? "border-accent bg-accent text-black" : "border-border bg-card text-muted hover:border-accent/50 hover:text-accent"}`}>
                All Topics
              </button>
              {FAQ_CATEGORIES.map((cat) => {
                const active = activeCategory === cat.id;
                return (
                  <button key={cat.id} type="button" onClick={() => setActiveCategory(active ? null : cat.id)} className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${active ? "border-accent bg-accent text-black" : "border-border bg-card text-muted hover:border-accent/50 hover:text-accent"}`}>
                    {cat.icon} {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 space-y-8">
              {filteredCategories.map((cat) => (
                <div key={cat.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">{cat.icon}</span>
                    <h2 className="text-lg font-bold text-foreground">{cat.label}</h2>
                  </div>
                  <div className="space-y-2">
                    {cat.items.map((item, i) => {
                      const id = `${cat.id}-${i}`;
                      const isOpen = openItems.has(id);
                      return (
                        <div key={id} className="rounded-2xl border border-border bg-card transition-colors hover:border-accent/30">
                          <button type="button" onClick={() => toggleItem(id)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5">
                            <span className="text-sm font-semibold text-foreground sm:text-base">{item.q}</span>
                            <ChevronIcon open={isOpen} />
                          </button>
                          {isOpen && (
                            <div className="border-t border-border px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
                              <p className="text-sm leading-relaxed text-muted">{item.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {filteredCategories.length === 0 || filteredCategories.every((c) => c.items.length === 0) ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
                  <p className="text-lg font-bold text-foreground">No results found</p>
                  <p className="mt-2 max-w-sm text-sm text-muted">Try a different search term or browse all categories.</p>
                  <button type="button" onClick={() => { setSearch(""); setActiveCategory(null); }} className="mt-4 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover">
                    Clear Search
                  </button>
                </div>
              ) : null}
            </div>

            <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
              <p className="text-lg font-bold text-foreground">Still need help?</p>
              <p className="mt-2 text-sm text-muted">Our support team is here for you. Reach out anytime.</p>
              <Link href="/contact" className="mt-4 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover">
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
