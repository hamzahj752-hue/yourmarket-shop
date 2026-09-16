// Row types for the existing Supabase tables used by the customer shop.
// Column names match the established schema; reads stay tolerant of missing
// optional columns via defensive access in the service layer.

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  display_order?: number | null;
  active?: boolean;
};

export type SubcategoryRow = {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  display_order?: number | null;
  active?: boolean;
};

export type BrandRow = {
  id: string;
  name: string;
  slug?: string | null;
  image?: string | null;
};

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  brand_id?: string | null;
  category_id?: string | null;
  subcategory_id?: string | null;
  price: number;
  sale_price?: number | null;
  short_description?: string | null;
  description?: string | null;
  background_display_text?: string | null;
  background_text_style?: string | null;
  background_text_color?: string | null;
  featured?: boolean;
  new_arrival?: boolean;
  deal?: boolean;
  active?: boolean;
  created_at?: string | null;
};

export type ProductVariantRow = {
  id: string;
  product_id: string;
  color_name: string;
  color_value: string;
  image?: string | null;
  transparent_image?: string | null;
  theme_color?: string | null;
  accent_color?: string | null;
  text_color?: string | null;
  display_order?: number | null;
  active?: boolean;
};

export type VariantSizeRow = {
  id: string;
  variant_id: string;
  label: string;
  sku?: string | null;
  stock: number;
};

export type ProductImageRow = {
  id: string;
  product_id: string;
  variant_id?: string | null;
  url: string;
  position?: number | null;
  is_main?: boolean;
};

export type ProfileRow = {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  date_of_birth?: string | null;
};

export type AddressRow = {
  id: string;
  user_id: string;
  label?: string | null;
  full_name?: string | null;
  street?: string | null;
  city?: string | null;
  country?: string | null;
  phone?: string | null;
  is_default?: boolean;
};

export type CartItemRow = {
  id: string;
  user_id: string;
  product_id: string;
  variant_id?: string | null;
  size?: string | null;
  quantity: number;
  created_at?: string | null;
};

export type WishlistItemRow = {
  id: string;
  user_id: string;
  product_id: string;
  created_at?: string | null;
};

export type OrderStatus = string;

export type OrderRow = {
  id: string;
  order_number: string;
  user_id: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  payment_method: string;
  payment_status: string;
  status: string;
  shipping_address?: Record<string, unknown> | null;
  coupon_id?: string | null;
  created_at?: string | null;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string | null;
  product_name: string;
  product_slug: string;
  variant_color_name?: string | null;
  variant_color_value?: string | null;
  image_url?: string | null;
  size?: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
};

export type OrderStatusHistoryRow = {
  id: string;
  order_id: string;
  status: string;
  note?: string | null;
  created_at?: string | null;
};

export type CouponRow = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_order?: number | null;
  max_discount?: number | null;
  usage_limit?: number | null;
  used_count?: number | null;
  start_date?: string | null;
  expiry_date?: string | null;
  active?: boolean;
};

export type NotificationRow = {
  id: string;
  user_id: string;
  title: string;
  message?: string | null;
  read?: boolean;
  created_at?: string | null;
};

// Aggregated shapes the storefront renders (kept compatible with existing UI).
export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  brand_id?: string | null;
  brandName: string;
  category_id?: string | null;
  categorySlug: string;
  categoryName: string;
  subcategory_id?: string | null;
  subcategoryName: string;
  price: number;
  salePrice: number | null;
  shortDescription: string;
  description: string;
  backgroundDisplayText: string;
  backgroundTextStyle: string;
  backgroundTextColor: string;
  featured: boolean;
  newArrival: boolean;
  deal: boolean;
  active: boolean;
  images: string[];
  variants: ShopVariant[];
};

export type ShopVariant = {
  id: string;
  productId: string;
  colorName: string;
  colorValue: string;
  image: string | null;
  themeColor: string | null;
  accentColor: string | null;
  textColor: string | null;
  displayOrder: number;
  sizes: ShopVariantSize[];
};

export type ShopVariantSize = {
  id: string;
  variantId: string;
  label: string;
  sku: string | null;
  stock: number;
};

export type ShopCartLine = {
  id: string;
  productId: string;
  variantId: string;
  size: string | null;
  quantity: number;
  slug: string;
  name: string;
  brandName: string;
  price: number;
  compareAt: number | null;
  colorName: string;
  colorValue: string;
  imageUrl: string | null;
  stock: number;
};