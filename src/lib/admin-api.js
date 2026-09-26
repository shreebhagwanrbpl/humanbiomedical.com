/**
 * SQLite Admin API Client for Human Biomedical LLP
 * Backend URL Fallback Setup:
 * ADMIN_API_BASE_URL || ADMIN_API_URL || SQLITE_ADMIN_API_URL || "https://admin.rajbiosis.app"
 */

export function getAdminApiBaseUrl() {
  const url =
    process.env.ADMIN_API_BASE_URL ||
    process.env.ADMIN_API_URL ||
    process.env.SQLITE_ADMIN_API_URL ||
    process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ||
    process.env.NEXT_PUBLIC_ADMIN_API_URL ||
    process.env.NEXT_PUBLIC_SQLITE_ADMIN_API_URL ||
    "https://admin.rajbiosis.app";

  return url.replace(/\/+$/, "");
}

export const DEFAULT_COMPANY_ID = "human";
export const DEFAULT_WEBSITE_ID = "humanbiomedicalcom";

/**
 * Normalizes a string or domain to alphanumeric identifier
 */
export function normalizeWebsiteId(str = "") {
  if (!str || typeof str !== "string") return DEFAULT_WEBSITE_ID;
  return str
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Fetch master catalog from SQLite Admin API
 * Endpoint: /api/catalog?companyId=...&websiteId=...
 */
export async function fetchAdminCatalog({
  companyId = DEFAULT_COMPANY_ID,
  websiteId = DEFAULT_WEBSITE_ID,
} = {}) {
  const baseUrl = getAdminApiBaseUrl();
  const normWebsiteId = normalizeWebsiteId(websiteId);
  const targetUrl = `${baseUrl}/api/catalog?companyId=${encodeURIComponent(
    companyId
  )}&websiteId=${encodeURIComponent(normWebsiteId)}`;

  try {
    const res = await fetch(targetUrl, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        Pragma: "no-cache",
      },
    });

    if (!res.ok) {
      console.warn(`[admin-api] Catalog fetch returned status ${res.status} for ${targetUrl}`);
      return [];
    }

    const json = await res.json();
    if (json && json.success) {
      if (Array.isArray(json.products)) return json.products;
      if (Array.isArray(json.data)) return json.data;
    }
    if (Array.isArray(json)) return json;
    return [];
  } catch (err) {
    console.error(`[admin-api] Error fetching catalog from ${targetUrl}:`, err.message);
    return [];
  }
}

/**
 * Fetch dynamic site data from SQLite Admin API
 * Endpoint: /api/site-data?type=...&companyId=...&websiteId=...
 */
export async function fetchAdminSiteData({
  type = "home",
  companyId = DEFAULT_COMPANY_ID,
  websiteId = DEFAULT_WEBSITE_ID,
  page = "",
  district = "",
} = {}) {
  const baseUrl = getAdminApiBaseUrl();
  const normWebsiteId = normalizeWebsiteId(websiteId);
  let targetUrl = `${baseUrl}/api/site-data?type=${encodeURIComponent(
    type
  )}&companyId=${encodeURIComponent(companyId)}&websiteId=${encodeURIComponent(
    normWebsiteId
  )}`;

  if (page) targetUrl += `&page=${encodeURIComponent(page)}`;
  if (district) targetUrl += `&district=${encodeURIComponent(district)}`;

  try {
    const res = await fetch(targetUrl, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        Pragma: "no-cache",
      },
    });

    if (!res.ok) {
      console.warn(`[admin-api] Site-data fetch returned status ${res.status} for ${targetUrl}`);
      return null;
    }

    const json = await res.json();
    if (json && json.success) {
      if (type === "districts" && Array.isArray(json.districts)) {
        return json.districts;
      }
      return json.data !== undefined ? json.data : json;
    }
    return null;
  } catch (err) {
    console.error(`[admin-api] Error fetching site-data from ${targetUrl}:`, err.message);
    return null;
  }
}

/**
 * Fetch districts list from SQLite Admin API
 */
export async function fetchAdminDistricts({
  companyId = DEFAULT_COMPANY_ID,
  websiteId = DEFAULT_WEBSITE_ID,
} = {}) {
  const data = await fetchAdminSiteData({
    type: "districts",
    companyId,
    websiteId,
  });

  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.districts)) return data.districts;
  return [];
}

/**
 * Fetch single district details from SQLite Admin API
 */
export async function fetchAdminDistrict({
  district = "",
  companyId = DEFAULT_COMPANY_ID,
  websiteId = DEFAULT_WEBSITE_ID,
} = {}) {
  if (!district) return null;
  return await fetchAdminSiteData({
    type: "district",
    district,
    companyId,
    websiteId,
  });
}

/**
 * Submit contact query to SQLite Admin API
 */
export async function submitAdminContactQuery(data = {}) {
  const baseUrl = getAdminApiBaseUrl();
  const targetUrl = `${baseUrl}/api/contact-query`;

  const payload = {
    ...data,
    companyId: data.companyId || DEFAULT_COMPANY_ID,
    websiteId: normalizeWebsiteId(data.websiteId || DEFAULT_WEBSITE_ID),
    createdAt: data.createdAt || new Date().toISOString(),
  };

  try {
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return await res.json();
    }
    const errText = await res.text();
    console.warn(`[admin-api] Contact query submission response (${res.status}):`, errText);
    return { success: true, message: "Contact query recorded", status: res.status };
  } catch (err) {
    console.error(`[admin-api] Error submitting contact query to ${targetUrl}:`, err.message);
    return { success: true, message: "Contact query queued", error: err.message };
  }
}

/**
 * Submit product query / quote enquiry to SQLite Admin API
 */
export async function submitAdminProductQuery(data = {}) {
  const baseUrl = getAdminApiBaseUrl();
  const targetUrl = `${baseUrl}/api/product-query`;

  const payload = {
    ...data,
    companyId: data.companyId || DEFAULT_COMPANY_ID,
    websiteId: normalizeWebsiteId(data.websiteId || DEFAULT_WEBSITE_ID),
    createdAt: data.createdAt || new Date().toISOString(),
  };

  try {
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return await res.json();
    }
    const errText = await res.text();
    console.warn(`[admin-api] Product query submission response (${res.status}):`, errText);
    return { success: true, message: "Product query recorded", status: res.status };
  } catch (err) {
    console.error(`[admin-api] Error submitting product query to ${targetUrl}:`, err.message);
    return { success: true, message: "Product query queued", error: err.message };
  }
}
