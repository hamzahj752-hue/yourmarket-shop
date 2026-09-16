"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import { supabaseClient } from "@/app/lib/supabase/client";

type ShopContextValue = {
  cartCount: number;
  wishlistCount: number;
  refreshCounts: () => Promise<void>;
};

const ShopContext = createContext<ShopContextValue>({
  cartCount: 0,
  wishlistCount: 0,
  refreshCounts: async () => {},
});

export function ShopProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const refreshCounts = useCallback(async () => {
    if (!user) {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }
    const [cart, wish] = await Promise.all([
      supabaseClient
        .from("cart_items")
        .select("quantity", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabaseClient
        .from("wishlist_items")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);
    const totalQuantity = (cart.data ?? []).reduce(
      (sum, item) => sum + (typeof item.quantity === "number" ? item.quantity : 0),
      0,
    );
    setCartCount(totalQuantity);
    setWishlistCount(wish.count ?? 0);
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshCounts();
  }, [refreshCounts]);

  return (
    <ShopContext.Provider value={{ cartCount, wishlistCount, refreshCounts }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShopCounts() {
  return useContext(ShopContext);
}