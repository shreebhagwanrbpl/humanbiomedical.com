import ProductPage, {
  generateMetadata,
} from "@/app/products/[slug]/page";
import { getAllProducts } from "@/lib/data/products";
import { getAllDistricts } from "@/lib/data/districts";

export async function generateStaticParams() {
  const [products, districts] = await Promise.all([
    getAllProducts(),
    getAllDistricts(),
  ]);

  const paths = [];
  // Generate top 20 districts x products for static params to optimize build speed while allowing dynamic SSR for remainder
  const topDistricts = districts.slice(0, 20);
  for (const d of topDistricts) {
    for (const p of products) {
      paths.push({
        district: d.slug,
        slug: p.slug,
      });
    }
  }
  return paths;
}

export { generateMetadata };

export default ProductPage;