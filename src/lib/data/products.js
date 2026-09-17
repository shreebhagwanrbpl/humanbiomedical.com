const PROJECT_ID = "rajbiosis-central";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const TARGET_WEBSITES = [
  "humanbiomedicalcom",
  "humanbiomedical.com",
  "humanbiomedical",
  "human",
  "all",
];

export function isWebsiteMatch(websiteIds) {
  if (!websiteIds) return false;
  const list = Array.isArray(websiteIds) ? websiteIds : [websiteIds];
  if (list.length === 0) return true; // Default to visible if unassigned
  return list.some((w) => TARGET_WEBSITES.includes(String(w).toLowerCase().trim()));
}

export function parseFirestoreFields(fields) {
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

export async function fetchRestJson(url) {
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        "Pragma": "no-cache",
      },
    });
    if (res.status === 200) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error(`Fetch error for ${url}:`, err.message);
    return null;
  }
}

export function normalizeProduct(p, parentCat = {}, parentSub = {}) {
  const catName = (parentCat.name || parentCat.category || p.category || "General Medical Equipment").trim();
  const catId = parentCat.id || p.categoryId || slugify(catName);
  const subName = (parentSub.name || parentSub.subCategory || p.subCategory || p.subcategory || "General").trim();
  const subId = parentSub.id || p.subcategoryId || slugify(subName);

  const title = (p.title || p.name || "").trim() || "Untitled Product";
  const slug = (p.slug || slugify(title)).trim();

  let images = [];
  if (Array.isArray(p.images) && p.images.length > 0) {
    images = p.images.filter((img) => typeof img === "string" && img.trim() !== "");
  } else if (p.image && typeof p.image === "string" && p.image.trim() !== "") {
    images = [p.image.trim()];
  } else if (Array.isArray(p.originalImages) && p.originalImages.length > 0) {
    images = p.originalImages.filter((img) => typeof img === "string" && img.trim() !== "");
  }

  const siteIds = Array.isArray(p.websiteIds) && p.websiteIds.length > 0
    ? p.websiteIds
    : Array.isArray(parentSub.websiteIds) && parentSub.websiteIds.length > 0
    ? parentSub.websiteIds
    : Array.isArray(parentCat.websiteIds) && parentCat.websiteIds.length > 0
    ? parentCat.websiteIds
    : [];

  return {
    id: p.id || p.productId || p.categoryProductId || slug,
    productId: p.productId || p.categoryProductId || p.id || slug,
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
    type: p.type || "category",
  };
}

