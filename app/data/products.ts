import type { BackgroundTextStyle, ProductVariant } from "@/app/lib/presentation";
import { backgroundWord, resolveVariant } from "@/app/lib/presentation";

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  type: string;
  price: number;
  salePrice?: number;
  rating: number;
  ratingCount: number;
  colors: string[];
  backgroundDisplayText?: string;
  backgroundTextColor?: string;
  backgroundTextStyle?: BackgroundTextStyle;
  variants?: ProductVariant[];
  description?: string;
  sizes?: string[];
};

export const products: Product[] = [
  {
    slug: "gravity-oversized-tee",
    name: "Gravity Oversized Tee",
    brand: "Aerowear",
    category: "t-shirts",
    type: "Oversized",
    price: 34.99,
    salePrice: 24.99,
    rating: 4.7,
    ratingCount: 214,
    colors: ["#a3e635", "#ececf1", "#3f3f46"],
  },
  {
    slug: "nightfall-graphic-tee",
    name: "Nightfall Graphic Tee",
    brand: "Urban Threads",
    category: "t-shirts",
    type: "Graphic",
    price: 28.99,
    rating: 4.5,
    ratingCount: 132,
    colors: ["#ececf1", "#18181b", "#a3e635"],
  },
  {
    slug: "loop-classic-tee",
    name: "Loop Classic Tee",
    brand: "Vantage",
    category: "t-shirts",
    type: "Regular Fit",
    price: 22.99,
    salePrice: 18.99,
    rating: 4.4,
    ratingCount: 98,
    colors: ["#52525b", "#e4e4e7", "#a3e635"],
  },
  {
    slug: "meridian-polo-shirt",
    name: "Meridian Polo Shirt",
    brand: "Goodthreads",
    category: "t-shirts",
    type: "Polo",
    price: 36.99,
    rating: 4.6,
    ratingCount: 87,
    colors: ["#18181b", "#71717a", "#fafafa"],
  },
  {
    slug: "coastline-long-sleeve-tee",
    name: "Coastline Long Sleeve Tee",
    brand: "Northmark",
    category: "t-shirts",
    type: "Full Sleeve",
    price: 39.99,
    rating: 4.8,
    ratingCount: 156,
    colors: ["#3f3f46", "#a3e635", "#ececf1"],
  },
  {
    slug: "blvd-oversized-tee",
    name: "Blvd Oversized Tee",
    brand: "Urban Threads",
    category: "t-shirts",
    type: "Oversized",
    price: 31.99,
    salePrice: 25.99,
    rating: 4.3,
    ratingCount: 74,
    colors: ["#a1a1aa", "#18181b", "#a3e635"],
  },
  {
    slug: "studio-fit-tee",
    name: "Studio Fit Tee",
    brand: "Vantage",
    category: "t-shirts",
    type: "Regular Fit",
    price: 24.99,
    rating: 4.5,
    ratingCount: 201,
    colors: ["#a3e635", "#ececf1", "#3f3f46"],
  },
  {
    slug: "circuit-graphic-tee",
    name: "Circuit Graphic Tee",
    brand: "Aerowear",
    category: "t-shirts",
    type: "Graphic",
    price: 29.99,
    salePrice: 21.99,
    rating: 4.2,
    ratingCount: 63,
    colors: ["#18181b", "#a3e635"],
  },
  {
    slug: "heritage-polo-shirt",
    name: "Heritage Polo Shirt",
    brand: "Northmark",
    category: "t-shirts",
    type: "Polo",
    price: 34.99,
    rating: 4.7,
    ratingCount: 118,
    colors: ["#e4e4e7", "#3f3f46", "#18181b"],
  },
  {
    slug: "summit-full-sleeve-tee",
    name: "Summit Full Sleeve Tee",
    brand: "Vantage",
    category: "t-shirts",
    type: "Full Sleeve",
    price: 37.99,
    rating: 4.6,
    ratingCount: 142,
    colors: ["#3f3f46", "#a3e635", "#e4e4e7"],
  },
  {
    slug: "boulder-slim-jeans",
    name: "Boulder Slim Jeans",
    brand: "Boulderjeans",
    category: "pants",
    type: "Jeans",
    price: 59.99,
    salePrice: 44.99,
    rating: 4.7,
    ratingCount: 340,
    colors: ["#1f2937", "#374151", "#18181b"],
  },
  {
    slug: "trail-cargo-pants",
    name: "Trail Cargo Pants",
    brand: "TrailFolk",
    category: "pants",
    type: "Cargo",
    price: 64.99,
    rating: 4.6,
    ratingCount: 221,
    colors: ["#57534e", "#292524", "#a8a29e"],
  },
  {
    slug: "pulse-joggers",
    name: "Pulse Joggers",
    brand: "Streetline",
    category: "pants",
    type: "Joggers",
    price: 44.99,
    salePrice: 34.99,
    rating: 4.5,
    ratingCount: 198,
    colors: ["#18181b", "#a3e635", "#ececf1"],
  },
  {
    slug: "executive-formal-trousers",
    name: "Executive Formal Trousers",
    brand: "Modern Formal",
    category: "pants",
    type: "Formal",
    price: 79.99,
    rating: 4.8,
    ratingCount: 164,
    colors: ["#18181b", "#3f3f46", "#a3e635"],
  },
  {
    slug: "stride-track-pants",
    name: "Stride Track Pants",
    brand: "Ironclad",
    category: "pants",
    type: "Track Pants",
    price: 39.99,
    rating: 4.3,
    ratingCount: 112,
    colors: ["#3f3f46", "#a3e635", "#18181b"],
  },
  {
    slug: "ridge-straight-jeans",
    name: "Ridge Straight Jeans",
    brand: "Boulderjeans",
    category: "pants",
    type: "Jeans",
    price: 54.99,
    rating: 4.4,
    ratingCount: 287,
    colors: ["#4b5563", "#1f2937"],
  },
  {
    slug: "base-camp-cargo-pants",
    name: "Base Camp Cargo Pants",
    brand: "Ironclad",
    category: "pants",
    type: "Cargo",
    price: 58.99,
    salePrice: 46.99,
    rating: 4.6,
    ratingCount: 133,
    colors: ["#44403c", "#292524"],
  },
  {
    slug: "metro-slim-formal-trousers",
    name: "Metro Slim Formal Trousers",
    brand: "Modern Formal",
    category: "pants",
    type: "Formal",
    price: 84.99,
    rating: 4.7,
    ratingCount: 95,
    colors: ["#18181b", "#525252"],
  },
  {
    slug: "streetflow-joggers",
    name: "Streetflow Joggers",
    brand: "Streetline",
    category: "pants",
    type: "Joggers",
    price: 47.99,
    rating: 4.4,
    ratingCount: 76,
    colors: ["#a3e635", "#18181b", "#ececf1"],
  },
  {
    slug: "aero-track-pants",
    name: "Aero Track Pants",
    brand: "Ironclad",
    category: "pants",
    type: "Track Pants",
    price: 42.99,
    salePrice: 33.99,
    rating: 4.2,
    ratingCount: 88,
    colors: ["#a1a1aa", "#18181b"],
  },
  {
    slug: "airfield-casual-shirt",
    name: "Airfield Casual Shirt",
    brand: "Cloudline",
    category: "shirts-jackets",
    type: "Casual Shirts",
    price: 54.99,
    salePrice: 43.99,
    rating: 4.6,
    ratingCount: 176,
    colors: ["#78716c", "#292524", "#e7e5e4"],
    backgroundDisplayText: "AIRFIELD",
  },
  {
    slug: "executive-formal-shirt",
    name: "Executive Formal Shirt",
    brand: "Tailor & Oak",
    category: "shirts-jackets",
    type: "Formal Shirts",
    price: 58.99,
    rating: 4.7,
    ratingCount: 203,
    colors: ["#f4f4f5", "#e4e4e7", "#18181b"],
  },
  {
    slug: "field-overshirt",
    name: "Field Overshirt",
    brand: "Fieldbound",
    category: "shirts-jackets",
    type: "Overshirts",
    price: 74.99,
    rating: 4.8,
    ratingCount: 188,
    colors: ["#57534e", "#1c1917", "#a3e635"],
  },
  {
    slug: "metro-waxed-jacket",
    name: "Metro Waxed Jacket",
    brand: "Heritage Co",
    category: "shirts-jackets",
    type: "Jackets",
    price: 129.99,
    salePrice: 99.99,
    rating: 4.7,
    ratingCount: 142,
    colors: ["#3f3f46", "#18181b"],
  },
  {
    slug: "polar-parka",
    name: "Polar Parka",
    brand: "Northmark",
    category: "shirts-jackets",
    type: "Winter Jackets",
    price: 149.99,
    rating: 4.8,
    ratingCount: 231,
    colors: ["#52525b", "#27272a", "#a3e635"],
  },
  {
    slug: "nomad-casual-shirt",
    name: "Nomad Casual Shirt",
    brand: "Fieldbound",
    category: "shirts-jackets",
    type: "Casual Shirts",
    price: 49.99,
    rating: 4.4,
    ratingCount: 97,
    colors: ["#57534e", "#78716c"],
  },
  {
    slug: "sterling-formal-shirt",
    name: "Sterling Formal Shirt",
    brand: "Tailor & Oak",
    category: "shirts-jackets",
    type: "Formal Shirts",
    price: 62.99,
    salePrice: 51.99,
    rating: 4.6,
    ratingCount: 134,
    colors: ["#fafafa", "#e4e4e7"],
  },
  {
    slug: "wool-blend-overshirt",
    name: "Wool Blend Overshirt",
    brand: "Heritage Co",
    category: "shirts-jackets",
    type: "Overshirts",
    price: 82.99,
    rating: 4.7,
    ratingCount: 114,
    colors: ["#292524", "#78716c", "#e7e5e4"],
  },
  {
    slug: "storm-shell-jacket",
    name: "Storm Shell Jacket",
    brand: "Cloudline",
    category: "shirts-jackets",
    type: "Jackets",
    price: 109.99,
    rating: 4.6,
    ratingCount: 156,
    colors: ["#3f3f46", "#71717a", "#a3e635"],
  },
  {
    slug: "alpine-down-jacket",
    name: "Alpine Down Jacket",
    brand: "Northmark",
    category: "shirts-jackets",
    type: "Winter Jackets",
    price: 139.99,
    salePrice: 119.99,
    rating: 4.9,
    ratingCount: 178,
    colors: ["#27272a", "#a3e635"],
  },
  {
    slug: "highland-aviator",
    name: "Highland Aviator",
    brand: "Horizon",
    category: "sunglasses",
    type: "Aviator",
    price: 89.99,
    salePrice: 69.99,
    rating: 4.7,
    ratingCount: 168,
    colors: ["#cbb26a", "#18181b"],
  },
  {
    slug: "classic-wayfarer",
    name: "Classic Wayfarer",
    brand: "Skyline Eyewear",
    category: "sunglasses",
    type: "Wayfarer",
    price: 79.99,
    rating: 4.6,
    ratingCount: 214,
    colors: ["#18181b", "#3f3f46"],
  },
  {
    slug: "mono-round",
    name: "Mono Round",
    brand: "Prism",
    category: "sunglasses",
    type: "Round",
    price: 69.99,
    rating: 4.4,
    ratingCount: 89,
    colors: ["#a3e635", "#18181b"],
  },
  {
    slug: "graphite-square",
    name: "Graphite Square",
    brand: "Verve Eyewear",
    category: "sunglasses",
    type: "Square",
    price: 74.99,
    salePrice: 59.99,
    rating: 4.5,
    ratingCount: 127,
    colors: ["#52525b", "#18181b"],
  },
  {
    slug: "velocity-sports-shades",
    name: "Velocity Sports Shades",
    brand: "Lumen Optics",
    category: "sunglasses",
    type: "Sports",
    price: 94.99,
    rating: 4.6,
    ratingCount: 196,
    colors: ["#18181b", "#a3e635", "#f4f4f5"],
  },
  {
    slug: "grove-oversized",
    name: "Grove Oversized",
    brand: "Prism",
    category: "sunglasses",
    type: "Oversized",
    price: 84.99,
    rating: 4.5,
    ratingCount: 103,
    colors: ["#cbb26a", "#18181b"],
  },
  {
    slug: "jet-aviator",
    name: "Jet Aviator",
    brand: "Lumen Optics",
    category: "sunglasses",
    type: "Aviator",
    price: 99.99,
    rating: 4.8,
    ratingCount: 143,
    colors: ["#18181b", "#cbb26a"],
  },
  {
    slug: "campus-wayfarer",
    name: "Campus Wayfarer",
    brand: "Verve Eyewear",
    category: "sunglasses",
    type: "Wayfarer",
    price: 71.99,
    rating: 4.4,
    ratingCount: 118,
    colors: ["#4b5563", "#1f2937"],
  },
  {
    slug: "orb-round",
    name: "Orb Round",
    brand: "Skyline Eyewear",
    category: "sunglasses",
    type: "Round",
    price: 66.99,
    salePrice: 54.99,
    rating: 4.3,
    ratingCount: 77,
    colors: ["#f4f4f5", "#18181b"],
  },
  {
    slug: "stride-sports-shades",
    name: "Stride Sports Shades",
    brand: "Horizon",
    category: "sunglasses",
    type: "Sports",
    price: 89.99,
    rating: 4.7,
    ratingCount: 121,
    colors: ["#18181b", "#a3e635"],
  },
];

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

