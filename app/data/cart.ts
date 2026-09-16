// Demo cart data for the storefront.
// Later this module is swapped for real user/cart data from Supabase
// (add/remove/quantity persistence, saved-for-later, coupons) without touching the UI.

export type CartColor = { name: string; hex: string };

export type CartLine = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  accent: string;
  price: number;
  compareAt?: number;
  color: CartColor;
  size?: string;
  quantity: number;
};

export type PromoCode = {
  code: string;
  label: string;
  hint: string;
  kind: "percent" | "flat" | "freeship" | "category";
  value: number; // percent (e.g. 15) or flat amount
  minOrder?: number;
  category?: string;
};

// Demo promo codes mirror the coupons shown in Account → Coupons.
export const promoCatalog: PromoCode[] = [
  {
    code: "WELCOME15",
    label: "15% off",
    hint: "15% off your order",
    kind: "percent",
    value: 15,
    minOrder: 75,
  },
  {
    code: "SPRING25",
    label: "25% off outerwear",
    hint: "25% off Shirts & Jackets",
    kind: "category",
    value: 25,
    minOrder: 150,
    category: "shirts-jackets",
  },
  {
    code: "SHIPFREE",
    label: "Free delivery",
    hint: "Free standard delivery",
    kind: "freeship",
    value: 0,
    minOrder: 50,
  },
  {
    code: "RUNNERS10",
    label: "10% off shoes",
    hint: "10% off shoes",
    kind: "category",
    value: 10,
    minOrder: 100,
    category: "shoes",
  },
];

export const TAX_RATE = 0.08;
export const DELIVERY_FEE = 9.95;
export const FREE_DELIVERY_THRESHOLD = 75;

export const demoCart: CartLine[] = [
  {
    id: "line-runner",
    slug: "velocity-runner-x1",
    name: "Velocity Runner X1",
    brand: "Nike",
    category: "shoes",
    accent: "#3b4a1f",
    price: 129,
    compareAt: 159,
    color: { name: "Volt", hex: "#a3e635" },
    size: "US 9.5",
    quantity: 1,
  },
  {
    id: "line-jacket",
    slug: "metro-waxed-jacket",
    name: "Metro Waxed Jacket",
    brand: "Heritage Co",
    category: "shirts-jackets",
    accent: "#3f3f46",
    price: 99.99,
    compareAt: 129.99,
    color: { name: "Graphite", hex: "#3f3f46" },
    size: "L",
    quantity: 1,
  },
  {
    id: "line-tee",
    slug: "gravity-oversized-tee",
    name: "Gravity Oversized Tee",
    brand: "Aerowear",
    category: "t-shirts",
    accent: "#2e2e33",
    price: 24.99,
    compareAt: 34.99,
    color: { name: "Lime", hex: "#a3e635" },
    size: "M",
    quantity: 2,
  },
];