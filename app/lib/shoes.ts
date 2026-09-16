import type { BackgroundTextStyle } from "./presentation";
import { backgroundWord } from "./presentation";

export type ShoeBrand = {
  id: string;
  slug: string;
  name: string;
};

export const SHOE_BRANDS: ShoeBrand[] = [
  { id: "brand-nike", slug: "nike", name: "Nike" },
  { id: "brand-adidas", slug: "adidas", name: "Adidas" },
  { id: "brand-puma", slug: "puma", name: "Puma" },
  { id: "brand-new-balance", slug: "new-balance", name: "New Balance" },
  { id: "brand-reebok", slug: "reebok", name: "Reebok" },
  { id: "brand-other", slug: "other", name: "Other" },
];

export type ShoeCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  accent: string;
};

export const SHOE_CATEGORIES: ShoeCategory[] = [
  {
    id: "cat-sneakers",
    slug: "sneakers",
    name: "Sneakers",
    description: "Everyday statement kicks.",
    accent: "#22d3ee",
  },
  {
    id: "cat-running",
    slug: "running",
    name: "Running",
    description: "Engineered for the miles.",
    accent: "#a3e635",
  },
  {
    id: "cat-casual",
    slug: "casual",
    name: "Casual",
    description: "Easy-wear everyday comfort.",
    accent: "#a78bfa",
  },
  {
    id: "cat-sports",
    slug: "sports",
    name: "Sports",
    description: "Game-day performance edge.",
    accent: "#fb923c",
  },
  {
    id: "cat-high-tops",
    slug: "high-tops",
    name: "High Tops",
    description: "Ankle-high attitude.",
    accent: "#f472b6",
  },
];

export type ShoeColor = {
  name: string;
  hex: string;
  image?: string;
  themeColor?: string;
  accentColor?: string;
  textColor?: string;
  backgroundTextColor?: string;
};

export type ShoeProduct = {
  id: string;
  slug: string;
  name: string;
  brandId: string;
  categoryId: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  colors: ShoeColor[];
  accent: string;
  isNew?: boolean;
  backgroundDisplayText?: string;
  backgroundTextColor?: string;
  backgroundTextStyle?: BackgroundTextStyle;
};

