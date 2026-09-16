import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-64 w-64 rounded-full bg-accent/5 blur-3xl sm:h-96 sm:w-96"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:gap-12 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-8 lg:px-8 lg:py-24">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            New Season Collection
          </p>

          <h1 className="mt-6 text-2xl font-black leading-[1.1] tracking-tight sm:text-5xl sm:leading-[1.05] lg:text-6xl xl:text-7xl">
            Style That
            <br />
            Speaks For{" "}
            <span className="text-accent drop-shadow-[0_0_18px_rgba(163,230,53,0.35)]">
              Itself
            </span>
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted sm:text-base sm:mt-6 sm:text-lg">
            Curated menswear, footwear and essentials for those who take pride
            in how they show up. Free shipping on every order, no exceptions.
          </p>

          <div className="mt-7 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:items-center">
            <Link
              href="/shop"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-bold uppercase tracking-widest text-black shadow-[0_0_28px_rgba(163,230,53,0.35)] transition-all duration-300 hover:bg-accent-hover hover:shadow-[0_0_40px_rgba(163,230,53,0.5)] sm:w-auto"
            >
              Shop Now
            </Link>
            <Link
              href="/#categories"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-8 py-4 text-sm font-semibold uppercase tracking-widest text-foreground transition-colors duration-300 hover:border-accent hover:text-accent sm:w-auto"
            >
              Explore Collection
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-2xl sm:p-8">
            <div
              className="absolute inset-0 bg-gradient-to-br from-accent/[0.07] to-transparent"
              aria-hidden="true"
            />
            <div
              className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                Look of the week
              </p>
              <div className="mt-4 flex items-end justify-between overflow-hidden rounded-2xl border border-border bg-surface sm:mt-6">
                <div
                  className="flex aspect-[4/5] w-full items-center justify-center"
                  role="img"
                  aria-label="Stylized fashion product placeholder: a mannequin figure in a dark jacket"
                >
                  <svg
                    viewBox="0 0 320 400"
                    className="h-auto w-full max-w-[220px] sm:max-w-[240px]"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient
                        id="jacket"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0" stopColor="#3f3f46" />
                        <stop offset="1" stopColor="#18181b" />
                      </linearGradient>
                      <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#a3e635" stopOpacity="0.9" />
                        <stop
                          offset="1"
                          stopColor="#a3e635"
                          stopOpacity="0.2"
                        />
                      </linearGradient>
                    </defs>

                    <ellipse
                      cx="160"
                      cy="60"
                      rx="48"
                      ry="52"
                      fill="url(#jacket)"
                    />
                    <rect
                      x="60"
                      y="100"
                      width="200"
                      height="40"
                      rx="20"
                      fill="url(#jacket)"
                    />
                    <rect y="150" width="320" height="250" fill="url(#jacket)" />
                    <path
                      d="M60 150 L160 80 L260 150"
                      fill="none"
                      stroke="#a3e635"
                      strokeWidth="6"
                    />
                    <line
                      x1="160"
                      y1="150"
                      x2="160"
                      y2="400"
                      stroke="#a3e635"
                      strokeWidth="4"
                      opacity="0.6"
                    />
                    <circle
                      cx="160"
                      cy="300"
                      r="90"
                      fill="url(#glow)"
                      opacity="0.35"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 sm:mt-6">
                <div>
                  <p className="text-lg font-bold">Signature Overshirt</p>
                  <p className="text-sm text-muted">Premium streetwear</p>
                </div>
                <p className="text-xl font-black text-accent">$89</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted">
            <span className="h-px w-10 bg-border" aria-hidden="true" />
            <span>Designed to turn heads</span>
            <span className="h-px w-10 bg-border" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}