import Link from "next/link";
import CategoryCard from "./CategoryCard";

function TShirtVisual() {
  return (
    <svg
      viewBox="0 0 200 250"
      className="h-auto w-full max-w-[180px] transition-transform duration-300 group-hover:scale-105"
      role="img"
      aria-label="Illustrated t-shirt placeholder"
    >
      <path
        d="M100 15 40 55 55 80 75 65 v150 h50 V65 l20 15 15-25 L100 15Z"
        fill="#27272a"
        stroke="#52525b"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M100 15 v185"
        fill="none"
        stroke="#a3e635"
        strokeWidth="3"
        strokeDasharray="1 7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PantsVisual() {
  return (
    <svg
      viewBox="0 0 200 250"
      className="h-auto w-full max-w-[170px] transition-transform duration-300 group-hover:scale-105"
      role="img"
      aria-label="Illustrated pants placeholder"
    >
      <path
        d="M70 25 H130 V115 L150 225 L110 235 L100 140 L90 235 L50 225 L70 115 Z"
        fill="#27272a"
        stroke="#52525b"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <line
        x1="100"
        y1="30"
        x2="100"
        y2="230"
        stroke="#a3e635"
        strokeWidth="3"
        strokeDasharray="1 7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShoesVisual() {
  return (
    <svg
      viewBox="0 0 200 120"
      className="h-auto w-full max-w-[200px] transition-transform duration-300 group-hover:scale-105"
      role="img"
      aria-label="Illustrated sneaker placeholder"
    >
      <path
        d="M15 75 H55 L85 45 H150 L185 75 A15 15 0 0 1 185 90 H15 A15 15 0 0 1 15 75 Z"
        fill="#27272a"
        stroke="#52525b"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M85 45 H140 L160 75 H100 Z"
        fill="#3f3f46"
        stroke="#52525b"
        strokeWidth="3"
      />
      <line
        x1="20"
        y1="66"
        x2="180"
        y2="66"
        stroke="#a3e635"
        strokeWidth="3"
        strokeDasharray="2 8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function JacketVisual() {
  return (
    <svg
      viewBox="0 0 200 250"
      className="h-auto w-full max-w-[180px] transition-transform duration-300 group-hover:scale-105"
      role="img"
      aria-label="Illustrated shirt and jacket placeholder"
    >
      <path
        d="M40 40 L70 25 H130 L160 40 L150 75 H130 V225 H70 V75 H50 Z"
        fill="#27272a"
        stroke="#52525b"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M100 45 V220"
        fill="none"
        stroke="#a3e635"
        strokeWidth="3"
        strokeDasharray="1 7"
        strokeLinecap="round"
      />
      <path
        d="M90 45 H110"
        stroke="#a3e635"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SunglassesVisual() {
  return (
    <svg
      viewBox="0 0 200 120"
      className="h-auto w-full max-w-[180px] transition-transform duration-300 group-hover:scale-105"
      role="img"
      aria-label="Illustrated sunglasses placeholder"
    >
      <circle cx="72" cy="60" r="38" fill="#27272a" stroke="#52525b" strokeWidth="6" />
      <circle cx="128" cy="60" r="38" fill="#27272a" stroke="#52525b" strokeWidth="6" />
      <path
        d="M96 57 Q100 50 104 57"
        fill="none"
        stroke="#a3e635"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line x1="34" y1="58" x2="18" y2="50" stroke="#a3e635" strokeWidth="5" strokeLinecap="round" />
      <line x1="166" y1="58" x2="182" y2="50" stroke="#a3e635" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

const CATEGORIES = [
  {
    name: "T-Shirts",
    href: "/category/t-shirts",
    accent: "#a3e635",
    visual: <TShirtVisual />,
  },
  {
    name: "Pants",
    href: "/category/pants",
    accent: "#a3e635",
    visual: <PantsVisual />,
  },
  {
    name: "Shoes",
    href: "/shoes",
    accent: "#a3e635",
    visual: <ShoesVisual />,
  },
  {
    name: "Shirts & Jackets",
    href: "/category/shirts-jackets",
    accent: "#a3e635",
    visual: <JacketVisual />,
  },
  {
    name: "Sunglasses",
    href: "/category/sunglasses",
    accent: "#a3e635",
    visual: <SunglassesVisual />,
  },
];

export default function ShopByCategory() {
  return (
    <section id="categories" className="border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Curated for you
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
              Shop By Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-muted transition-colors hover:text-accent"
          >
            View all products
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-5">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              href={category.href}
              accent={category.accent}
            >
              {category.visual}
            </CategoryCard>
          ))}
        </div>
      </div>
    </section>
  );
}