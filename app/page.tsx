import Header from "./components/Header";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import ShopByCategory from "./components/ShopByCategory";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Benefits />
        <ShopByCategory />
      </main>
      <Footer />
    </>
  );
}