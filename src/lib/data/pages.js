const PROJECT_ID = "rajbiosis-central";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

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

const DEFAULT_HOME_DATA = {
  title: "Empowering Healthcare with Precision Medical Systems",
  description: "Human Biomedical LLP is a trusted supplier of laboratory and hospital equipment, providing high-quality medical instruments, diagnostic systems, pathology analyzers, ICU & OT equipment, laboratory consumables, and healthcare solutions for hospitals, diagnostic centres, research laboratories, and clinics.",
  button1Text: "Explore Products",
  button1Link: "/products",
  button2Text: "Request Quote",
  button2Link: "/contact",
  imageUrl: "",
};

const DEFAULT_SERVICES_DATA = {
  services: [
    {
      title: "Laboratory Equipment Supply",
      desc: "Supplying high-precision automated clinical chemistry analyzers, electrolyte analyzers, centrifuges, and laboratory instruments."
    },
    {
      title: "Hospital & ICU Solutions",
      desc: "Advanced patient monitors, operation theatre lights, surgical tables, and vital diagnostic monitors for modern medical centers."
    },
    {
      title: "Diagnostic Reagents & Consumables",
      desc: "Premium pathology reagents, calibrators, controls, plasticware, and testing kits with high shelf life and exact accuracy."
    },
    {
      title: "Turnkey Lab Setup & Installation",
      desc: "End-to-end setup for diagnostic labs and hospital pathology departments including calibration and verification."
    },
    {
      title: "Pan-India Express Delivery",
      desc: "Safe, insured, and temperature-controlled logistics for fast door-step delivery of biomedical equipment across India."
    },
    {
      title: "24/7 Technical Support & Maintenance",
      desc: "On-call biomedical engineers, annual maintenance contracts (AMC), troubleshooting, and preventative service."
    }
  ]
};

const DEFAULT_CONTACT_DATA = {
  contactInfo: [
    { label: "Address", value: "Unit S-1, 2nd Floor, Pn 16, D Block, Tagore Nagar, Vaishali Nagar, Jaipur, Rajasthan 302021" },
    { label: "Phone", value: "+91 98290 12345" },
    { label: "Email", value: "info@humanbiomedical.com" }
  ]
};

let homeCache = null;
let homeCacheTime = 0;
let servicesCache = null;
let servicesCacheTime = 0;
let contactCache = null;
let contactCacheTime = 0;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function getHomePageData() {
  const now = Date.now();
  if (homeCache && now - homeCacheTime < CACHE_TTL) {
    return homeCache;
  }

  try {
    const res = await fetch(`${BASE_URL}/websites/humanbiomedicalcom/pages/home`, {
      next: { revalidate: 1800 },
    });

    if (res.status === 200) {
      const data = await res.json();
      if (data.fields) {
        const parsed = parseFirestoreFields(data.fields);
        homeCache = { ...DEFAULT_HOME_DATA, ...parsed };
        homeCacheTime = now;
        return homeCache;
      }
    }
  } catch (error) {
    console.error("Error fetching home page data from Firestore REST:", error.message);
  }

  return homeCache || DEFAULT_HOME_DATA;
}

export async function getServicesPageData() {
  const now = Date.now();
  if (servicesCache && now - servicesCacheTime < CACHE_TTL) {
    return servicesCache;
  }

  try {
    const res = await fetch(`${BASE_URL}/websites/humanbiomedicalcom/pages/services`, {
      next: { revalidate: 1800 },
    });

    if (res.status === 200) {
      const data = await res.json();
      if (data.fields) {
        const parsed = parseFirestoreFields(data.fields);
        servicesCache = { ...DEFAULT_SERVICES_DATA, ...parsed };
        servicesCacheTime = now;
        return servicesCache;
      }
    }
  } catch (error) {
    console.error("Error fetching services page data from Firestore REST:", error.message);
  }

  return servicesCache || DEFAULT_SERVICES_DATA;
}

export async function getContactPageData() {
  const now = Date.now();
  if (contactCache && now - contactCacheTime < CACHE_TTL) {
    return contactCache;
  }

  try {
    const res = await fetch(`${BASE_URL}/websites/humanbiomedicalcom/pages/contact`, {
      next: { revalidate: 1800 },
    });

    if (res.status === 200) {
      const data = await res.json();
      if (data.fields) {
        const parsed = parseFirestoreFields(data.fields);
        contactCache = { ...DEFAULT_CONTACT_DATA, ...parsed };
        contactCacheTime = now;
        return contactCache;
      }
    }
  } catch (error) {
    console.error("Error fetching contact page data from Firestore REST:", error.message);
  }

  return contactCache || DEFAULT_CONTACT_DATA;
}
