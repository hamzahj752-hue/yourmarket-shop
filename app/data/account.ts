// All demo account data lives here.
// Later this module is swapped for real authenticated customer data from Supabase
// (orders, wishlist, addresses, notifications, coupons, profile) without touching the UI.

export type AccountCustomer = {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  joined: string;
};

export const demoCustomer: AccountCustomer = {
  name: "Alex Morgan",
  email: "alex.morgan@yourmarket.com",
  phone: "+1 (555) 014-2280",
  dateOfBirth: "1994-06-18",
  gender: "Prefer not to say",
  joined: "March 2023",
};

export type AddressKind = "Home" | "Work" | "Other";

export type DemoAddress = {
  id: string;
  kind: AddressKind;
  label: string;
  fullName?: string;
  street: string;
  city: string;
  country: string;
  isDefault: boolean;
};

export const demoAddresses: DemoAddress[] = [
  {
    id: "a1",
    kind: "Home",
    label: "Home",
    fullName: "Alex Morgan",
    street: "842 Juniper Lane",
    city: "Portland, OR 97205",
    country: "United States",
    isDefault: true,
  },
  {
    id: "a2",
    kind: "Work",
    label: "Studio",
    fullName: "Alex Morgan",
    street: "2100 Meridian Tower, Fl 14",
    city: "Portland, OR 97209",
    country: "United States",
    isDefault: false,
  },
];

export type OrderStatus = "Delivered" | "Processing" | "Shipped" | "Cancelled";

export type PaymentStatus = "Paid" | "Pending" | "Refunded";

// The canonical order journey used by the tracker and the timeline.
export const DELIVERY_STEPS = [
  "Ordered",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
] as const;

export type OrderItem = {
  slug: string;
  name: string;
  brand: string;
  quantity: number;
  accent: string;
  color?: string;
  size?: string;
  unitPrice: number;
};

export type OrderEvent = {
  id: string;
  label: string;
  completed: boolean;
  cancelled?: boolean;
  timestamp?: string;
  description?: string;
};

export type TrackingInfo = {
  courier: string;
  trackingNumber: string;
  status: string;
  estimatedDelivery: string;
  lastUpdate: string;
  lastLocation: string;
};

export type DemoOrder = {
  id: string;
  date: string;
  placedAt: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  orderStatus: OrderStatus;
  /** Index into DELIVERY_STEPS that marks the furthest reached step. */
  progressIndex: number;
  timeline: OrderEvent[];
  tracking?: TrackingInfo;
  shippingAddress: DemoAddress;
};

