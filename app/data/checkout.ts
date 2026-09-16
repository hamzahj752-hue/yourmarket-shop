// Checkout configuration for the storefront.
// Order creation runs through the server action `createOrder`,
// which inserts real orders into Supabase. Delivery time estimates
// are approximate until live carrier quotes are wired up.

export type DeliveryMethod = {
  id: string;
  label: string;
  description: string;
  eta: string;
  price: number;
};

export const deliveryMethods: DeliveryMethod[] = [
  {
    id: "standard",
    label: "Standard",
    description: "Free over $75 · 3–5 business days",
    eta: "Arrives in 3–5 business days",
    price: 0,
  },
  {
    id: "express",
    label: "Express",
    description: "1–2 business days",
    eta: "Arrives in 1–2 business days",
    price: 14.95,
  },
  {
    id: "scheduled",
    label: "Scheduled",
    description: "Pick your delivery day",
    eta: "Choose a 4-hour delivery window",
    price: 9.95,
  },
];

export type PaymentMethod = {
  id: string;
  label: string;
  description: string;
  available: boolean;
  note?: string;
};

export const paymentMethods: PaymentMethod[] = [
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay when your order arrives at your door.",
    available: true,
  },
  {
    id: "online",
    label: "Online Payment",
    description: "Credit card, PayPal, Apple Pay and Google Pay.",
    available: false,
    note: "Online payments arrive with our payment provider integration.",
  },
];

export const TAX_RATE = 0.08;

export const formatMoney = (value: number) => `$${value.toFixed(2)}`;