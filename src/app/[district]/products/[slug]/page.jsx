import ProductPage, {
  generateMetadata,
} from "@/app/products/[slug]/page";

export const dynamicParams = true;
export const revalidate = 3600;

export { generateMetadata };

export default ProductPage;