const BENEFITS = [
  {
    title: "Premium Quality",
    description: "Garments made to look sharp and last.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Easy Returns",
    description: "30-day hassle-free swaps and refunds.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M7 17H6a2 2 0 0 1-1.73-3A2 2 0 0 1 6 9h1" />
        <path d="M17 7h1a2 2 0 0 1 1.73 3A2 2 0 0 1 18 13h-1" />
        <path d="M3 12h.01" />
        <path d="M13 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: "Free Shipping",
    description: "Free worldwide delivery on every order.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
        <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
        <circle cx="7" cy="18" r="2" />
        <path d="M15 18H9" />
        <circle cx="17" cy="18" r="2" />
        <path d="M7 9h7" />
      </svg>
    ),
  },
  {
    title: "Secure Checkout",
    description: "Encrypted payments you can trust.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

export default function Benefits() {
  return (
    <section className="border-b border-border" aria-label="Store benefits">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-10 sm:grid-cols-2 sm:gap-5 sm:px-6 sm:py-12 lg:grid-cols-4 lg:gap-6 lg:px-8">
        {BENEFITS.map((benefit) => (
          <div
            key={benefit.title}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 transition-colors duration-300 hover:border-accent/40 hover:bg-card-hover sm:p-5"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
              {benefit.icon}
            </span>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-1 text-sm leading-snug text-muted">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}