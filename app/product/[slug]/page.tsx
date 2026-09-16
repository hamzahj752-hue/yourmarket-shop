import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ShoeProductDetails from "@/app/components/pdp/ShoeProductDetails";
import PremiumProductDetails from "@/app/components/pdp/PremiumProductDetails";
import { SHOE_PRODUCTS, getBrandName } from "@/app/lib/shoes";
import { products, getProductBySlug, getProductDescription } from "@/app/data/products";

type Props = PageProps<"/product/[slug]">;

export function generateStaticParams() {
  return [
    ...SHOE_PRODUCTS.map((product) => ({ slug: product.slug })),
    ...products.map((product) => ({ slug: product.slug })),
  ];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const shoe = SHOE_PRODUCTS.find((product) => product.slug === slug);
  if (shoe) {
    return {
      title: `${shoe.name} | YOURMARKET`,
      description: `Shop the ${shoe.name} by ${getBrandName(
        shoe.brandId
      )} at YOURMARKET. ${shoe.colors.length} colorways, from $${shoe.price}${
        shoe.oldPrice ? ` (was $${shoe.oldPrice})` : ""
      }. Free shipping and easy returns.`,
    };
  }

  const product = getProductBySlug(slug);
  if (product) {
    return {
      title: `${product.name} | YOURMARKET`,
      description: getProductDescription(product),
    };
  }

  return { title: "Product not found | YOURMARKET" };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const shoe = SHOE_PRODUCTS.find((product) => product.slug === slug);
  if (shoe) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <ShoeProductDetails product={shoe} />
        </main>
        <Footer />
      </>
    );
  }

  const product = getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <PremiumProductDetails product={product} />
      </main>
      <Footer />
    </>
  );
}