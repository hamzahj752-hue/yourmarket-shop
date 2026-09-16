import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/catalog/ProductCard";
import { getDealProducts } from "@/app/data/store";

export const metadata = {
  title: "Deals | YOURMARKET",
  description: "Save on selected styles. Great products at great prices.",
};

export default function DealsPage() {
  const items = getDealProducts();

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -left-40 -top-40 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-40 -right-40 h-64 w-64 rounded-full bg-accent/5 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Limited time</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Deals & Offers</h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              Selected styles at reduced prices. Quality you expect, value you will appreciate.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
              <span><strong className="font-bold text-foreground">{items.length}</strong> products on sale</span>
              <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
              <span>While stocks last</span>
            </div>
          </div>
        </section>

        <section className="border-b border-border" aria-label="Promotional banner">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-accent/5 p-6 sm:p-8">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">Demo banner</p>
                  <p className="mt-2 text-xl font-black text-foreground sm:text-2xl">Up to 30% off selected styles</p>
                  <p className="mt-1 text-sm text-muted">This is a demo promotional area. Content will be managed by YOURMARKET Admin.</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-muted">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
                  Demo UI only
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Sale products">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            {items.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                {items.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
                <p className="text-lg font-bold text-foreground">No deals available right now</p>
                <p className="mt-2 max-w-sm text-sm text-muted">Check back soon for new offers and promotions.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
