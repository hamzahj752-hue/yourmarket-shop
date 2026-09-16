import Link from "next/link";

type CategoryCardProps = {
  name: string;
  href: string;
  accent: string;
  children: React.ReactNode;
};

export default function CategoryCard({
  name,
  href,
  accent,
  children,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_8px_40px_rgba(163,230,53,0.12)]"
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-surface sm:aspect-[4/5]">
        <div
          className="absolute inset-0 bg-gradient-to-br from-transparent to-accent/[0.06]"
          aria-hidden="true"
        />
        <div className="flex h-full w-full items-center justify-center p-4 sm:p-6 lg:p-8">
          {children}
        </div>
        <span
          className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: accent }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          New
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 p-3 sm:p-5">
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-foreground">
            {name}
          </span>
          <span className="mt-0.5 block text-sm text-muted">
            Shop the latest drop
          </span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider transition-all duration-300 group-hover:gap-3">
          <span style={{ color: accent }}>Shop Now</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
            style={{ color: accent }}
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}