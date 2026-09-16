import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="pointer-events-none absolute -left-40 -top-40 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-64 w-64 rounded-full bg-accent/5 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />

      <div className="relative">
        <p className="text-[96px] font-black leading-none tracking-tighter text-accent/20 sm:text-[180px]">404</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-black tracking-tight sm:text-5xl">Page Not Found</span>
        </div>
      </div>

      <p className="relative mt-5 max-w-md text-sm leading-relaxed text-muted">
        The page you are looking for does not exist or has been moved. Let us get you back on track.
      </p>

      <div className="relative mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover">
          Go Home
        </Link>
        <Link href="/shop" className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-bold uppercase tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent">
          Shop Products
        </Link>
      </div>

      <Link href="/" className="relative mt-10 text-sm font-black tracking-widest text-muted transition-colors hover:text-accent">
        YOUR<span className="text-accent">MARKET</span>
      </Link>
    </main>
  );
}