export const SHOE_PRODUCTS: ShoeProduct[] = [
  {
    id: "shoe-velocity-runner-x1",
    slug: "velocity-runner-x1",
    name: "Velocity Runner X1",
    brandId: "brand-nike",
    categoryId: "cat-running",
    price: 129,
    oldPrice: 159,
    rating: 4.8,
    reviewCount: 214,
    accent: "#a3e635",
    colors: [
      { name: "Volt", hex: "#a3e635" },
      { name: "Obsidian", hex: "#18181b" },
      { name: "Cloud", hex: "#e7e5e4" },
    ],
  },
  {
    id: "shoe-court-classic-90",
    slug: "court-classic-90",
    name: "Court Classic 90",
    brandId: "brand-adidas",
    categoryId: "cat-casual",
    price: 98,
    rating: 4.6,
    reviewCount: 178,
    accent: "#22d3ee",
    colors: [
      { name: "White", hex: "#f5f5f4" },
      { name: "Core Black", hex: "#1a1a1a" },
      { name: "Navy", hex: "#1e3a8a" },
    ],
  },
  {
    id: "shoe-stride-pro-trainer",
    slug: "stride-pro-trainer",
    name: "Stride Pro Trainer",
    brandId: "brand-nike",
    categoryId: "cat-sports",
    price: 142,
    oldPrice: 168,
    rating: 4.7,
    reviewCount: 96,
    accent: "#fb923c",
    colors: [
      { name: "Vapor Orange", hex: "#fb923c" },
      { name: "Black", hex: "#18181b" },
      { name: "Sand", hex: "#d6d3d1" },
    ],
  },
  {
    id: "shoe-cloudstep-retro",
    slug: "cloudstep-retro",
    name: "CloudStep Retro",
    brandId: "brand-new-balance",
    categoryId: "cat-casual",
    price: 115,
    rating: 4.5,
    reviewCount: 152,
    accent: "#a78bfa",
    colors: [
      { name: "Grey", hex: "#d4d4d8" },
      { name: "Violet", hex: "#a78bfa" },
      { name: "Ivory", hex: "#fafaf9" },
    ],
  },
  {
    id: "shoe-aero-glide-rider",
    slug: "aero-glide-rider",
    name: "Aero Glide Rider",
    brandId: "brand-reebok",
    categoryId: "cat-running",
    price: 105,
    oldPrice: 129,
    rating: 4.4,
    reviewCount: 88,
    accent: "#f472b6",
    colors: [
      { name: "Rose", hex: "#f472b6" },
      { name: "Slate", hex: "#334155" },
      { name: "Ice", hex: "#fafafa" },
    ],
  },
  {
    id: "shoe-swift-kicks-low",
    slug: "swift-kicks-low",
    name: "Swift Kicks Low",
    brandId: "brand-puma",
    categoryId: "cat-casual",
    price: 82,
    rating: 4.3,
    reviewCount: 141,
    accent: "#facc15",
    colors: [
      { name: "Active Yellow", hex: "#facc15" },
      { name: "Black", hex: "#171717" },
      { name: "White", hex: "#fafafa" },
    ],
  },
  {
    id: "shoe-hoops-signature-3",
    slug: "hoops-signature-3",
    name: "Hoops Signature 3",
    brandId: "brand-nike",
    categoryId: "cat-high-tops",
    price: 165,
    oldPrice: 189,
    rating: 4.9,
    reviewCount: 310,
    accent: "#a3e635",
    isNew: true,
    colors: [
      { name: "Volt", hex: "#a3e635" },
      { name: "White", hex: "#fafafa" },
      { name: "Black", hex: "#171717" },
    ],
  },
  {
    id: "shoe-urban-trek-high",
    slug: "urban-trek-high",
    name: "Urban Trek High",
    brandId: "brand-adidas",
    categoryId: "cat-high-tops",
    price: 148,
    rating: 4.6,
    reviewCount: 77,
    accent: "#fb923c",
    colors: [
      { name: "Terra Orange", hex: "#fb923c" },
      { name: "Stone", hex: "#78716c" },
      { name: "Black", hex: "#171717" },
    ],
  },
  {
    id: "shoe-flex-motion-runner",
    slug: "flex-motion-runner",
    name: "Flex Motion Runner",
    brandId: "brand-puma",
    categoryId: "cat-running",
    price: 96,
    rating: 4.5,
    reviewCount: 123,
    accent: "#22d3ee",
    colors: [
      { name: "Aqua", hex: "#22d3ee" },
      { name: "White", hex: "#fafafa" },
      { name: "Grey", hex: "#a3a3a3" },
    ],
  },
  {
    id: "shoe-everyday-comfort-574",
    slug: "everyday-comfort-574",
    name: "Everyday Comfort 574",
    brandId: "brand-new-balance",
    categoryId: "cat-casual",
    price: 109,
    oldPrice: 125,
    rating: 4.7,
    reviewCount: 201,
    accent: "#a78bfa",
    colors: [
      { name: "Stone", hex: "#e7e5e4" },
      { name: "Force Violet", hex: "#a78bfa" },
      { name: "Grey", hex: "#737373" },
    ],
  },
  {
    id: "shoe-turbo-sprint-spike",
    slug: "turbo-sprint-spike",
    name: "Turbo Sprint Spike",
    brandId: "brand-reebok",
    categoryId: "cat-sports",
    price: 134,
    rating: 4.4,
    reviewCount: 67,
    accent: "#facc15",
    isNew: true,
    colors: [
      { name: "Electric", hex: "#facc15" },
      { name: "Red", hex: "#dc2626" },
      { name: "Black", hex: "#171717" },
    ],
  },
  {
    id: "shoe-neon-street-slam",
    slug: "neon-street-slam",
    name: "Neon Street Slam",
    brandId: "brand-adidas",
    categoryId: "cat-sneakers",
    price: 119,
    rating: 4.8,
    reviewCount: 255,
    accent: "#34d399",
    colors: [
      { name: "Neon Mint", hex: "#34d399" },
      { name: "Black", hex: "#171717" },
      { name: "White", hex: "#fafafa" },
    ],
  },
];

export const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
  { id: "newest", label: "Newest" },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]["id"];

export type ShoeFilter = {
  id: string;
  label: string;
  hint: string;
  options: string[];
};

export const SHOE_FILTERS: ShoeFilter[] = [
  {
    id: "brand",
    label: "Brand",
    hint: "Nike, Adidas, Puma and more.",
    options: ["Nike", "Adidas", "Puma", "New Balance", "Reebok", "Other"],
  },
  {
    id: "price",
    label: "Price",
    hint: "Pick a range that fits you.",
    options: ["Under $100", "$100 - $150", "$150+"],
  },
  {
    id: "size",
    label: "Size",
    hint: "US sizes 6 - 14.",
    options: ["6", "7", "8", "9", "10", "11", "12"],
  },
  {
    id: "color",
    label: "Color",
    hint: "Our seasonal palettes.",
    options: ["Black", "White", "Lime", "Cyan", "Orange", "Violet"],
  },
  {
    id: "rating",
    label: "Rating",
    hint: "Only the best-reviewed pairs.",
    options: ["4.0+", "4.5+"],
  },
];

export function getBrandName(brandId: string): string {
  return SHOE_BRANDS.find((brand) => brand.id === brandId)?.name ?? "YOURMARKET";
}

export function getShoeBackgroundText(product: ShoeProduct): string {
  return product.backgroundDisplayText || backgroundWord(product.name);
}

export function getShoeBackgroundTextStyle(
  product: ShoeProduct,
): BackgroundTextStyle {
  return product.backgroundTextStyle ?? "bold";
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}