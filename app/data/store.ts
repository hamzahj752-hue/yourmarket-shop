import { products, type Product } from "./products";
import { SHOE_PRODUCTS, getBrandName } from "@/app/lib/shoes";

export { products, type Product };

export function shoeToProduct(shoe: (typeof SHOE_PRODUCTS)[number]): Product {
  return {
    slug: shoe.slug,
    name: shoe.name,
    brand: getBrandName(shoe.brandId),
    category: shoe.categoryId.replace("cat-", ""),
    type: "",
    price: shoe.oldPrice != null ? shoe.oldPrice : shoe.price,
    salePrice: shoe.oldPrice != null ? shoe.price : undefined,
    rating: shoe.rating,
    ratingCount: shoe.reviewCount,
    colors: shoe.colors.map((c) => c.hex),
  };
}

export const shoeProducts: Product[] = SHOE_PRODUCTS.map(shoeToProduct);

export const allProducts: Product[] = [...products, ...shoeProducts];

export const NEW_ARRIVAL_SLUGS = [
  "coastline-long-sleeve-tee",
  "field-overshirt",
  "velocity-sports-shades",
  "pulse-joggers",
  "heritage-polo-shirt",
  "metro-waxed-jacket",
  "alpine-down-jacket",
  "hoops-signature-3",
  "turbo-sprint-spike",
  "neon-street-slam",
];

export function isNewArrival(slug: string): boolean {
  return NEW_ARRIVAL_SLUGS.includes(slug);
}

export function getNewArrivals(): Product[] {
  return allProducts.filter((p) => isNewArrival(p.slug));
}

export function getDealProducts(): Product[] {
  return allProducts.filter((p) => p.salePrice != null);
}

export const ALL_BRANDS = [
  "Aerowear", "Urban Threads", "Vantage", "Goodthreads", "Northmark",
  "Boulderjeans", "TrailFolk", "Streetline", "Modern Formal", "Ironclad",
  "Cloudline", "Tailor & Oak", "Fieldbound", "Heritage Co", "Horizon",
  "Skyline Eyewear", "Prism", "Verve Eyewear", "Lumen Optics",
  "Nike", "Adidas", "Puma", "New Balance", "Reebok",
];

export const ALL_CATEGORIES = [
  "t-shirts", "pants", "shirts-jackets", "sunglasses",
  "sneakers", "running", "casual", "sports", "high-tops",
];

export const ALL_SIZES = [
  "XS", "S", "M", "L", "XL", "XXL",
  "28", "30", "32", "34", "36",
  "US 7", "US 7.5", "US 8", "US 8.5", "US 9", "US 9.5",
  "US 10", "US 10.5", "US 11", "US 12", "US 13",
];

export const ALL_COLORS = [
  { name: "Black", hex: "#18181b" },
  { name: "White", hex: "#f4f4f5" },
  { name: "Green", hex: "#a3e635" },
  { name: "Gray", hex: "#71717a" },
  { name: "Navy", hex: "#1f2937" },
  { name: "Brown", hex: "#57534e" },
  { name: "Gold", hex: "#cbb26a" },
  { name: "Red", hex: "#ef4444" },
  { name: "Blue", hex: "#3b82f6" },
];

export const PRICE_RANGES = [
  { label: "Under $30", min: 0, max: 30 },
  { label: "$30 - $60", min: 30, max: 60 },
  { label: "$60 - $100", min: 60, max: 100 },
  { label: "$100 - $150", min: 100, max: 150 },
  { label: "Over $150", min: 150, max: Infinity },
];

export const CATEGORY_LABELS: Record<string, string> = {
  "t-shirts": "T-Shirts",
  pants: "Pants",
  "shirts-jackets": "Shirts & Jackets",
  sunglasses: "Sunglasses",
  sneakers: "Sneakers",
  running: "Running",
  casual: "Casual",
  sports: "Sports",
  "high-tops": "High Tops",
};