export const demoOrders: DemoOrder[] = [
  {
    id: "YM-10482",
    date: "Aug 28, 2026",
    placedAt: "Aug 28, 2026 · 10:42 AM",
    items: [
      {
        slug: "polar-parka",
        name: "Polar Parka",
        brand: "Northmark",
        quantity: 1,
        accent: "#52525b",
        color: "Zinc",
        size: "M",
        unitPrice: 149.99,
      },
    ],
    subtotal: 149.99,
    discount: 0,
    shipping: 0,
    tax: 12.0,
    total: 161.99,
    paymentStatus: "Paid",
    paymentMethod: "Visa •••• 4242",
    orderStatus: "Delivered",
    progressIndex: 5,
    timeline: [
      { id: "t1", label: "Order Placed", completed: true, timestamp: "Aug 28, 2026 · 10:42 AM", description: "Order received and payment authorised." },
      { id: "t2", label: "Confirmed", completed: true, timestamp: "Aug 28, 2026 · 11:05 AM", description: "Stock secured and order confirmed by email." },
      { id: "t3", label: "Processing", completed: true, timestamp: "Aug 29, 2026 · 8:16 AM", description: "Your items are packed and quality checked." },
      { id: "t4", label: "Shipped", completed: true, timestamp: "Aug 29, 2026 · 5:40 PM", description: "Handed to YOURMARKET Express for delivery." },
      { id: "t5", label: "Out for Delivery", completed: true, timestamp: "Sep 1, 2026 · 7:58 AM", description: "On the way to your delivery address." },
      { id: "t6", label: "Delivered", completed: true, timestamp: "Sep 1, 2026 · 2:12 PM", description: "Delivered and signed for. Enjoy!" },
    ],
    tracking: {
      courier: "YOURMARKET Express",
      trackingNumber: "YM1Z84A02K9",
      status: "Delivered",
      estimatedDelivery: "Sep 1, 2026",
      lastUpdate: "Sep 1, 2026 · 2:12 PM",
      lastLocation: "Portland, OR 97205",
    },
    shippingAddress: demoAddresses[0],
  },
  {
    id: "YM-10396",
    date: "Jul 12, 2026",
    placedAt: "Jul 12, 2026 · 4:20 PM",
    items: [
      {
        slug: "velocity-runner-x1",
        name: "Velocity Runner X1",
        brand: "Nike",
        quantity: 1,
        accent: "#3b4a1f",
        color: "Volt",
        size: "US 9.5",
        unitPrice: 129,
      },
    ],
    subtotal: 129,
    discount: 0,
    shipping: 0,
    tax: 10.32,
    total: 139.32,
    paymentStatus: "Paid",
    paymentMethod: "PayPal",
    orderStatus: "Shipped",
    progressIndex: 3,
    timeline: [
      { id: "t1", label: "Order Placed", completed: true, timestamp: "Jul 12, 2026 · 4:20 PM", description: "Order received and payment authorised." },
      { id: "t2", label: "Confirmed", completed: true, timestamp: "Jul 12, 2026 · 4:38 PM", description: "Stock secured and order confirmed by email." },
      { id: "t3", label: "Processing", completed: true, timestamp: "Jul 13, 2026 · 9:10 AM", description: "Your items are packed and quality checked." },
      { id: "t4", label: "Shipped", completed: true, timestamp: "Jul 14, 2026 · 6:02 PM", description: "Handed to FedEx for delivery." },
      { id: "t5", label: "Out for Delivery", completed: false, timestamp: undefined, description: "Tracking will update once your parcel is on the van." },
      { id: "t6", label: "Delivered", completed: false, timestamp: undefined, description: "Your order will be delivered soon." },
    ],
    tracking: {
      courier: "FedEx",
      trackingNumber: "FDX7721908452",
      status: "In transit",
      estimatedDelivery: "Jul 17, 2026",
      lastUpdate: "Jul 15, 2026 · 9:05 AM",
      lastLocation: "Sacramento, CA",
    },
    shippingAddress: demoAddresses[1],
  },
  {
    id: "YM-10215",
    date: "May 03, 2026",
    placedAt: "May 03, 2026 · 12:04 PM",
    items: [
      {
        slug: "gravity-oversized-tee",
        name: "Gravity Oversized Tee",
        brand: "Aerowear",
        quantity: 2,
        accent: "#2e2e33",
        color: "Lime",
        size: "M",
        unitPrice: 24.99,
      },
    ],
    subtotal: 49.98,
    discount: 0,
    shipping: 0,
    tax: 4.0,
    total: 53.98,
    paymentStatus: "Refunded",
    paymentMethod: "Visa •••• 4242",
    orderStatus: "Cancelled",
    progressIndex: 2,
    timeline: [
      { id: "t1", label: "Order Placed", completed: true, timestamp: "May 03, 2026 · 12:04 PM", description: "Order received and payment authorised." },
      { id: "t2", label: "Confirmed", completed: true, timestamp: "May 03, 2026 · 12:22 PM", description: "Stock secured and order confirmed by email." },
      { id: "t3", label: "Processing", completed: true, timestamp: "May 04, 2026 · 8:31 AM", description: "Requested cancellation before dispatch." },
      { id: "t4", label: "Cancelled", completed: true, cancelled: true, timestamp: "May 04, 2026 · 9:47 AM", description: "Order cancelled and fully refunded." },
    ],
    shippingAddress: demoAddresses[0],
  },
  {
    id: "YM-10107",
    date: "Mar 19, 2026",
    placedAt: "Mar 19, 2026 · 3:37 PM",
    items: [
      {
        slug: "field-overshirt",
        name: "Field Overshirt",
        brand: "Fieldbound",
        quantity: 1,
        accent: "#46331f",
        color: "Umber",
        size: "L",
        unitPrice: 74.99,
      },
      {
        slug: "court-classic-90",
        name: "Court Classic 90",
        brand: "Adidas",
        quantity: 1,
        accent: "#1e3a8a",
        color: "Navy",
        size: "US 10",
        unitPrice: 98,
      },
    ],
    subtotal: 172.99,
    discount: 0,
    shipping: 0,
    tax: 13.84,
    total: 186.83,
    paymentStatus: "Pending",
    paymentMethod: "Cash on Delivery",
    orderStatus: "Processing",
    progressIndex: 2,
    timeline: [
      { id: "t1", label: "Order Placed", completed: true, timestamp: "Mar 19, 2026 · 3:37 PM", description: "Order received. Payment due on delivery." },
      { id: "t2", label: "Confirmed", completed: true, timestamp: "Mar 19, 2026 · 3:56 PM", description: "Stock secured and order confirmed by email." },
      { id: "t3", label: "Processing", completed: true, timestamp: "Mar 20, 2026 · 8:14 AM", description: "Your items are being packed and quality checked." },
      { id: "t4", label: "Shipped", completed: false, timestamp: undefined, description: "Tracking will appear once your parcel is dispatched." },
      { id: "t5", label: "Out for Delivery", completed: false, timestamp: undefined, description: "Tracking will update once your parcel is on the van." },
      { id: "t6", label: "Delivered", completed: false, timestamp: undefined, description: "Your order will be delivered soon." },
    ],
    shippingAddress: demoAddresses[0],
  },
];

export function getDemoOrder(id: string): DemoOrder | undefined {
  return demoOrders.find((order) => order.id === id);
}

export type DemoWishlistItem = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  salePrice?: number;
  stock: { status: "In stock" | "Low stock" | "Out of stock"; count: number };
  accent: string;
};

