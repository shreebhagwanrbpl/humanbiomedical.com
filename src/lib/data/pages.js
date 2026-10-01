import { fetchAdminSiteData } from "@/lib/admin-api";

export async function getHomePageData() {
  try {
    const data = await fetchAdminSiteData({
      type: "home",
      companyId: "human",
      websiteId: "humanbiomedicalcom",
    });

    if (data && typeof data === "object") {
      return {
        title: data.title || data.headline || data.heading || "",
        description: data.description || data.desc || data.subheading || "",
        button1Text: data.button1Text || data.buttonText || data.btn1Text || data.btnText || data.btn1 || data.button1 || "",
        button1Link: data.button1Link || "/products",
        button2Text: data.button2Text || data.btn2Text || data.btn2 || data.button2 || "",
        button2Link: data.button2Link || "/contact",
        imageUrl: data.imageUrl || data.image || "",
        ...data,
      };
    }
  } catch (error) {
    console.error("Error fetching home page data from SuperAdmin MongoDB API:", error.message);
  }

  return {
    title: "",
    description: "",
    button1Text: "",
    button1Link: "/products",
    button2Text: "",
    button2Link: "/contact",
    imageUrl: "",
  };
}

export async function getServicesPageData() {
  try {
    const data = await fetchAdminSiteData({
      type: "services",
      companyId: "human",
      websiteId: "humanbiomedicalcom",
    });

    if (data && typeof data === "object") {
      const servicesList = Array.isArray(data.services)
        ? data.services
        : Array.isArray(data)
        ? data
        : [];
      return {
        services: servicesList,
        ...data,
      };
    }
  } catch (error) {
    console.error("Error fetching services page data from SuperAdmin MongoDB API:", error.message);
  }

  return {
    services: [],
  };
}

export async function getContactPageData() {
  try {
    const data = await fetchAdminSiteData({
      type: "contact",
      companyId: "human",
      websiteId: "humanbiomedicalcom",
    });

    if (data && typeof data === "object") {
      let contactInfo = [];
      if (Array.isArray(data.contactInfo)) {
        contactInfo = data.contactInfo;
      } else if (Array.isArray(data)) {
        contactInfo = data;
      } else if (data.fields?.contactInfo?.arrayValue?.values) {
        contactInfo = data.fields.contactInfo.arrayValue.values.map((v) => ({
          label: v.mapValue?.fields?.label?.stringValue || "",
          value: v.mapValue?.fields?.value?.stringValue || "",
        }));
      }
      return {
        contactInfo,
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        ...data,
      };
    }
  } catch (error) {
    console.error("Error fetching contact page data from SuperAdmin MongoDB API:", error.message);
  }

  return {
    contactInfo: [],
    address: "",
    phone: "",
    email: "",
  };
}