const APPAREL_SIZES: Record<string, string[]> = {
  "t-shirts": ["XS", "S", "M", "L", "XL", "XXL"],
  pants: ["28", "30", "32", "34", "36"],
  "shirts-jackets": ["XS", "S", "M", "L", "XL", "XXL"],
};

export function getProductSizes(product: Product): string[] {
  if (product.sizes && product.sizes.length > 0) {
    return product.sizes;
  }
  return APPAREL_SIZES[product.category] ?? [];
}

/**
 * Resolve the admin-ready variant presentation for a product.
 * Explicit fields on the (future Admin/Supabase) mock structure win over
 * the auto-derived defaults so an owner can later tweak them without code.
 */
export function getProductVariants(product: Product): ProductVariant[] {
  return product.colors.map((hex, index) => {
    const computed = resolveVariant(hex);
    const override = product.variants?.[index];
    return {
      colorName: override?.colorName ?? computed.colorName,
      colorValue: override?.colorValue ?? hex,
      image: override?.image ?? computed.image ?? "",
      themeColor: override?.themeColor ?? computed.themeColor,
      accentColor: override?.accentColor ?? computed.accentColor,
      textColor: override?.textColor ?? computed.textColor,
      backgroundTextColor:
        override?.backgroundTextColor ?? computed.backgroundTextColor,
    };
  });
}

