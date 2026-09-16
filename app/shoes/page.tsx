import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ShoesHero from "../components/shoes/ShoesHero";
import ShopByBrand from "../components/shoes/ShopByBrand";
import ShoeTypes from "../components/shoes/ShoeTypes";
import ShoeCatalog from "../components/shoes/ShoeCatalog";

export const metadata: Metadata = {
  title: "Shoes — YOURMARKET",
  description:
    "Shop premium sneakers, runners, sports and casual shoes at YOURMARKET. Fresh colorways, bold silhouettes and street-ready build across Nike, Adidas, Puma, New Balance and more.",
};

export default function ShoesPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <ShoesHero />
        <ShopByBrand />
        <ShoeTypes />
        <ShoeCatalog />
      </main>
      <Footer />
    </>
  );
}