import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import CategoryView from "@/app/components/catalog/CategoryView";
import { categories, getCategory } from "@/app/data/categories";
import { getProductsByCategory } from "@/app/data/products";

type Props = PageProps<"/category/[slug]">;

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) {
    return { title: "Category not found | YOURMARKET" };
  }
  return {
    title: `${category.name} | YOURMARKET`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) {
    notFound();
  }

  const products = getProductsByCategory(category.slug);

  return (
    <>
      <Header />
      <main className="flex-1">
        <CategoryView category={category} products={products} />
      </main>
      <Footer />
    </>
  );
}