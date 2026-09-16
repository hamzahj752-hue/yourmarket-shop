import { supabaseClient } from "./supabase/client";
import type {
  AddressRow,
  CartItemRow,
  OrderRow,
  OrderStatusHistoryRow,
  OrderItemRow,
  ProfileRow,
  ProductRow,
  ProductVariantRow,
  ShopCartLine,
  ShopProduct,
  ShopVariant,
  VariantSizeRow,
  WishlistItemRow,
} from "@/app/types/shop";

function toNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value ?? NaN);
  return Number.isFinite(n) ? n : fallback;
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

function aggregateProduct(
  product: ProductRow,
  variants: ProductVariantRow[],
  sizes: VariantSizeRow[],
  images: { variant_id: string | null; url: string }[],
  brandName: string,
  categorySlug: string,
  categoryName: string,
  subcategoryName: string,
): ShopProduct {
  const shopVariants = variants
    .filter((v) => v.active !== false)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((variant) => {
      const variantSizes = sizes
        .filter((s) => s.variant_id === variant.id)
        .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
      return {
        id: variant.id,
        productId: product.id,
        colorName: variant.color_name,
        colorValue: variant.color_value,
        image: variant.transparent_image ?? variant.image ?? null,
        themeColor: variant.theme_color ?? null,
        accentColor: variant.accent_color ?? null,
        textColor: variant.text_color ?? null,
        displayOrder: variant.display_order ?? 0,
        sizes: variantSizes.map((s) => ({
          id: s.id,
          variantId: s.variant_id,
          label: s.label,
          sku: s.sku ?? null,
          stock: toNumber(s.stock),
        })),
      };
    });

  const variantImages = images.filter((img) => img.variant_id !== null);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand_id: product.brand_id ?? null,
    brandName,
    category_id: product.category_id ?? null,
    categorySlug,
    categoryName,
    subcategory_id: product.subcategory_id ?? null,
    subcategoryName,
    price: toNumber(product.price),
    salePrice: product.sale_price != null ? toNumber(product.sale_price) : null,
    shortDescription: product.short_description ?? product.description ?? "",
    description: product.description ?? "",
    backgroundDisplayText:
      product.background_display_text ?? product.name.split(" ")[0].toUpperCase(),
    backgroundTextStyle: product.background_text_style ?? "bold",
    backgroundTextColor: product.background_text_color ?? "",
    featured: product.featured === true,
    newArrival: product.new_arrival === true,
    deal: product.deal === true,
    active: product.active !== false,
    images: variantImages.map((img) => img.url),
    variants: shopVariants,
  };
}

