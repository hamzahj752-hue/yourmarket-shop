import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Terms & Conditions | YOURMARKET",
  description: "Terms and conditions for using the YOURMARKET online store.",
};

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    content: "By accessing or using the YOURMARKET website and services, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services.",
  },
  {
    title: "Account Registration",
    content: "You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
  },
  {
    title: "Products and Pricing",
    content: "All product descriptions, images and specifications are provided for general information purposes. We reserve the right to modify prices, descriptions and product availability without prior notice. Colors may vary slightly from what appears on your screen.",
  },
  {
    title: "Orders and Payment",
    content: "Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order. Payment must be received in full before order processing begins. All prices are displayed in US dollars unless otherwise noted.",
  },
  {
    title: "Shipping and Delivery",
    content: "Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers, customs processing or circumstances beyond our control. Risk of loss transfers to you upon delivery to the carrier.",
  },
  {
    title: "Returns and Refunds",
    content: "Returns are subject to our return policy. Items must meet eligibility criteria for return. Refunds are processed to the original payment method. Please refer to our Returns & Refunds page for full details.",
  },
  {
    title: "Intellectual Property",
    content: "All content on this website, including text, graphics, logos and software, is the property of YOURMARKET or its licensors and is protected by copyright and trademark laws. You may not reproduce, distribute or create derivative works without our written permission.",
  },
  {
    title: "Limitation of Liability",
    content: "YOURMARKET shall not be liable for any indirect, incidental, special or consequential damages arising from your use of our services. Our total liability shall not exceed the amount paid for the specific product or service in question.",
  },
  {
    title: "Governing Law",
    content: "These terms are governed by and construed in accordance with the laws of the applicable jurisdiction. Any disputes shall be resolved through binding arbitration or in courts of competent jurisdiction.",
  },
  {
    title: "Changes to Terms",
    content: "We reserve the right to modify these terms at any time. Changes take effect upon posting to the website. Your continued use of our services after changes constitutes acceptance of the revised terms.",
  },
];

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -left-40 -top-40 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Legal</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Terms & Conditions</h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              The rules and guidelines for using the YOURMARKET online store.
            </p>
            <p className="mt-3 text-xs text-muted">Last updated: September 2026</p>
          </div>
        </section>

        <section aria-label="Terms and conditions content">
          <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 sm:p-5 mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">Placeholder document</p>
              <p className="mt-1 text-sm text-muted">This is a demo terms & conditions document for YOURMARKET. It does not constitute legal advice and should be reviewed by legal counsel before publication. Final terms will be managed by YOURMARKET Admin.</p>
            </div>

            <div className="space-y-8">
              {SECTIONS.map((section) => (
                <div key={section.title}>
                  <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
