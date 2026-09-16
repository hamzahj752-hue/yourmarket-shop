import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AccountDashboard from "../components/account/AccountDashboard";

export const metadata: Metadata = {
  title: "My Account | YOURMARKET",
  description:
    "Manage your YOURMARKET profile, orders, wishlist, addresses, notifications, coupons and privacy preferences.",
};

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <AccountDashboard />
      </main>
      <Footer />
    </>
  );
}