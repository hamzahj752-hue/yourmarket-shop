import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Shipping & Delivery | YOURMARKET",
  description: "Shipping information and delivery policies for YOURMARKET orders.",
};

const SECTIONS = [
  {
    title: "Standard Shipping",
    content: "Standard shipping is available for all orders. Delivery typically takes 3-5 business days within the continental United States. Orders placed before 2:00 PM EST on business days are typically processed the same day.",
  },
  {
    title: "Express Shipping",
    content: "Express shipping delivers within 1-2 business days. Express orders placed before 12:00 PM EST ship the same business day, subject to stock availability.",
  },
  {
    title: "International Shipping",
    content: "We ship to most countries worldwide. International delivery times range from 7-14 business days depending on destination. Customs duties and import taxes may apply and are the responsibility of the recipient.",
  },
  {
    title: "Free Shipping",
    content: "Standard shipping is free on orders over $50. Express shipping rates are calculated at checkout based on your delivery address and order weight.",
  },
  {
    title: "Order Tracking",
    content: "Once your order ships, you will receive an email with a tracking number. You can also track your order in real time from your Account dashboard under Orders.",
  },
  {
    title: "Shipping Partners",
    content: "We work with trusted shipping partners to ensure reliable delivery. Our primary carriers include FedEx, UPS and DHL for international shipments.",
  },
];

export default function ShippingPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -left-40 -top-40 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Shipping</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Shipping & Delivery</h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              Everything you need to know about how your order gets to you.
            </p>
          </div>
        </section>

        <section aria-label="Shipping information">
          <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 sm:p-5 mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">Placeholder content</p>
              <p className="mt-1 text-sm text-muted">This page contains demo shipping policies. Final shipping information will be managed by YOURMARKET Admin.</p>
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
              <h2 className="text-lg font-bold text-foreground">Need help with shipping?</h2>
              <p className="mt-2 text-sm text-muted">If you have questions about a specific order or delivery, our support team is ready to assist.</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover">
                  Contact Support
                </Link>
                <Link href="/help" className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-bold uppercase tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent">
                  Visit Help Center
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
