import Link from "next/link";
import ShoeVisual from "./ShoeVisual";

export default function ShoesHero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-lime-300/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl"
        aria-hidden="true"
      />

      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1 select-none text-center text-[clamp(4.25rem,17vw,12.5rem)] font-black leading-none tracking-tighter text-white/[0.04] lg:top-4"
      >
        SHOES
      </p>

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 pb-14 pt-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:pb-20 lg:pt-24">
        <div className="max-w-xl text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-lime-300/30 bg-lime-300/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-lime-300">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-300" />
            </span>
            The Footwear Edit
          </p>

          <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl xl:text-7xl">
            Shoes
            <span className="block bg-linear-to-r from-lime-300 via-cyan-300 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_26px_rgba(34,211,238,0.25)]">
              That Move.
            </span>
          </h1>

          <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
            A high-energy lineup of premium sneakers, runners and game-day
            pairs. Bold colorways, fresh silhouettes and street-ready build,
            curated with the YOURMARKET edge.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
            <Link
              href="/shoes#catalog"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-8 py-4 text-sm font-bold uppercase tracking-widest text-black shadow-[0_0_28px_rgba(163,230,53,0.4)] transition-all duration-300 hover:bg-lime-200 hover:shadow-[0_0_44px_rgba(163,230,53,0.55)]"
            >
              Shop the Drop
            </Link>
            <Link
              href="/shoes#types"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-8 py-4 text-sm font-semibold uppercase tracking-widest text-foreground transition-colors duration-300 hover:border-cyan-300/60 hover:text-cyan-300"
            >
              Explore Styles
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-widest text-muted lg:justify-start">
            <span>12 styles</span>
            <span className="h-1 w-1 rounded-full bg-lime-300" aria-hidden="true" />
            <span>6 brands</span>
            <span className="h-1 w-1 rounded-full bg-cyan-300" aria-hidden="true" />
            <span>New drops weekly</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-[0_30px_90px_-24px_rgba(0,0,0,0.85)]">
            <div
              className="absolute inset-0 bg-linear-to-br from-lime-300/10 via-transparent to-cyan-400/10"
              aria-hidden="true"
            />
            <div
              className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-lime-300/15 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative px-6 pb-6 pt-12 sm:px-10 sm:pb-8 sm:pt-16">
              <ShoeVisual
                accent="#a3e635"
                className="h-auto w-full"
                label="Fresh YOURMARKET running sneaker in profile with a lime accent"
              />
              <div className="mt-5 flex items-center justify-between text-[11px] uppercase tracking-widest text-muted">
                <span>New Season</span>
                <span className="text-lime-300">FW 26</span>
              </div>
            </div>
          </div>

          <div className="absolute -left-2 top-5 z-10 hidden rounded-2xl border border-border bg-surface/90 px-4 py-3 backdrop-blur sm:-left-6 sm:block">
            <p className="text-[10px] uppercase tracking-widest text-muted">
              Editors Pick
            </p>
            <p className="mt-0.5 text-sm font-bold text-foreground">The Drop List</p>
          </div>

          <div className="absolute -right-2 bottom-8 z-10 rounded-2xl border border-cyan-300/30 bg-surface/90 px-4 py-3 text-right backdrop-blur sm:-right-4">
            <p className="bg-linear-to-r from-cyan-300 to-violet-400 bg-clip-text text-2xl font-black tracking-tight text-transparent">
              -15%
            </p>
            <p className="text-[10px] uppercase tracking-widest text-muted">
              New season
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}