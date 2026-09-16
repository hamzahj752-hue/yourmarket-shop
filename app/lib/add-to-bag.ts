import {
  addProductToCart,
  getShopProductBySlug,
} from "@/app/lib/shop-service";

/**
 * Resolves a product slug to the real product, matches the colour the user
 * selected on the PDP (by name for shoes, by hex value for premium items) and
 * adds it to the bag with the chosen size and quantity. Returns a friendly
 * error message when the product/colour is missing.
 */
export async function addToBag({
  slug,
  colorName,
  colorValue,
  size,
  quantity,
}: {
  slug: string;
  colorName?: string;
  colorValue?: string;
  size?: string | null;
  quantity?: number;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const product = await getShopProductBySlug(slug);
  if (!product)
    return { ok: false, error: "This product is no longer available." };

  const variant = product.variants.find((v) =>
    colorName ? v.colorName === colorName : v.colorValue === colorValue,
  );
  if (!variant)
    return { ok: false, error: "This product has no available colour." };

  return addProductToCart(product, {
    variantId: variant.id,
    size,
    quantity: Math.max(1, Math.floor(quantity ?? 1)),
  });
}