export async function getAllProducts() {
  try {
    // 1. Fetch Master Categories from companies/human/categories
    const catData = await fetchRestJson(`${BASE_URL}/companies/human/categories?pageSize=300`);
    const catDocs = catData?.documents || [];

    const categoryProductPromises = catDocs.map(async (cDoc) => {
      const catId = cDoc.name.split("/").pop();
      const catFields = parseFirestoreFields(cDoc.fields);
      const cSites = Array.isArray(catFields.websiteIds)
        ? catFields.websiteIds
        : catFields.websiteIds
        ? [catFields.websiteIds]
        : [];

      const isCatVisible = cSites.length === 0 || isWebsiteMatch(cSites);
      if (!isCatVisible || catFields.status === "inactive") return [];

      const catObj = {
        id: catId,
        name: (catFields.name || catFields.category || catId).trim(),
        slug: catFields.slug || slugify(catFields.name || catFields.category || catId),
        websiteIds: cSites,
      };

      // Fetch subcategories for this category
      const subData = await fetchRestJson(
        `${BASE_URL}/companies/human/categories/${catId}/subcategories?pageSize=300`
      );
      const subDocs = subData?.documents || [];

      const subcategoryProducts = [];
      subDocs.forEach((sDoc) => {
        const subId = sDoc.name.split("/").pop();
        const subFields = parseFirestoreFields(sDoc.fields);
        const sSites = Array.isArray(subFields.websiteIds)
          ? subFields.websiteIds
          : subFields.websiteIds
          ? [subFields.websiteIds]
          : cSites;

        const isSubVisible = sSites.length === 0 || isWebsiteMatch(sSites);
        if (!isSubVisible || subFields.status === "inactive") return;

        const subObj = {
          id: subId,
          name: (subFields.name || subFields.subCategory || subId).trim(),
          slug: subFields.slug || slugify(subFields.name || subFields.subCategory || subId),
          websiteIds: sSites,
        };

        const rawProducts = subFields.products || [];
        rawProducts.forEach((p) => {
          if (p.isPublished === false || p.status === "inactive") return;
          const pSites = Array.isArray(p.websiteIds) && p.websiteIds.length > 0 ? p.websiteIds : sSites;
          if (!isWebsiteMatch(pSites)) return;

          subcategoryProducts.push(normalizeProduct(p, catObj, subObj));
        });
      });

      return subcategoryProducts;
    });

    // 2. Fetch Standalone Master Products from companies/human/products
    const standaloneProductsPromise = (async () => {
      let docs = [];
      let pageToken = "";
      do {
        const queryUrl = `${BASE_URL}/companies/human/products?pageSize=300${
          pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""
        }`;
        const data = await fetchRestJson(queryUrl);
        if (data && data.documents && Array.isArray(data.documents)) {
          docs.push(...data.documents);
          pageToken = data.nextPageToken || "";
        } else {
          pageToken = "";
        }
      } while (pageToken);

      const list = [];
      docs.forEach((docItem) => {
        const p = parseFirestoreFields(docItem.fields);
        if (p.isPublished === false || p.status === "inactive") return;
        const siteIds = Array.isArray(p.websiteIds)
          ? p.websiteIds
          : p.websiteIds
          ? [p.websiteIds]
          : [];
        if (!isWebsiteMatch(siteIds)) return;
        list.push(normalizeProduct(p));
      });
      return list;
    })();

    // Run parallel queries
    const [categoryProductsNested, standaloneProducts] = await Promise.all([
      Promise.all(categoryProductPromises),
      standaloneProductsPromise,
    ]);

    const allExtractedProducts = [...categoryProductsNested.flat(), ...standaloneProducts];

    // 3. Fallback: Check Legacy Website Collections if nothing found
    let legacyProducts = [];
    if (allExtractedProducts.length === 0) {
      const [prodRes, legacyCatRes] = await Promise.all([
        fetchRestJson(`${BASE_URL}/websites/humanbiomedicalcom/pages/products`),
        fetchRestJson(`${BASE_URL}/websites/humanbiomedicalcom/pages/categoryproducts/categories`),
      ]);

      if (prodRes && prodRes.fields) {
        const parsedData = parseFirestoreFields(prodRes.fields);
        const allProds = parsedData.products || [];
        legacyProducts.push(
          ...allProds
            .filter((item) => item && item.isPublished !== false)
            .map((p) => normalizeProduct(p))
        );
      }

      if (legacyCatRes && legacyCatRes.documents) {
        const subPromises = legacyCatRes.documents.map(async (categoryDoc) => {
          const categoryFields = parseFirestoreFields(categoryDoc.fields);
          const categoryId = categoryDoc.name.split("/").pop();
          const subData = await fetchRestJson(
            `${BASE_URL}/websites/humanbiomedicalcom/pages/categoryproducts/categories/${categoryId}/subcategories`
          );
          const docs = subData?.documents || [];
          const list = [];
          docs.forEach((subDoc) => {
            const subFields = parseFirestoreFields(subDoc.fields);
            (subFields.products || []).forEach((item) => {
              if (item && item.isPublished !== false) {
                list.push(
                  normalizeProduct(item, {
                    name: categoryFields.category || categoryFields.name,
                    id: categoryId,
                  }, {
                    name: subFields.subCategory || subFields.name,
                    id: subDoc.name.split("/").pop(),
                  })
                );
              }
            });
          });
          return list;
        });

        const subResults = await Promise.all(subPromises);
        legacyProducts.push(...subResults.flat());
      }
    }

    // 4. Combine and deduplicate by slug
    const combined = [...allExtractedProducts, ...legacyProducts];
    const mapBySlug = new Map();

    combined.forEach((item) => {
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
    console.error("Error in getAllProducts:", error);
    return [];
  }
}

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
      const prodIdMatch = item.productId && String(item.productId).toLowerCase() === decoded;
      return slugMatch || titleSlugMatch || titleMatch || idMatch || prodIdMatch;
    }) || null
  );
}

