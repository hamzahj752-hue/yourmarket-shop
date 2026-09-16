import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "About | YOURMARKET",
  description: "Learn more about YOURMARKET and our mission.",
};

const VALUES = [
  {
    title: "Quality First",
    description: "Every product in our collection is selected for craftsmanship, materials and lasting value.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Curated Selection",
    description: "We partner with brands that share our commitment to design, comfort and self-expression.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    ),
  },
  {
    title: "Customer Experience",
    description: "From browsing to unboxing, we design every touchpoint to feel effortless and considered.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    title: "Transparent Practices",
    description: "Honest descriptions, clear pricing and policies that put the customer first.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -left-40 -top-40 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-40 -right-40 h-64 w-64 rounded-full bg-accent/5 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">About us</p>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-4xl lg:text-5xl">The story behind YOURMARKET</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
              YOURMARKET is a fashion destination for people who care about how they show up. We curate a focused collection of apparel, shoes and accessories from brands that prioritize quality, comfort and timeless design.
            </p>
          </div>
        </section>

        <section aria-label="Mission">
          <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-16">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">Our mission</p>
                <h2 className="mt-3 text-xl font-black tracking-tight sm:text-3xl">
                  Style should be accessible, honest and personal.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  We believe getting dressed should be the easiest part of your day. That is why we focus on versatile pieces that work across occasions, built from quality materials and designed to last beyond a single season.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  YOURMARKET started as a simple idea: bring together the best of contemporary fashion under one roof, with a shopping experience that feels as considered as the products themselves.
                </p>
              </div>

              <div className="relative">
                <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
                  <div className="relative space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent/10 text-2xl font-black text-accent">Y</span>
                      <div>
                        <p className="text-lg font-black tracking-widest text-foreground">YOUR<span className="text-accent">MARKET</span></p>
                        <p className="text-xs text-muted">Premium fashion, simplified</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="rounded-xl border border-border bg-surface p-3 text-center sm:p-4">
                        <p className="text-2xl font-black text-accent">50+</p>
                        <p className="mt-1 text-xs text-muted">Products</p>
                      </div>
                      <div className="rounded-xl border border-border bg-surface p-3 text-center sm:p-4">
                        <p className="text-2xl font-black text-accent">20+</p>
                        <p className="mt-1 text-xs text-muted">Brands</p>
                      </div>
                      <div className="rounded-xl border border-border bg-surface p-3 text-center sm:p-4">
                        <p className="text-2xl font-black text-accent">4</p>
                        <p className="mt-1 text-xs text-muted">Categories</p>
                      </div>
                      <div className="rounded-xl border border-border bg-surface p-3 text-center sm:p-4">
                        <p className="text-2xl font-black text-accent">5</p>
                        <p className="mt-1 text-xs text-muted">Shoe Brands</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted">Demo values — these will be replaced by live data from YOURMARKET Admin.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border" aria-label="Values">
          <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">What we stand for</p>
            <h2 className="mt-3 text-xl font-black tracking-tight sm:text-3xl">Our values</h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {VALUES.map((value) => (
                <div key={value.title} className="group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_8px_40px_rgba(163,230,53,0.12)]">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-black">
                    {value.icon}
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border" aria-label="Call to action">
          <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-16">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 text-center sm:p-12">
              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <h2 className="text-xl font-black tracking-tight sm:text-3xl">Ready to explore?</h2>
                <p className="mt-3 max-w-md mx-auto text-sm text-muted">Browse the full collection and find pieces that feel like you.</p>
                <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Link href="/shop" className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover">
                    Shop All
                  </Link>
                  <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-bold uppercase tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