async function fetchProductAggregate(column: "slug" | "id", value: string): Promise<ShopProduct | null> {
  const { data: product, error } = await supabaseClient
    .from("products")
    .select("*")
    .eq(column, value)
    .maybeSingle();

  if (error || !product) return null;
  if (product.active === false) return null;

  const pid = product.id as string;
  const { data: variants } = await supabaseClient
    .from("product_variants")
    .select("*")
    .eq("product_id", pid)
    .order("display_order", { ascending: true });
  const variantIds = (variants ?? []).map((v) => v.id as string);
  const variantIdList = variantIds.length > 0 ? variantIds : ["__none__"];

  const [{ data: sizes }, { data: images }, { data: brand }, { data: category }, { data: subcategory }] =
    await Promise.all([
      supabaseClient
        .from("variant_sizes")
        .select("*")
        .in("variant_id", variantIdList),
      supabaseClient
        .from("product_images")
        .select("id,variant_id,url")
        .eq("product_id", pid)
        .order("position", { ascending: true }),
      product.brand_id
        ? supabaseClient.from("brands").select("name").eq("id", product.brand_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      product.category_id
        ? supabaseClient.from("categories").select("name,slug").eq("id", product.category_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      product.subcategory_id
        ? supabaseClient.from("subcategories").select("name").eq("id", product.subcategory_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]);

  return aggregateProduct(
    product as ProductRow,
    (variants ?? []) as ProductVariantRow[],
    (sizes ?? []) as VariantSizeRow[],
    (images ?? []) as { variant_id: string | null; url: string }[],
    brand?.name ?? "",
    (category?.slug as string) ?? "",
    (category?.name as string) ?? "",
    (subcategory?.name as string) ?? "",
  );
}

export async function getShopProductBySlug(slug: string): Promise<ShopProduct | null> {
  return fetchProductAggregate("slug", slug);
}

export async function getShopProductById(id: string): Promise<ShopProduct | null> {
  return fetchProductAggregate("id", id);
}

/** Available stock total for a variant (sum of its size rows). */
export function variantTotalStock(variant: ShopVariant): number {
  if (variant.sizes.length === 0) return 0;
  return variant.sizes.reduce((sum, size) => sum + toNumber(size.stock), 0);
}

/** Stock for a specific size label, or 0 when the size is unavailable. */
export function variantSizeStock(variant: ShopVariant, label: string | null): number {
  if (!label) return variantTotalStock(variant);
  const size = variant.sizes.find((s) => s.label === label);
  return size ? toNumber(size.stock) : 0;
}

/**
 * Adds a fully-aggregated product to the bag, picking the requested (or first
 * available) variant and size so callers don't need to resolve them themselves.
 */
export async function addProductToCart(
  product: ShopProduct,
  options: { variantId?: string; size?: string | null; quantity?: number } = {},
): Promise<{ ok: true } | { ok: false; error: string }> {
  const variant = product.variants.find((v) => v.id === options.variantId) ?? product.variants[0];
  if (!variant) return { ok: false, error: "This product has no available colour." };
  const size = options.size !== undefined ? options.size : firstAvailableSize(variant);
  return addToCart({
    productId: product.id,
    variantId: variant.id,
    size,
    quantity: Math.max(1, Math.floor(options.quantity ?? 1)),
  });
}

/**
 * First size label for a variant: the first in-stock size, or the first size
 * when stock is unavailable, or null when the variant has no sizes.
 */
export function firstAvailableSize(variant: ShopVariant): string | null {
  const inStock = variant.sizes.find((s) => toNumber(s.stock) > 0);
  return inStock?.label ?? (variant.sizes.length > 0 ? variant.sizes[0].label : null);
}

/* ------------------------------------------------------------------ */
/* Cart                                                                */
/* ------------------------------------------------------------------ */

export async function fetchCart(userId?: string | null): Promise<ShopCartLine[]> {
  const cart: ShopCartLine[] = [];
  if (!userId) return cart;

  const { data: items } = await supabaseClient
    .from("cart_items")
    .select("*")
    .eq("user_id", userId);

  if (!items) return cart;

  for (const item of items as CartItemRow[]) {
    const product = await getShopProductById(item.product_id);
    if (!product) continue;
    const variant =
      product.variants.find((v) => v.id === item.variant_id) ??
      product.variants[0];
    if (!variant) continue;

    const size = variant.sizes.find((s) => s.label === item.size);
    const stock = item.size
      ? variantSizeStock(variant, item.size)
      : variantTotalStock(variant);

    cart.push({
      id: item.id,
      productId: product.id,
      variantId: variant.id,
      size: item.size ?? null,
      quantity: toNumber(item.quantity, 1),
      slug: product.slug,
      name: product.name,
      brandName: product.brandName,
      price: product.salePrice ?? product.price,
      compareAt: product.salePrice ? product.price : null,
      colorName: variant.colorName,
      colorValue: variant.colorValue,
      imageUrl:
        variant.image ??
        product.images[0] ??
        (size?.sku ? null : null),
      stock,
    });
  }

  return cart;
}

export async function addToCart(input: {
  productId: string;
  variantId: string;
  size: string | null;
  quantity: number;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user) return { ok: false, error: "Please log in to add items to your bag." };

  const product = await getShopProductById(input.productId);
  if (!product) return { ok: false, error: "This product is no longer available." };

  const variant = product.variants.find((v) => v.id === input.variantId);
  if (!variant) return { ok: false, error: "Please choose a color." };

  const stock = input.size
    ? variantSizeStock(variant, input.size)
    : variantTotalStock(variant);
  if (stock <= 0) return { ok: false, error: "This item is out of stock." };

  const wanted = Math.max(1, Math.floor(input.quantity));
  if (variant.sizes.length > 0 && !input.size) {
    return { ok: false, error: "Please choose a size." };
  }

  let existingQuery = supabaseClient
    .from("cart_items")
    .select("id,quantity")
    .eq("user_id", user.id)
    .eq("product_id", input.productId)
    .eq("variant_id", input.variantId);
  existingQuery = input.size
    ? existingQuery.eq("size", input.size)
    : existingQuery.is("size", null);
  const { data: existing } = await existingQuery.maybeSingle();

  const target = toNumber(existing?.quantity, 0) + wanted;
  const capped = Math.min(target, stock);

  if (existing) {
    const { error } = await supabaseClient
      .from("cart_items")
      .update({ quantity: capped })
      .eq("id", existing.id);
    if (error) return { ok: false, error: "Could not update your bag." };
  } else {
    const { error } = await supabaseClient.from("cart_items").insert({
      user_id: user.id,
      product_id: input.productId,
      variant_id: input.variantId,
      size: input.size ?? null,
      quantity: capped,
    });
    if (error) return { ok: false, error: "Could not add this item to your bag." };
  }

  return { ok: true };
}

export async function updateCartItemQuantity(
  userId: string,
  cartItemId: string,
  quantity: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const qty = Math.max(1, Math.floor(quantity));

  const { data: item } = await supabaseClient
    .from("cart_items")
    .select("*")
    .eq("id", cartItemId)
    .eq("user_id", userId)
    .single();

  if (!item) return { ok: false, error: "Item not found." };

  const product = await getShopProductById(item.product_id);
  if (!product) return { ok: false, error: "Product is no longer available." };

  const variant = product.variants.find((v) => v.id === item.variant_id);
  if (!variant) return { ok: false, error: "Variant not found." };

  const stock = item.size
    ? variantSizeStock(variant, item.size)
    : variantTotalStock(variant);
  const capped = Math.min(qty, stock);
  if (capped <= 0) return { ok: false, error: "Out of stock." };

  const { error } = await supabaseClient
    .from("cart_items")
    .update({ quantity: capped })
    .eq("id", cartItemId)
    .eq("user_id", userId);
  if (error) return { ok: false, error: "Could not update quantity." };

  return { ok: true };
}

export async function removeCartItem(
  userId: string,
  cartItemId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { error } = await supabaseClient
    .from("cart_items")
    .delete()
    .eq("id", cartItemId)
    .eq("user_id", userId);
  if (error) return { ok: false, error: "Could not remove this item." };
  return { ok: true };
}

export async function clearUserCart(userId: string): Promise<void> {
  await supabaseClient.from("cart_items").delete().eq("user_id", userId);
}

/* ------------------------------------------------------------------ */
/* Wishlist                                                            */
/* ------------------------------------------------------------------ */

export async function fetchWishlist(userId?: string | null) {
  const items: {
    id: string;
    productId: string;
    slug: string;
    name: string;
    brandName: string;
    price: number;
    salePrice: number | null;
    accent: string;
    stockTotal: number;
    image: string | null;
  }[] = [];

  if (!userId) return items;

  const { data: rows } = await supabaseClient
    .from("wishlist_items")
    .select("id,product_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!rows) return items;

  for (const row of rows as WishlistItemRow[]) {
    const product = await getShopProductById(row.product_id);
    if (!product) continue;
    const variant = product.variants[0];
    items.push({
      id: row.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brandName: product.brandName,
      price: toNumber(product.price),
      salePrice: product.salePrice,
      accent: variant?.colorValue ?? "#a3e635",
      stockTotal: variant ? variantTotalStock(variant) : 0,
      image: variant?.image ?? product.images[0] ?? null,
    });
  }

  return items;
}

export async function isWishlisted(userId: string | null | undefined, productId: string): Promise<boolean> {
  if (!userId) return false;
  const { data } = await supabaseClient
    .from("wishlist_items")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();
  return Boolean(data);
}

export async function toggleWishlist(
  productId: string,
): Promise<{ ok: true; wished: boolean } | { ok: false; error: string }> {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user) return { ok: false, error: "Please log in to save items." };

  const { data: existing } = await supabaseClient
    .from("wishlist_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabaseClient
      .from("wishlist_items")
      .delete()
      .eq("id", existing.id);
    if (error) return { ok: false, error: "Could not remove from wishlist." };
    return { ok: true, wished: false };
  }

  const { error } = await supabaseClient.from("wishlist_items").insert({
    user_id: user.id,
    product_id: productId,
  });
  if (error) return { ok: false, error: "Could not add to wishlist." };
  return { ok: true, wished: true };
}

export async function removeWishlistItem(
  userId: string,
  wishlistItemId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { error } = await supabaseClient
    .from("wishlist_items")
    .delete()
    .eq("id", wishlistItemId)
    .eq("user_id", userId);
  if (error) return { ok: false, error: "Could not remove item." };
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

export async function fetchProfile(userId: string) {
  const { data } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return data as ProfileRow | null;
}

export async function upsertProfile(profile: Partial<ProfileRow>) {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user) return { ok: false as const, error: "Please log in." };
  const { error } = await supabaseClient
    .from("profiles")
    .upsert({ id: user.id, ...profile });
  return error
    ? ({ ok: false as const, error: "Could not save your profile." } as const)
    : ({ ok: true as const } as const);
}

/* ------------------------------------------------------------------ */
/* Addresses                                                           */
/* ------------------------------------------------------------------ */

export async function fetchAddresses(userId: string) {
  const { data } = await supabaseClient
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false });
  return (data ?? []) as AddressRow[];
}

export async function upsertAddress(
  userId: string,
  input: Partial<AddressRow> & { id?: string },
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const isNew = !input.id;

  if (input.is_default) {
    await supabaseClient
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", userId)
      .neq("id", input.id ?? "00000000-0000-0000-0000-000000000000");
  }

  if (isNew) {
    const { data, error } = await supabaseClient
      .from("addresses")
      .insert({
        user_id: userId,
        label: input.label ?? "Home",
        full_name: input.full_name ?? "",
        street: input.street ?? "",
        city: input.city ?? "",
        country: input.country ?? "",
        phone: input.phone ?? "",
        is_default: input.is_default ?? false,
      })
      .select("id")
      .single();
    if (error || !data) return { ok: false, error: "Could not save your address." };
    return { ok: true, id: data.id };
  }

  const addressId = input.id;
  if (!addressId) return { ok: false, error: "Address is missing." };

  const { error } = await supabaseClient
    .from("addresses")
    .update({
      label: input.label ?? "Home",
      full_name: input.full_name ?? "",
      street: input.street ?? "",
      city: input.city ?? "",
      country: input.country ?? "",
      phone: input.phone ?? "",
      is_default: input.is_default ?? false,
    })
    .eq("id", addressId)
    .eq("user_id", userId);
  if (error) return { ok: false, error: "Could not save your address." };
  return { ok: true, id: addressId };
}

export async function deleteAddress(
  userId: string,
  addressId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { error } = await supabaseClient
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", userId);
  if (error) return { ok: false, error: "Could not delete this address." };
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Orders (read side)                                                  */
/* ------------------------------------------------------------------ */

export type ShopOrder = {
  order: OrderRow;
  items: OrderItemRow[];
  history: OrderStatusHistoryRow[];
};

export async function fetchOrders(userId: string) {
  const { data } = await supabaseClient
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []) as OrderRow[];
}

export async function fetchOrderById(userId: string, orderId: string): Promise<ShopOrder | null> {
  const { data: order } = await supabaseClient
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!order) return null;

  const [{ data: items }, { data: history }] = await Promise.all([
    supabaseClient.from("order_items").select("*").eq("order_id", orderId).order("id"),
    supabaseClient.from("order_status_history").select("*").eq("order_id", orderId).order("created_at", { ascending: true }),
  ]);

  return {
    order: order as OrderRow,
    items: (items ?? []) as OrderItemRow[],
    history: (history ?? []) as OrderStatusHistoryRow[],
  };
}