export async function getAllCategories() {
  try {
    const [catData, allProducts] = await Promise.all([
      fetchRestJson(`${BASE_URL}/companies/human/categories?pageSize=300`),
      getAllProducts(),
    ]);

    const catDocs = catData?.documents || [];
    const categoriesMap = new Map();

    // 1. Process Master Categories
    for (const cDoc of catDocs) {
      const catId = cDoc.name.split("/").pop();
      const catFields = parseFirestoreFields(cDoc.fields);
      const cSites = Array.isArray(catFields.websiteIds)
        ? catFields.websiteIds
        : catFields.websiteIds
        ? [catFields.websiteIds]
        : [];

      const isCatVisible = cSites.length === 0 || isWebsiteMatch(cSites);
      if (!isCatVisible || catFields.status === "inactive") continue;

      const catName = (catFields.name || catFields.category || catId).trim();
      const catSlug = catFields.slug || slugify(catName);

      // Fetch subcategories for this category
      const subData = await fetchRestJson(
        `${BASE_URL}/companies/human/categories/${catId}/subcategories?pageSize=300`
      );
      const subDocs = subData?.documents || [];

      const subcategoriesList = [];
      const categoryProducts = [];

      subDocs.forEach((sDoc) => {
        const subId = sDoc.name.split("/").pop();
        const subFields = parseFirestoreFields(sDoc.fields);
        const sSites = Array.isArray(subFields.websiteIds)
          ? subFields.websiteIds
          : subFields.websiteIds
          ? [subFields.websiteIds]
          : cSites;

        const isSubVisible = sSites.length === 0 || isWebsiteMatch(sSites);
        if (!isSubVisible || subFields.status === "inactive") return;

        const subName = (subFields.name || subFields.subCategory || subId).trim();
        const subSlug = subFields.slug || slugify(subName);

        const rawProducts = subFields.products || [];
        const validSubProducts = [];

        rawProducts.forEach((p) => {
          if (p.isPublished === false || p.status === "inactive") return;
          const pSites = Array.isArray(p.websiteIds) && p.websiteIds.length > 0 ? p.websiteIds : sSites;
          if (!isWebsiteMatch(pSites)) return;

          const normalized = normalizeProduct(
            p,
            { id: catId, name: catName, slug: catSlug, websiteIds: cSites },
            { id: subId, name: subName, slug: subSlug, websiteIds: sSites }
          );

          validSubProducts.push(normalized);
          categoryProducts.push(normalized);
        });

        subcategoriesList.push({
          id: subId,
          name: subName,
          slug: subSlug,
          count: validSubProducts.length,
          products: validSubProducts.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            image: p.image,
            brand: p.brand,
            model: p.model,
            price: p.price,
          })),
        });
      });

      // Also add any standalone products belonging to this category
      allProducts.forEach((prod) => {
        if (
          (prod.categoryId && prod.categoryId === catId) ||
          (prod.category && slugify(prod.category) === catSlug)
        ) {
          if (!categoryProducts.some((cp) => cp.slug === prod.slug)) {
            categoryProducts.push(prod);
            const subName = (prod.subCategory || "General").trim();
            const subSlug = slugify(subName);
            const existingSub = subcategoriesList.find((s) => s.slug === subSlug || s.name === subName);
            const pSummary = {
              id: prod.id,
              title: prod.title,
              slug: prod.slug,
              image: prod.image,
              brand: prod.brand,
              model: prod.model,
              price: prod.price,
            };
            if (existingSub) {
              if (!existingSub.products.some((sp) => sp.slug === prod.slug)) {
                existingSub.count += 1;
                existingSub.products.push(pSummary);
              }
            } else {
              subcategoriesList.push({
                id: prod.subcategoryId || subSlug,
                name: subName,
                slug: subSlug,
                count: 1,
                products: [pSummary],
              });
            }
          }
        }
      });

      subcategoriesList.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

      categoriesMap.set(catSlug, {
        id: catId,
        name: catName,
        slug: catSlug,
        count: categoryProducts.length,
        products: categoryProducts,
        subcategories: subcategoriesList,
        websiteIds: cSites,
      });
    }

    // 2. Attach any standalone products from other categories not yet in map
    allProducts.forEach((product) => {
      const catName = (product.category || "").trim();
      const catSlug = slugify(catName);
      if (catName && !categoriesMap.has(catSlug)) {
        const subName = (product.subCategory || "General").trim();
        const subSlug = slugify(subName);
        const pSummary = {
          id: product.id,
          title: product.title,
          slug: product.slug,
          image: product.image,
          brand: product.brand,
          model: product.model,
          price: product.price,
        };
        categoriesMap.set(catSlug, {
          id: product.categoryId || catSlug,
          name: catName,
          slug: catSlug,
          count: 1,
          products: [product],
          subcategories: [
            {
              id: product.subcategoryId || subSlug,
              name: subName,
              slug: subSlug,
              count: 1,
              products: [pSummary],
            },
          ],
          websiteIds: product.websiteIds || [],
        });
      }
    });

    return Array.from(categoriesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error("Error in getAllCategories:", err);
    return [];
  }
}

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

  return Array.from(brandsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}
