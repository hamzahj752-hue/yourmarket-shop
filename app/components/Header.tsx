"use client";

import { useState, type ButtonHTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/auth-context";
import { useShopCounts } from "@/app/context/shop-context";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Shoes", href: "/shoes" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Deals", href: "/deals" },
];

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconButton({
  label,
  children,
  className = "",
  ...rest
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors duration-200 hover:border-accent hover:text-accent ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function CartIcon({ count = 0 }: { count?: number }) {
  return (
    <span className="relative flex h-5 w-5 items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-black">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </span>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      ) : (
        <>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </>
      )}
    </svg>
  );
}

function SearchInput({ id }: { id: string }) {
  const router = useRouter();

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const query = (form.get("q") as string || "").trim();
        if (query) {
          router.push(`/search?query=${encodeURIComponent(query)}`);
        } else {
          router.push("/search");
        }
      }}
      className="relative"
    >
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <input
        id={id}
        name="q"
        type="search"
        placeholder="Search products…"
        className="w-full rounded-full border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
        <SearchIcon />
      </span>
    </form>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();
  const { cartCount, wishlistCount } = useShopCounts();
  const accountHref = user ? "/account" : "/login";
  const accountLabel = user ? "Account" : "Log in";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
        <IconButton
          label={menuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <MenuIcon open={menuOpen} />
        </IconButton>

        <Link
          href="/"
          className="shrink-0 whitespace-nowrap text-lg font-black tracking-widest text-foreground transition-colors hover:text-accent sm:text-xl"
        >
          YOUR<span className="text-accent">MARKET</span>
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-7 lg:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors duration-200 hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
          <div className="relative hidden min-w-0 max-w-xs flex-1 sm:block">
            <SearchInput id="desktop-search" />
          </div>

          <IconButton
            label={searchOpen ? "Close search" : "Open search"}
            className="sm:hidden"
            aria-expanded={searchOpen}
            aria-controls="mobile-search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <SearchIcon />
          </IconButton>

          <Link
            href="/wishlist"
            className="hidden sm:inline-flex"
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors duration-200 hover:border-accent hover:text-accent">
              <HeartIcon />
              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-black">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </span>
          </Link>

          <Link
            href="/cart"
            aria-label={`Shopping cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
          >
            <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors duration-200 hover:border-accent hover:text-accent">
              <CartIcon count={cartCount} />
            </span>
          </Link>

          <Link href={accountHref} className="hidden sm:inline-flex" aria-label={accountLabel}>
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors duration-200 hover:border-accent hover:text-accent">
              <UserIcon />
            </span>
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div
          id="mobile-search"
          className="border-t border-border bg-background px-4 py-3 sm:hidden"
        >
          <SearchInput id="mobile-search-input" />
        </div>
      )}

      <div
        id="mobile-menu"
        className={`${
          menuOpen ? "block" : "hidden"
        } border-t border-border bg-background lg:hidden`}
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-card hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-3 flex gap-3 border-t border-border pt-4 sm:hidden">
            <Link
              href="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <HeartIcon />
              Wishlist{` (${wishlistCount})`}
            </Link>
            <Link
              href={accountHref}
              onClick={() => setMenuOpen(false)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <UserIcon />
              {accountLabel}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
