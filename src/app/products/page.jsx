import { getAllProducts, getAllCategories } from "@/lib/data/products";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";
import ProductsClient from "./ProductsClient";

export const metadata = {
  title: "Laboratory & Biomedical Equipment Products Catalog | Human Biomedical LLP",
  description:
    "Explore our complete catalog of laboratory instruments, diagnostic analyzers, hospital equipment, pathology reagents, and medical devices supplied across India.",
  alternates: {
    canonical: "https://humanbiomedical.com/products",
  },
  openGraph: {
    title: "Laboratory & Biomedical Equipment Catalog | Human Biomedical LLP",
    description:
      "Explore laboratory instruments, diagnostic analyzers, hospital equipment, and pathology reagents.",
    url: "https://humanbiomedical.com/products",
    siteName: "Human Biomedical LLP",
    type: "website",
  },
};

export default async function ProductsPage({ districtData }) {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductsClient
        initialProducts={products}
        initialCategories={categories}
        districtData={districtData}
      />
    </>
  );
}