import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Returns & Refunds | YOURMARKET",
  description: "Return policy and refund information for YOURMARKET orders.",
};

const SECTIONS = [
  {
    title: "Return Eligibility",
    content: "You may return most unworn, unwashed items within 30 days of delivery. Items must be in their original condition with all tags attached. Final sale items, intimate apparel and personalized products cannot be returned unless defective.",
  },
  {
    title: "How to Start a Return",
    content: "Log in to your YOURMARKET account, go to Orders, select the order containing the item you want to return and click 'Return items'. Follow the prompts to select items and print your prepaid return label.",
  },
  {
    title: "Return Shipping",
    content: "We provide free return shipping for domestic orders. Pack the item securely using the original packaging if possible and drop off at the designated carrier location. International returns may incur shipping fees.",
  },
  {
    title: "Refunds",
    content: "Once we receive and inspect your return, a refund will be issued to your original payment method within 5-7 business days. You will receive an email confirmation when the refund is processed.",
  },
  {
    title: "Exchanges",
    content: "If you need a different size or color, you can select 'Exchange' during the return process. Exchanges are subject to stock availability. If the desired item is unavailable, a full refund will be issued.",
  },
  {
    title: "Damaged or Wrong Items",
    content: "If you receive a damaged, defective or incorrect item, contact our support team within 7 days of delivery with your order number and photos of the issue. We will arrange a free return and send the correct item or issue a full refund.",
  },
];

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -left-40 -top-40 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Returns</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Returns & Refunds</h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              Easy returns and hassle-free refunds. Here is how it works.
            </p>
          </div>
        </section>

        <section aria-label="Returns information">
          <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 sm:p-5 mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">Placeholder content</p>
              <p className="mt-1 text-sm text-muted">This page contains demo return policies. Final return and refund information will be managed by YOURMARKET Admin.</p>
            </div>

            <div className="space-y-8">
              {SECTIONS.map((section) => (
                <div key={section.title}>
                  <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{section.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 border-t border-border pt-8">
              <h2 className="text-lg font-bold text-foreground">Need to return an item?</h2>
              <p className="mt-2 text-sm text-muted">Start your return from your account dashboard or get in touch with our support team.</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link href="/account" className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover">
                  Go to My Orders
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-bold uppercase tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
