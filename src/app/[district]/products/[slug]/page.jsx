import ProductPage, {
  generateMetadata,
} from "@/app/products/[slug]/page";

export const dynamicParams = true;
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export { generateMetadata };

export default ProductPage;