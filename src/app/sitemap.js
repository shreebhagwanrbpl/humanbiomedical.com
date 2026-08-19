import { getAllProducts, getAllCategories, getAllBrands } from "@/lib/data/products";
import { getAllDistricts } from "@/lib/data/districts";

export const revalidate = 86400; // 24 hours

export default async function sitemap() {
  const baseUrl = "https://humanbiomedical.com";

  try {
    const [products, categories, brands, districts] = await Promise.all([
      getAllProducts(),
      getAllCategories(),
      getAllBrands(),
      getAllDistricts(),
    ]);

    // 1. Static High-Priority Core Pages
    const staticPages = [
      "",
      "/products",
      "/about",
      "/services",
      "/contact",
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: route === "" ? 1.0 : 0.9,
    }));

    // 2. Primary Authoritative Product Pages
    const productUrls = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    // 3. Category Hub Pages
    const categoryUrls = categories.map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // 4. Brand Hub Pages
    const brandUrls = brands.map((brand) => ({
      url: `${baseUrl}/brand/${brand.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    // 5. Verified District Landing Pages
    const districtUrls = districts.map((d) => ({
      url: `${baseUrl}/${d.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    // 6. Verified District Products Catalog Pages
    const districtProductCatalogUrls = districts.map((d) => ({
      url: `${baseUrl}/${d.slug}/products`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [
      ...staticPages,
      ...productUrls,
      ...categoryUrls,
      ...brandUrls,
      ...districtUrls,
      ...districtProductCatalogUrls,
    ];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        priority: 1.0,
      },
    ];
  }
}