import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CheckoutView from "../components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout | YOURMARKET",
  description:
    "Complete your YOURMARKET order with contact details, shipping, delivery and payment.",
};

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <CheckoutView />
      </main>
      <Footer />
    </>
  );
}