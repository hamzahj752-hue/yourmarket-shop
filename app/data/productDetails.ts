import { products } from "./products";
import type { Product as CatalogProduct } from "./products";
import {
  SHOE_CATEGORIES,
  SHOE_PRODUCTS,
  getBrandName,
} from "../lib/shoes";
import type { ShoeProduct } from "../lib/shoes";

export type ProductColor = {
  name: string;
  hex: string;
};

export type ProductImage = {
  id: string;
  alt: string;
  colorHex: string;
};

export type ProductCategory =
  | "t-shirts"
  | "pants"
  | "shirts-jackets"
  | "sunglasses"
  | "shoes";

/**
 * Unified product shape used by the Product Details page.
 *
 * This is the contract the page renders against. Swap `getProductDetail`
 * (currently backed by demo data) for an Admin/Supabase query later without
 * touching any of the UI.
 */
export type ProductDetail = {
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  categoryLabel: string;
  type: string;
  price: number;
  salePrice?: number;
  rating: number;
  ratingCount: number;
  description: string;
  highlights: string[];
  stock: number;
  sizes?: string[];
  colors: ProductColor[];
  images: ProductImage[];
  accent: string;
};

const CATEGORY_META: Record<ProductCategory, { label: string; href: string }> = {
  "t-shirts": { label: "T-Shirts", href: "/category/t-shirts" },
  pants: { label: "Pants", href: "/category/pants" },
  "shirts-jackets": { label: "Shirts & Jackets", href: "/category/shirts-jackets" },
  sunglasses: { label: "Sunglasses", href: "/category/sunglasses" },
  shoes: { label: "Shoes", href: "/shoes" },
};

const COLOR_NAMES: Record<string, string> = {
  "#18181b": "Black",
  "#1c1917": "Charcoal",
  "#1f2937": "Midnight Blue",
  "#27272a": "Midnight",
  "#292524": "Espresso",
  "#374151": "Iron",
  "#3f3f46": "Graphite",
  "#44403c": "Umber",
  "#4b5563": "Steel",
  "#52525b": "Zinc",
  "#525252": "Ash",
  "#57534e": "Stone",
  "#71717a": "Slate",
  "#78716c": "Taupe",
  "#a1a1aa": "Silver",
  "#a3e635": "Lime",
  "#a8a29e": "Sand",
  "#cbb26a": "Gold",
  "#e4e4e7": "Light Grey",
  "#e7e5e4": "Ivory",
  "#ececf1": "Cloud",
  "#f4f4f5": "Off-White",
  "#fafafa": "White",
};

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const PANTS_SIZES = ["28", "30", "32", "34", "36", "38"];
const SHOE_SIZES = [
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "12",
];

const HIGHLIGHTS: Record<ProductCategory, string> = {
  "t-shirts": "Heavyweight garment-washed cotton",
  pants: "Structured premium fabric",
  "shirts-jackets": "Precision-cut woven fabric",
  sunglasses: "UV400 certified lenses",
  shoes: "Responsive cushioned midsole",
};

const COMMON_HIGHLIGHTS = ["Free shipping & easy returns", "Certified YOURMARKET quality"];

const DESCRIPTION_TEMPLATES: Record<
  ProductCategory,
  (value: { name: string; brand: string; type: string }) => string
