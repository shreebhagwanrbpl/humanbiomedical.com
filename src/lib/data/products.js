import {
  fetchAdminCatalog,
  fetchAdminSiteData,
  normalizeWebsiteId,
} from "@/lib/admin-api";

const TARGET_WEBSITES = [
  "humanbiomedicalcom",
  "humanbiomedical.com",
  "humanbiomedical",
  "human",
  "all",
];

export function isWebsiteMatch(websiteIds) {
  if (!websiteIds) return true;
  const list = Array.isArray(websiteIds) ? websiteIds : [websiteIds];
  if (list.length === 0) return true;
  return list.some((w) => {
    const norm = normalizeWebsiteId(String(w));
    return TARGET_WEBSITES.includes(norm) || norm.includes("human");
  });
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

export function normalizeProduct(rawP, parentCat = {}, parentSub = {}) {
  if (!rawP) return null;

  const p = rawP.data
    ? {
        ...rawP.data,
        ...rawP,
        category: rawP.data.category || rawP.category || "",
        subCategory:
          rawP.data.subCategory ||
          rawP.data.subcategory ||
          rawP.subCategory ||
          rawP.subcategory ||
          "",
        brand: rawP.data.brand || rawP.brand || "",
        model: rawP.data.model || rawP.model || "",
        usage: rawP.data.usage || rawP.usage || "",
        desc: rawP.data.desc || rawP.data.description || rawP.desc || rawP.description || "",
        description: rawP.data.description || rawP.data.desc || rawP.description || rawP.desc || "",
        price: rawP.data.price || rawP.price || "",
        capacity: rawP.data.capacity || rawP.capacity || "",
        throughput: rawP.data.throughput || rawP.throughput || "",
        instrument: rawP.data.instrument || rawP.instrument || "",
        parameters: rawP.data.parameters || rawP.parameters || "",
        automation: rawP.data.automation || rawP.automation || "",
        availability: rawP.data.availability || rawP.availability || "In Stock",
        size: rawP.data.size || rawP.size || "",
      }
    : rawP;

  const catName = (
    parentCat.name ||
    parentCat.category ||
    p.category ||
    p.categoryName ||
    "General Medical Equipment"
  ).trim();
  const catId = parentCat.id || p.categoryId || slugify(catName);

  const subName = (
    parentSub.name ||
    parentSub.subCategory ||
    p.subCategory ||
    p.subcategory ||
    p.subCategoryName ||
    "General"
  ).trim();
  const subId = parentSub.id || p.subcategoryId || slugify(subName);

  const title = (p.title || p.name || "").trim();
  const slug = (p.slug || slugify(title)).trim();

  let images = [];
  if (Array.isArray(p.images) && p.images.length > 0) {
    images = p.images.filter(
      (img) => typeof img === "string" && img.trim() !== ""
    );
  } else if (p.image && typeof p.image === "string" && p.image.trim() !== "") {
    images = [p.image.trim()];
  } else if (
    Array.isArray(p.originalImages) &&
    p.originalImages.length > 0
  ) {
    images = p.originalImages.filter(
      (img) => typeof img === "string" && img.trim() !== ""
    );
  }

  const siteIds =
    Array.isArray(p.websiteIds) && p.websiteIds.length > 0
      ? p.websiteIds
      : Array.isArray(parentSub.websiteIds) && parentSub.websiteIds.length > 0
      ? parentSub.websiteIds
      : Array.isArray(parentCat.websiteIds) && parentCat.websiteIds.length > 0
      ? parentCat.websiteIds
      : [];

  return {
    id: String(p.id || p.productId || p.categoryProductId || slug),
    productId: String(p.productId || p.categoryProductId || p.id || slug),
    categoryProductId: p.categoryProductId || "",
    title,
    name: title,
    slug,
    price: p.price || "",
    desc: p.desc || p.description || "",
    description: p.description || p.desc || "",
    capacity: p.capacity || "",
    throughput: p.throughput || "",
    instrument: p.instrument || "",
    model: p.model || "",
    usage: p.usage || "",
    brand: p.brand || "",
    parameters: p.parameters || "",
    automation: p.automation || "",
    availability: p.availability || "In Stock",
    size: p.size || "",
    category: catName,
    subCategory: subName,
    categoryId: catId,
    subcategoryId: subId,
    images,
    image: images[0] || "",
    video: p.video || "",
    pdf: p.pdf || "",
    websiteIds: siteIds,
    isPublished: p.isPublished !== false,
    status: p.status || "active",
    type: p.type || "product",
  };
}

/**
 * Fetch all products from SuperAdmin MongoDB API
 */
export async function getAllProducts() {
  try {
    const rawCatalog = await fetchAdminCatalog({
      companyId: "human",
      websiteId: "humanbiomedicalcom",
    });

    if (!Array.isArray(rawCatalog) || rawCatalog.length === 0) {
      return [];
    }

    const allProducts = [];

    rawCatalog.forEach((rawItem) => {
      if (!rawItem) return;
      const item = rawItem?.data
        ? {
            ...rawItem.data,
            ...rawItem,
            category: rawItem.data.category || rawItem.category || "",
            subCategory:
              rawItem.data.subCategory ||
              rawItem.data.subcategory ||
              rawItem.subCategory ||
              rawItem.subcategory ||
              "",
          }
        : rawItem;

      // Handle category objects containing nested subcategories or products
      if (Array.isArray(item.subcategories) || Array.isArray(item.products)) {
        const catObj = {
          id: item.id || slugify(item.name || item.category || ""),
          name: item.name || item.category || "",
          slug: item.slug || slugify(item.name || item.category || ""),
          websiteIds: item.websiteIds || [],
        };

        if (Array.isArray(item.subcategories)) {
          item.subcategories.forEach((rawSub) => {
            const sub = rawSub?.data ? { ...rawSub.data, ...rawSub } : rawSub;
            const subObj = {
              id: sub.id || slugify(sub.name || sub.subCategory || ""),
              name: sub.name || sub.subCategory || "",
              slug: sub.slug || slugify(sub.name || sub.subCategory || ""),
              websiteIds: sub.websiteIds || catObj.websiteIds,
            };

            (sub.products || []).forEach((p) => {
              const unp = p?.data ? { ...p.data, ...p } : p;
              if (unp.isPublished === false || unp.status === "inactive") return;
              if (!isWebsiteMatch(unp.websiteIds || subObj.websiteIds)) return;
              const norm = normalizeProduct(unp, catObj, subObj);
              if (norm && norm.title) allProducts.push(norm);
            });
          });
        }

        if (Array.isArray(item.products)) {
          item.products.forEach((p) => {
            const unp = p?.data ? { ...p.data, ...p } : p;
            if (unp.isPublished === false || unp.status === "inactive") return;
            if (!isWebsiteMatch(unp.websiteIds || catObj.websiteIds)) return;
            const norm = normalizeProduct(unp, catObj);
            if (norm && norm.title) allProducts.push(norm);
          });
        }
      } else {
        // Flat product object
        if (item.isPublished === false || item.status === "inactive") return;
        if (!isWebsiteMatch(item.websiteIds)) return;
        const norm = normalizeProduct(item);
        if (norm && norm.title) allProducts.push(norm);
      }
    });

    // Deduplicate by slug
    const mapBySlug = new Map();
    allProducts.forEach((item) => {
      const itemTitle = (item.title || item.name || "").trim();
      const itemSlug = (item.slug || slugify(itemTitle)).trim();
      if (itemSlug && !mapBySlug.has(itemSlug)) {
        mapBySlug.set(itemSlug, {
          ...item,
          title: itemTitle,
          name: itemTitle,
          slug: itemSlug,
        });
      }
    });

    return Array.from(mapBySlug.values());
  } catch (error) {
    console.error("Error in getAllProducts from SuperAdmin MongoDB API:", error);
    return [];
  }
}

/**
 * Fetch a single product by slug from SuperAdmin MongoDB API catalog
 */
export async function getProductBySlug(slug) {
  if (!slug) return null;
  const products = await getAllProducts();
  const decoded = decodeURIComponent(slug).toLowerCase().trim();

  return (
    products.find((item) => {
      const slugMatch = item.slug && item.slug.toLowerCase() === decoded;
      const titleSlugMatch = slugify(item.title) === decoded;
      const titleMatch = item.title && item.title.toLowerCase() === decoded;
      const idMatch = item.id && String(item.id).toLowerCase() === decoded;
      const prodIdMatch =
        item.productId && String(item.productId).toLowerCase() === decoded;
      return (
        slugMatch || titleSlugMatch || titleMatch || idMatch || prodIdMatch
      );
    }) || null
  );
}

/**
 * Categorize all products dynamically
 */
export async function getAllCategories() {
  try {
    const allProducts = await getAllProducts();
    const categoriesMap = new Map();

    allProducts.forEach((product) => {
      const catName = (product.category || "General Medical Equipment").trim();
      const catSlug = product.categoryId || slugify(catName);

      if (!categoriesMap.has(catSlug)) {
        categoriesMap.set(catSlug, {
          id: catSlug,
          name: catName,
          slug: catSlug,
          count: 0,
          products: [],
          subcategories: [],
          websiteIds: product.websiteIds || [],
        });
      }

      const catEntry = categoriesMap.get(catSlug);
      catEntry.count += 1;
      catEntry.products.push(product);

      const subName = (product.subCategory || "General").trim();
      const subSlug = product.subcategoryId || slugify(subName);

      let subEntry = catEntry.subcategories.find(
        (s) => s.slug === subSlug || s.name.toLowerCase() === subName.toLowerCase()
      );

      const pSummary = {
        id: product.id,
        title: product.title,
        slug: product.slug,
        image: product.image,
        brand: product.brand,
        model: product.model,
        price: product.price,
      };

      if (subEntry) {
        if (!subEntry.products.some((sp) => sp.slug === product.slug)) {
          subEntry.count += 1;
          subEntry.products.push(pSummary);
        }
      } else {
        catEntry.subcategories.push({
          id: subSlug,
          name: subName,
          slug: subSlug,
          count: 1,
          products: [pSummary],
        });
      }
    });

    // Sort subcategories by count descending
    categoriesMap.forEach((cat) => {
      cat.subcategories.sort(
        (a, b) => b.count - a.count || a.name.localeCompare(b.name)
      );
    });

    return Array.from(categoriesMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } catch (err) {
    console.error("Error in getAllCategories:", err);
    return [];
  }
}

/**
 * Extract all brands dynamically
 */
export async function getAllBrands() {
  const products = await getAllProducts();
  const brandsMap = new Map();

  products.forEach((product) => {
    if (product.brand && product.brand.trim()) {
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

  return Array.from(brandsMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}
