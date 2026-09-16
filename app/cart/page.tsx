import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartView from "../components/cart/CartView";

export const metadata: Metadata = {
  title: "Your Cart | YOURMARKET",
  description:
    "Review your YOURMARKET bag, apply promo codes and head to a secure checkout.",
};

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <CartView />
      </main>
      <Footer />
    </>
  );
}