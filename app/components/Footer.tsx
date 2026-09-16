import Link from "next/link";

const SHOP_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Deals", href: "/deals" },
  { label: "Shoes", href: "/shoes" },
];

const CATEGORY_LINKS = [
  { label: "T-Shirts", href: "/category/t-shirts" },
  { label: "Pants", href: "/category/pants" },
  { label: "Shirts & Jackets", href: "/category/shirts-jackets" },
  { label: "Sunglasses", href: "/category/sunglasses" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Help Center", href: "/help" },
];

const POLICY_LINKS = [
  { label: "Shipping", href: "/shipping" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="max-w-xs">
            <Link href="/" className="text-xl font-black tracking-widest">
              YOUR<span className="text-accent">MARKET</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Premium fashion for people who care about how they show up. Built for the bold, the minimal and everyone in between.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a href="#" aria-label="Instagram" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" aria-label="TikTok" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Shop</h3>
            <nav className="mt-4 flex flex-col gap-2.5" aria-label="Shop links">
              {SHOP_LINKS.map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-muted transition-colors hover:text-accent">{link.label}</Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Categories</h3>
            <nav className="mt-4 flex flex-col gap-2.5" aria-label="Category links">
              {CATEGORY_LINKS.map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-muted transition-colors hover:text-accent">{link.label}</Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Company</h3>
            <nav className="mt-4 flex flex-col gap-2.5" aria-label="Company links">
              {COMPANY_LINKS.map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-muted transition-colors hover:text-accent">{link.label}</Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {POLICY_LINKS.map((link) => (
                <Link key={link.label} href={link.href} className="text-xs text-muted transition-colors hover:text-accent">{link.label}</Link>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted">&copy; {new Date().getFullYear()} YOURMARKET. All rights reserved.</p>
            <p className="text-xs text-muted">Designed with pride. Built for style.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