> = {
  "t-shirts": ({ name, brand, type }) =>
    `A heavyweight, garment-washed essential from ${brand}. The ${name} pairs a relaxed ${type.toLowerCase()} silhouette with a structured collar and a matte finish that only gets better with wear.`,
  pants: ({ name, brand, type }) =>
    `${name} refines the ${type.toLowerCase()} staple by ${brand} — premium fabric, reinforced seams and a leg cut to move from weekday to weekend without missing a beat.`,
  "shirts-jackets": ({ name, brand, type }) =>
    `${name} brings a sharp ${type.toLowerCase()} silhouette to your rotation, cut from premium fabric and finished by ${brand}. Designed to layer, built to last through every season.`,
  sunglasses: ({ name, brand, type }) =>
    `${name} by ${brand} pairs precision ${type.toLowerCase()} lenses with a frame built for all-day wear — matte guard coat, UV400 protection and a weight that disappears on your face.`,
  shoes: ({ name, brand, type }) =>
    `${name} fuses ${brand} engineering with an all-day ${type.toLowerCase()} build — responsive cushioning, a grippy outsole and a silhouette that works with everything in rotation.`,
};

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function demoStock(slug: string): number {
  const h = hashString(slug) % 10;
  if (h === 0) return 0;
  if (h <= 2) return 4 + h;
  return 18 + h * 3;
}

function sizesForCategory(category: ProductCategory): string[] | undefined {
  switch (category) {
    case "sunglasses":
      return undefined;
    case "pants":
      return PANTS_SIZES;
    case "shoes":
      return SHOE_SIZES;
    default:
      return APPAREL_SIZES;
  }
}

function buildCatalogDetail(product: CatalogProduct): ProductDetail {
  const meta = CATEGORY_META[product.category as ProductCategory];
  const colors: ProductColor[] = product.colors.map((hex, index) => ({
    name: COLOR_NAMES[hex.toLowerCase()] ?? `Color ${index + 1}`,
    hex,
  }));

  return {
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category as ProductCategory,
    categoryLabel: meta.label,
    type: product.type,
    price: product.price,
    salePrice: product.salePrice,
    rating: product.rating,
    ratingCount: product.ratingCount,
    description: DESCRIPTION_TEMPLATES[product.category as ProductCategory]({
      name: product.name,
      brand: product.brand,
      type: product.type,
    }),
    highlights: [
      HIGHLIGHTS[product.category as ProductCategory],
      ...COMMON_HIGHLIGHTS,
    ],
    stock: demoStock(product.slug),
    sizes: sizesForCategory(product.category as ProductCategory),
    colors,
    images: colors.map((color, index) => ({
      id: `${product.slug}-image-${index}`,
      alt: `${product.name} in ${color.name}`,
      colorHex: color.hex,
    })),
    accent: "#a3e635",
  };
}

function buildShoeDetail(shoe: ShoeProduct): ProductDetail {
  const shoeCategory = SHOE_CATEGORIES.find(
    (category) => category.id === shoe.categoryId,
  );

  return {
    slug: shoe.slug,
    name: shoe.name,
    brand: getBrandName(shoe.brandId),
    category: "shoes",
    categoryLabel: CATEGORY_META.shoes.label,
    type: shoeCategory?.name ?? "Sneakers",
    price: shoe.price,
    salePrice: shoe.oldPrice,
    rating: shoe.rating,
    ratingCount: shoe.reviewCount,
    description: DESCRIPTION_TEMPLATES.shoes({
      name: shoe.name,
      brand: getBrandName(shoe.brandId),
      type: shoeCategory?.name ?? "Sneakers",
    }),
    highlights: [HIGHLIGHTS.shoes, ...COMMON_HIGHLIGHTS],
    stock: demoStock(shoe.slug),
    sizes: SHOE_SIZES,
    colors: shoe.colors,
    images: shoe.colors.map((color, index) => ({
      id: `${shoe.slug}-image-${index}`,
      alt: `${shoe.name} in ${color.name}`,
      colorHex: color.hex,
    })),
    accent: shoe.accent,
  };
}

const detailStore = new Map<string, ProductDetail>();

for (const product of products) {
  const detail = buildCatalogDetail(product);
  detailStore.set(detail.slug, detail);
}

for (const shoe of SHOE_PRODUCTS) {
  const detail = buildShoeDetail(shoe);
  detailStore.set(detail.slug, detail);
}

export function getProductDetail(slug: string): ProductDetail | undefined {
  return detailStore.get(slug);
}

export function getAllProductSlugs(): string[] {
  return Array.from(detailStore.keys());
}