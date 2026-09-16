"use server";

import { createClient } from "@/app/lib/supabase/server";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, TAX_RATE } from "@/app/data/cart";
import type { CouponRow } from "@/app/types/shop";

export type OrderLineInput = {
  productId: string;
  variantId: string;
  size: string | null;
  quantity: number;
};

export type OrderAddressInput = {
  addressId?: string;
  label?: string;
  full_name?: string;
  street?: string;
  city?: string;
  country?: string;
  phone?: string;
  is_default?: boolean;
};

export type CreateOrderResult =
  | { ok: true; orderId: string; orderNumber: string }
  | { ok: false; error: string };

const DELIVERY_PRICES: Record<string, number> = {
  standard: DELIVERY_FEE,
  express: 14.95,
  scheduled: 9.95,
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function friendlyStatus(): string {
  return "new";
}

async function findCoupon(code: string): Promise<CouponRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("coupons")
    .select("code,type,value,min_order,max_discount,usage_limit,used_count,start_date,expiry_date,active")
    .ilike("code", code.trim())
    .maybeSingle();
  return (data as CouponRow) ?? null;
}

/**
 * Server-side coupon validation. Never trusts the browser for the final order.
 */
export async function validateCouponCode(
  code: string,
  subtotal: number,
): Promise<{ ok: true; code: string; discount: number } | { ok: false; error: string }> {
  const normalized = code.trim();
  if (!normalized) return { ok: false, error: "Enter a coupon code." };

  const coupon = await findCoupon(normalized);
  if (!coupon) return { ok: false, error: "This coupon code is not valid." };
  if (coupon.active === false) return { ok: false, error: "This coupon has expired." };

  const now = Date.now();
  if (coupon.start_date && new Date(coupon.start_date).getTime() > now) {
    return { ok: false, error: "This coupon is not active yet." };
  }
  if (coupon.expiry_date && new Date(coupon.expiry_date).getTime() < now) {
    return { ok: false, error: "This coupon has expired." };
  }
  if (coupon.min_order && subtotal < coupon.min_order) {
    return {
      ok: false,
      error: `This coupon requires a minimum order of $${coupon.min_order.toFixed(2)}.`,
    };
  }
  if (coupon.usage_limit != null && (coupon.used_count ?? 0) >= coupon.usage_limit) {
    return { ok: false, error: "This coupon has reached its usage limit." };
  }

  const baseDiscount =
    coupon.type === "percentage" ? subtotal * (coupon.value / 100) : coupon.value;
  const discount = round2(coupon.max_discount != null ? Math.min(baseDiscount, coupon.max_discount) : baseDiscount);

  return { ok: true, code: coupon.code, discount };
}

async function decrementStock(
  supabase: Awaited<ReturnType<typeof createClient>>,
  sizeId: string,
  quantity: number,
): Promise<boolean> {
  // Preferred: atomic SQL function (see report for required SQL).
  const rpcResult = await supabase.rpc("decrement_stock", {
    p_variant_size_id: sizeId,
    p_quantity: quantity,
  });
  if (!rpcResult.error) return true;
  if ((rpcResult.error as { code?: string })?.code !== "PGRST202") return false;

  // Fallback: conditional check-then-update (row WHERE is atomic; value is derived
  // from the latest read of this request). A dedicated SQL function is still
  // recommended for fully serialisable decrements.
  const { data: sizeRow } = await supabase
    .from("variant_sizes")
    .select("stock")
    .eq("id", sizeId)
    .maybeSingle();
  if (!sizeRow) return false;
  const current = typeof sizeRow.stock === "number" ? sizeRow.stock : Number(sizeRow.stock ?? 0);
  if (current < quantity) return false;

  const { data: updated } = await supabase
    .from("variant_sizes")
    .update({ stock: current - quantity })
    .eq("id", sizeId)
    .gte("stock", quantity)
    .select("id");
  return (updated ?? []).length === 1;
}

/**
 * Securely creates an order. All prices, stock and coupon values are re-read
 * from the database on the server — the browser contributes nothing authoritative.
 */
