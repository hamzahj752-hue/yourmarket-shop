import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Privacy Policy | YOURMARKET",
  description: "Privacy policy for the YOURMARKET online store.",
};

const SECTIONS = [
  {
    title: "Information We Collect",
    content: "We collect information you provide directly, such as your name, email address, shipping address and payment information when you create an account, place an order or contact support. We also collect usage data such as browsing history, device information and IP address.",
  },
  {
    title: "How We Use Your Information",
    content: "We use your information to process orders, deliver products, provide customer support, send order updates and marketing communications (with your consent), improve our website and services, and comply with legal obligations.",
  },
  {
    title: "Information Sharing",
    content: "We do not sell your personal information. We share your data with trusted service providers who assist in operating our store, processing payments, fulfilling orders and delivering packages. These providers are contractually obligated to protect your information.",
  },
  {
    title: "Data Security",
    content: "We implement industry-standard security measures including SSL encryption, secure payment processing and access controls. While we strive to protect your data, no method of transmission over the Internet is 100% secure.",
  },
  {
    title: "Cookies",
    content: "Our website uses cookies to enhance your browsing experience, remember your preferences and analyze site traffic. You can control cookie settings through your browser preferences.",
  },
  {
    title: "Your Rights",
    content: "You have the right to access, correct or delete your personal data. You can manage most of your information through your account settings. For additional requests, contact our support team.",
  },
  {
    title: "Changes to This Policy",
    content: "We may update this privacy policy from time to time. Material changes will be communicated via email or a notice on our website. Continued use of our services after changes constitutes acceptance of the updated policy.",
  },
  {
    title: "Contact Us",
    content: "If you have questions about this privacy policy or our data practices, please contact us at privacy@yourmarket.com or through our contact page.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -left-40 -top-40 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Legal</p>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-4xl lg:text-5xl">Privacy Policy</h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
              How we collect, use and protect your personal information.
            </p>
            <p className="mt-3 text-xs text-muted">Last updated: September 2026</p>
          </div>
        </section>

        <section aria-label="Privacy policy content">
          <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 sm:p-5 mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">Placeholder document</p>
              <p className="mt-1 text-sm text-muted">This is a demo privacy policy for YOURMARKET. It does not constitute legal advice and should be reviewed by legal counsel before publication. Final policy content will be managed by YOURMARKET Admin.</p>
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
