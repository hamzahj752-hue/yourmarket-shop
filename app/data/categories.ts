export type Category = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  types: string[];
  brands: string[];
  accent: string;
};

export const categories: Category[] = [
  {
    slug: "t-shirts",
    name: "T-Shirts",
    eyebrow: "Everyday essentials",
    description:
      "Premium tees cut for real life. From relaxed oversized silhouettes to sharp polos, find the staple your wardrobe has been waiting for.",
    types: ["Oversized", "Regular Fit", "Graphic", "Polo", "Full Sleeve"],
    brands: ["Aerowear", "Urban Threads", "Vantage", "Goodthreads", "Northmark"],
    accent: "#a3e635",
  },
  {
    slug: "pants",
    name: "Pants",
    eyebrow: "Built to move",
    description:
      "Jeans, cargos, joggers and tailored trousers with premium fabrics and a fit that flatters. Engineered for comfort from boardroom to street.",
    types: ["Jeans", "Cargo", "Joggers", "Formal", "Track Pants"],
    brands: ["Boulderjeans", "TrailFolk", "Streetline", "Modern Formal", "Ironclad"],
    accent: "#a3e635",
  },
  {
    slug: "shirts-jackets",
    name: "Shirts & Jackets",
    eyebrow: "Layers that lead",
    description:
      "From crisp formal shirts to rugged winter outerwear. Build a layer system with pieces that perform and always look the part.",
    types: [
      "Casual Shirts",
      "Formal Shirts",
      "Overshirts",
      "Jackets",
      "Winter Jackets",
    ],
    brands: ["Cloudline", "Tailor & Oak", "Fieldbound", "Heritage Co", "Northmark"],
    accent: "#a3e635",
  },
  {
    slug: "sunglasses",
    name: "Sunglasses",
    eyebrow: "See clearly",
    description:
      "Aviators, wayfarers, sports shades and more. Precision lenses in frames crafted to finish any fit with confidence.",
    types: ["Aviator", "Wayfarer", "Round", "Square", "Sports", "Oversized"],
    brands: ["Lumen Optics", "Skyline Eyewear", "Prism", "Verve Eyewear", "Horizon"],
    accent: "#a3e635",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}