import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

const PROJECT_ID = "rajbiosis-central";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

let serverProductsCache = null;
let serverCacheTimestamp = 0;
let activeProductsPromise = null;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes cache

function parseFirestoreFields(fields) {
  const obj = {};
  if (!fields) return obj;
  for (const [key, value] of Object.entries(fields)) {
    if ("stringValue" in value) {
      obj[key] = value.stringValue;
    } else if ("booleanValue" in value) {
      obj[key] = value.booleanValue;
    } else if ("integerValue" in value) {
      obj[key] = parseInt(value.integerValue, 10);
    } else if ("doubleValue" in value) {
      obj[key] = parseFloat(value.doubleValue);
    } else if ("arrayValue" in value) {
      const values = value.arrayValue.values || [];
      obj[key] = values.map((val) => {
        if ("stringValue" in val) return val.stringValue;
        if ("mapValue" in val) return parseFirestoreFields(val.mapValue.fields);
        return val;
      });
    } else if ("mapValue" in value) {
      obj[key] = parseFirestoreFields(value.mapValue.fields);
    }
  }
  return obj;
}

export function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function getAllProducts() {
  const now = Date.now();
  if (serverProductsCache && now - serverCacheTimestamp < CACHE_TTL) {
    return serverProductsCache;
  }

  if (activeProductsPromise) {
    return activeProductsPromise;
  }

  activeProductsPromise = (async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${BASE_URL}/websites/humanbiomedicalcom/pages/products`, {
          next: { revalidate: 1800 },
        }),
        fetch(`${BASE_URL}/websites/humanbiomedicalcom/pages/categoryproducts/categories`, {
          next: { revalidate: 1800 },
        }),
      ]);

      let publishedProducts = [];
      if (prodRes.status === 200) {
        const prodData = await prodRes.json();
        if (prodData.fields) {
          const parsedData = parseFirestoreFields(prodData.fields);
          const allProducts = parsedData.products || [];
          publishedProducts = allProducts
            .filter((item) => item && item.isPublished)
            .map((item) => ({
              ...item,
              slug: item.slug || slugify(item.title),
            }));
        }
      }

      let categoryProducts = [];
      if (catRes.status === 200) {
        const catData = await catRes.json();
        if (catData.documents) {
          const subcategoryPromises = catData.documents.map(async (categoryDoc) => {
            const categoryFields = parseFirestoreFields(categoryDoc.fields);
            const categoryId = categoryDoc.name.split("/").pop();

            try {
              const subRes = await fetch(
                `${BASE_URL}/websites/humanbiomedicalcom/pages/categoryproducts/categories/${categoryId}/subcategories`,
                { next: { revalidate: 1800 } }
              );
              if (subRes.status !== 200) return [];

              const subData = await subRes.json();
              const docs = subData.documents || [];
              const list = [];

              docs.forEach((subDoc) => {
                const subFields = parseFirestoreFields(subDoc.fields);
                (subFields.products || []).forEach((item) => {
                  if (item && item.isPublished) {
                    list.push({
                      ...item,
                      category: categoryFields.category,
                      subCategory: subFields.subCategory,
                      slug: item.slug || slugify(item.title),
                    });
                  }
                });
              });
              return list;
            } catch (err) {
              console.error(`Error fetching subcategories for category ${categoryId}:`, err);
              return [];
            }
          });

          const subcategoryResults = await Promise.all(subcategoryPromises);
          categoryProducts = subcategoryResults.flat();
        }
      }

      const mapBySlug = new Map();
      [...publishedProducts, ...categoryProducts].forEach((item) => {
        if (item.slug && !mapBySlug.has(item.slug)) {
          mapBySlug.set(item.slug, item);
        }
      });

      const uniqueProducts = Array.from(mapBySlug.values());
      serverProductsCache = uniqueProducts;
      serverCacheTimestamp = Date.now();
      return uniqueProducts;
    } catch (error) {
      console.error("Error fetching all products:", error);
      if (serverProductsCache) return serverProductsCache;
      return [];
    } finally {
      activeProductsPromise = null;
    }
  })();

  return activeProductsPromise;
}

export async function getProductBySlug(slug) {
  if (!slug) return null;
  const products = await getAllProducts();
  const decoded = decodeURIComponent(slug).toLowerCase();
  return (
    products.find((item) => {
      const slugMatch = item.slug && item.slug.toLowerCase() === decoded;
      const titleSlugMatch = slugify(item.title) === decoded;
      const titleMatch = item.title && item.title.toLowerCase() === decoded;
      return slugMatch || titleSlugMatch || titleMatch;
    }) || null
  );
}

export async function getAllCategories() {
  const products = await getAllProducts();
  const categoriesMap = new Map();

  products.forEach((product) => {
    const catName = product.category || "General Medical Equipment";
    const catSlug = slugify(catName);
    if (!categoriesMap.has(catSlug)) {
      categoriesMap.set(catSlug, {
        name: catName,
        slug: catSlug,
        count: 1,
        products: [product],
      });
    } else {
      const existing = categoriesMap.get(catSlug);
      existing.count += 1;
      existing.products.push(product);
    }
  });

  return Array.from(categoriesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getAllBrands() {
  const products = await getAllProducts();
  const brandsMap = new Map();

  products.forEach((product) => {
    if (product.brand) {
      const brandName = product.brand.trim();
      const brandSlug = slugify(brandName);
      if (!brandsMap.has(brandSlug)) {
        brandsMap.set(brandSlug, {
          name: brandName,
          slug: brandSlug,
          count: 1,
          products: [product],
        });
      } else {
        const existing = brandsMap.get(brandSlug);
        existing.count += 1;
        existing.products.push(product);
      }
    }
  });

  return Array.from(brandsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}