export const demoWishlist: DemoWishlistItem[] = [
  {
    id: "w1",
    slug: "polar-parka",
    name: "Polar Parka",
    brand: "Northmark",
    price: 149.99,
    stock: { status: "In stock", count: 12 },
    accent: "#52525b",
  },
  {
    id: "w2",
    slug: "velocity-runner-x1",
    name: "Velocity Runner X1",
    brand: "Nike",
    price: 129.0,
    salePrice: 116.0,
    stock: { status: "Low stock", count: 3 },
    accent: "#3b4a1f",
  },
  {
    id: "w3",
    slug: "gravity-oversized-tee",
    name: "Gravity Oversized Tee",
    brand: "Aerowear",
    price: 34.99,
    salePrice: 24.99,
    stock: { status: "In stock", count: 28 },
    accent: "#2e2e33",
  },
  {
    id: "w4",
    slug: "metro-waxed-jacket",
    name: "Metro Waxed Jacket",
    brand: "Heritage Co",
    price: 129.99,
    salePrice: 99.99,
    stock: { status: "Out of stock", count: 0 },
    accent: "#46331f",
  },
];

export type NotificationKind = "order" | "delivery" | "promotion" | "stock";

export type DemoNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
};

export const demoNotifications: DemoNotification[] = [
  {
    id: "n1",
    kind: "order",
    title: "Order confirmed",
    message: "Your order #YM-10482 has been confirmed and is being prepared.",
    timestamp: "Aug 28, 2026 · 10:42 AM",
    read: false,
  },
  {
    id: "n2",
    kind: "delivery",
    title: "Out for delivery",
    message: "Your Velocity Runner X1 is out for delivery today.",
    timestamp: "Aug 30, 2026 · 8:15 AM",
    read: false,
  },
  {
    id: "n3",
    kind: "stock",
    title: "Back in stock",
    message: "Gravity Oversized Tee — size M is back in stock.",
    timestamp: "Aug 26, 2026 · 4:03 PM",
    read: true,
  },
  {
    id: "n4",
    kind: "promotion",
    title: "Members-only drop",
    message: "Up to 25% off premium outerwear. Ends tonight.",
    timestamp: "Aug 21, 2026 · 9:00 AM",
    read: true,
  },
  {
    id: "n5",
    kind: "order",
    title: "Refund issued",
    message: "Your refund for order #YM-10215 has been issued to your original payment method.",
    timestamp: "Aug 02, 2026 · 2:30 PM",
    read: true,
  },
];

export type DemoCoupon = {
  id: string;
  code: string;
  discount: string;
  minOrder: string;
  category: string;
  expiry: string;
};

export const demoCoupons: DemoCoupon[] = [
  {
    id: "c1",
    code: "WELCOME15",
    discount: "15% off",
    minOrder: "Min. order $75",
    category: "Storewide",
    expiry: "Dec 31, 2026",
  },
  {
    id: "c2",
    code: "SPRING25",
    discount: "25% off",
    minOrder: "Min. order $150",
    category: "Outerwear",
    expiry: "Sep 30, 2026",
  },
  {
    id: "c3",
    code: "SHIPFREE",
    discount: "Free shipping",
    minOrder: "Min. order $50",
    category: "Storewide",
    expiry: "Oct 15, 2026",
  },
  {
    id: "c4",
    code: "RUNNERS10",
    discount: "10% off",
    minOrder: "Min. order $100",
    category: "Shoes",
    expiry: "Nov 20, 2026",
  },
];

export type HelpArticle = {
  id: string;
  category: string;
  title: string;
  description: string;
};

export const helpArticles: HelpArticle[] = [
  {
    id: "h1",
    category: "Orders & Delivery",
    title: "How long does delivery take?",
    description: "Standard delivery takes 3–5 business days. Express options ship within 24 hours.",
  },
  {
    id: "h2",
    category: "Orders & Delivery",
    title: "Can I track my order?",
    description: "Track any order from the My Orders section. You'll receive shipping alerts by email.",
  },
  {
    id: "h3",
    category: "Returns & Refunds",
    title: "What is your return policy?",
    description: "Free returns within 30 days of delivery, no questions asked. Refunds are issued within 5–7 days.",
  },
  {
    id: "h4",
    category: "Returns & Refunds",
    title: "How do I start a return?",
    description: "Open the order in My Orders and select 'Return items' to generate your return label.",
  },
  {
    id: "h5",
    category: "Payments",
    title: "Which payment methods are accepted?",
    description: "We accept all major credit cards, PayPal, Apple Pay and Google Pay.",
  },
  {
    id: "h6",
    category: "Payments",
    title: "Why was my payment declined?",
    description: "Check your card limit, billing address, or contact your bank. Re-try up to 3 times.",
  },
  {
    id: "h7",
    category: "Account",
    title: "How do I change my email address?",
    description: "Update your email anytime from My Profile. We'll verify the new address for security.",
  },
  {
    id: "h8",
    category: "Account",
    title: "How do I manage notifications?",
    description: "Choose what you hear about — orders, delivery updates, promotions and stock alerts.",
  },
];