export function getProductBackgroundText(product: Product): string {
  return product.backgroundDisplayText || backgroundWord(product.name);
}

export function getProductBackgroundTextStyle(product: Product): BackgroundTextStyle {
  return product.backgroundTextStyle ?? "bold";
}

export function getProductDescription(product: Product): string {
  if (product.description) {
    return product.description;
  }

  switch (product.category) {
    case "t-shirts":
      return `${product.name} is a ${product.type.toLowerCase()} cut from heavyweight, breathable cotton with a clean finish. The kind of layer that works from coffee runs to late nights.`;
    case "pants":
      return `${product.type} with a tailored ${product.name.toLowerCase()} silhouette, built from premium stretch fabric that moves with you all day. Comfort and structure without compromise.`;
    case "shirts-jackets":
      return `A standout ${product.type.toLowerCase()} from ${product.brand}, layer-ready in premium wovens. Refined details, durable construction and a finish that elevates any outfit.`;
    case "sunglasses":
      return `${product.type} frames from ${product.brand} with precision-coated lenses and a feather-light build. UV-blocking clarity wrapped in a signature ${product.name.toLowerCase()} silhouette.`;
    default:
      return `${product.name} by ${product.brand}. Crafted with premium materials and an eye for detail, built to be the elevated staple your rotation deserves.`;
  }
}