export async function createOrder(input: {
  items: OrderLineInput[];
  address: OrderAddressInput;
  deliveryId: string;
  paymentMethod: string;
  couponCode?: string;
}): Promise<CreateOrderResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Please log in to place an order." };
  if (!input.items || input.items.length === 0) {
    return { ok: false, error: "Your bag is empty." };
  }
  if (input.paymentMethod !== "cod") {
    return { ok: false, error: "Only Cash on Delivery is available right now." };
  }
  if (!DELIVERY_PRICES[input.deliveryId]) {
    return { ok: false, error: "Please choose a delivery option." };
  }

  const resolvedLines: {
    productId: string;
    variantId: string;
    size: string | null;
    sizeId: string | null;
    quantity: number;
    unitPrice: number;
    compareAt: number | null;
    name: string;
    slug: string;
    colorName: string;
    colorValue: string;
    imageUrl: string | null;
    lineTotal: number;
  }[] = [];

  for (const item of input.items) {
    const quantity = Math.max(1, Math.floor(item.quantity));

    const { data: product } = await supabase
      .from("products")
      .select("id,name,slug,price,sale_price,active")
      .eq("id", item.productId)
      .maybeSingle();
    if (!product || product.active === false) {
      return { ok: false, error: "A product in your bag is no longer available." };
    }

    const { data: variant } = await supabase
      .from("product_variants")
      .select("id,color_name,color_value,transparent_image,image")
      .eq("id", item.variantId)
      .eq("product_id", product.id)
      .maybeSingle();
    if (!variant) return { ok: false, error: "A product in your bag is missing a colour." };

    let sizeId: string | null = null;
    if (item.size) {
      const { data: sizeRow } = await supabase
        .from("variant_sizes")
        .select("id,label,stock")
        .eq("variant_id", variant.id)
        .eq("label", item.size)
        .maybeSingle();
      if (!sizeRow) return { ok: false, error: "A size in your bag is unavailable." };
      const stock = typeof sizeRow.stock === "number" ? sizeRow.stock : Number(sizeRow.stock ?? 0);
      if (stock < quantity) return { ok: false, error: `Only ${stock} left for ${item.size}.` };
      sizeId = sizeRow.id;
    } else {
      const { data: sizes } = await supabase
        .from("variant_sizes")
        .select("id,stock")
        .eq("variant_id", variant.id);
      const total = (sizes ?? []).reduce((sum, s) => sum + (typeof s.stock === "number" ? s.stock : Number(s.stock ?? 0)), 0);
      if (total < quantity) return { ok: false, error: "A product in your bag is low on stock." };
    }

    const unitPrice =
      product.sale_price != null ? Number(product.sale_price) : Number(product.price);
    const compareAt = product.sale_price != null ? Number(product.price) : null;

    resolvedLines.push({
      productId: product.id,
      variantId: variant.id,
      size: item.size,
      sizeId,
      quantity,
      unitPrice,
      compareAt,
      name: product.name,
      slug: product.slug,
      colorName: variant.color_name,
      colorValue: variant.color_value,
      imageUrl: variant.transparent_image ?? variant.image ?? null,
      lineTotal: round2(unitPrice * quantity),
    });
  }

  const subtotal = round2(resolvedLines.reduce((sum, line) => sum + line.lineTotal, 0));

  let discount = 0;
  if (input.couponCode) {
    const coupon = await validateCouponCode(input.couponCode, subtotal);
    if (!coupon.ok) return coupon;
    discount = coupon.discount;
  }

  const shipping = round2(
    input.deliveryId === "standard" && subtotal - discount >= FREE_DELIVERY_THRESHOLD
      ? 0
      : DELIVERY_PRICES[input.deliveryId],
  );
  const tax = round2((subtotal - discount + shipping) * TAX_RATE);
  const total = round2(subtotal - discount + shipping + tax);

  // Resolve shipping address (existing user-owned row or newly inserted).
  let shippingAddress: Record<string, unknown>;
  if (input.address.addressId) {
    const { data: addr } = await supabase
      .from("addresses")
      .select("label,full_name,street,city,country,phone")
      .eq("id", input.address.addressId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!addr) return { ok: false, error: "Shipping address not found." };
    shippingAddress = addr as Record<string, unknown>;
  } else {
    const missing =
      !input.address.full_name ||
      !input.address.street ||
      !input.address.city ||
      !input.address.country ||
      !input.address.phone;
    if (missing) return { ok: false, error: "Please complete your shipping address." };
    const { data: inserted } = await supabase
      .from("addresses")
      .insert({
        user_id: user.id,
        label: input.address.label ?? "Home",
        full_name: input.address.full_name,
        street: input.address.street,
        city: input.address.city,
        country: input.address.country,
        phone: input.address.phone,
        is_default: input.address.is_default ?? false,
      })
      .select("label,full_name,street,city,country,phone")
      .single();
    if (!inserted) return { ok: false, error: "Could not save your address." };
    shippingAddress = inserted as Record<string, unknown>;
  }

  // Create the order with retry on order-number collision.
  let created: {
    id: string;
    order_number: string;
  } | null = null;

  for (let attempt = 0; attempt < 5 && !created; attempt++) {
    const orderNumber = `YMW-${Math.floor(10000 + Math.random() * 89999)}`;
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        total_amount: total,
        payment_method: "cod",
        payment_status: "pending",
        status: friendlyStatus(),
        shipping_address: shippingAddress,
        created_at: new Date().toISOString(),
      })
      .select("id,order_number")
      .single();
    if (error && (error as { code?: string }).code === "23505") continue;
    if (error || !data) return { ok: false, error: "Could not create your order." };
    created = data;
  }

  if (!created) return { ok: false, error: "Could not create your order. Please try again." };

  const orderId = created.id;
  const orderNumber = created.order_number;

  // Order items (snapshot so history stays correct if products change later).
  for (const line of resolvedLines) {
    const { error } = await supabase.from("order_items").insert({
      order_id: orderId,
      product_id: line.productId,
      variant_id: line.variantId,
      product_name: line.name,
      product_slug: line.slug,
      variant_color_name: line.colorName,
      variant_color_value: line.colorValue,
      image_url: line.imageUrl,
      size: line.size,
      quantity: line.quantity,
      unit_price: line.unitPrice,
      line_total: line.lineTotal,
    });
    if (error) return { ok: false, error: "Could not save your order items." };
  }

  const { error: historyError } = await supabase.from("order_status_history").insert({
    order_id: orderId,
    status: "new",
    note: "Order placed.",
    created_at: new Date().toISOString(),
  });
  if (historyError) return { ok: false, error: "Could not record your order status." };

  // Reduce stock (atomic via RPC when available, guarded fallback otherwise).
  for (const line of resolvedLines) {
    if (!line.sizeId) continue;
    const ok = await decrementStock(supabase, line.sizeId, line.quantity);
    if (!ok) return { ok: false, error: "Stock changed while placing your order. Please review your bag." };
  }

  // Clear the customer's cart.
  await supabase.from("cart_items").delete().eq("user_id", user.id);

  return { ok: true, orderId, orderNumber };
}