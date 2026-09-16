"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import {
  getShopProductBySlug,
  isWishlisted,
  toggleWishlist,
} from "@/app/lib/shop-service";

/**
 * Drives a wishlist heart for a product slug: resolves the slug to a real
 * product id, reflects the current user's saved state, and toggles it on
 * click, redirecting to the login page when signed out.
 */
export function useWishlist(slug: string) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [wished, setWished] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    getShopProductBySlug(slug)
      .then((product) => {
        if (!active || !product) return null;
        return Promise.resolve(isWishlisted(user.id, product.id));
      })
      .then((liked) => {
        if (active && liked !== null) setWished(Boolean(liked));
      })
      .catch(() => {
        if (active) setWished(false);
      });
    return () => {
      active = false;
    };
  }, [user, slug]);

  const toggle = useCallback(async () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname || "/account")}`);
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      const product = await getShopProductBySlug(slug);
      if (!product) return;
      const result = await toggleWishlist(product.id);
      if (result.ok) setWished(result.wished);
    } catch {
      // Ignore transient failures; the heart stays untouched.
    } finally {
      setBusy(false);
    }
  }, [user, slug, busy, pathname, router]);

  return { wished: user ? wished : false, toggle };
}