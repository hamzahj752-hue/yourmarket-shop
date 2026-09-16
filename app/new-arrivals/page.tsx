import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/catalog/ProductCard";
import { getNewArrivals } from "@/app/data/store";

export const metadata = {
  title: "New Arrivals | YOURMARKET",
  description: "Discover the latest additions to the YOURMARKET collection.",
};

export default function NewArrivalsPage() {
  const items = getNewArrivals();

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -left-40 -top-40 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-40 -right-40 h-64 w-64 rounded-full bg-accent/5 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Just dropped</p>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-4xl lg:text-5xl">New Arrivals</h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
              Fresh styles just landed. Be the first to wear the latest from YOURMARKET and our partner brands.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted sm:gap-x-5">
              <span><strong className="font-bold text-foreground">{items.length}</strong> new styles</span>
              <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
              <span>Updated weekly</span>
            </div>
          </div>
        </section>

        <section aria-label="New arrivals grid">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            {items.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                {items.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
                <p className="text-lg font-bold text-foreground">No new arrivals at the moment</p>
                <p className="mt-2 max-w-sm text-sm text-muted">Check back soon for the latest additions to our collection.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
