const SITE_URL = "https://humanbiomedical.com";
const COMPANY_NAME = "Human Biomedical LLP";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: COMPANY_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/humanlogo.png`,
    description:
      "Human Biomedical LLP is a leading supplier of laboratory instruments, diagnostic equipment, pathology analyzers, medical devices, and healthcare solutions.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
    sameAs: ["https://www.instagram.com/humanbiomedicals/"],
  };
}

export function generateLocalBusinessSchema(locationName, stateName) {
  const location = locationName || "Jaipur";
  const state = stateName || "Rajasthan";

  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${SITE_URL}/#localbusiness-${location.toLowerCase()}`,
    name: `${COMPANY_NAME} - ${location}`,
    description: `Supplier of laboratory instruments, hospital equipment, diagnostic systems, and pathology analyzers in ${location}, ${state}.`,
    url: SITE_URL,
    logo: `${SITE_URL}/humanlogo.png`,
    areaServed: {
      "@type": "AdministrativeArea",
      name: location,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: location,
      addressRegion: state,
      addressCountry: "IN",
    },
    medicalSpecialty: [
      "Diagnostic Services",
      "Laboratory Medicine",
      "Medical Equipment Distribution",
    ],
  };
}

export function generateProductSchema(product, canonicalUrl) {
  if (!product) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonicalUrl}#product`,
    name: product.title,
    description:
      product.desc ||
      `${product.title} supplied by ${COMPANY_NAME}. High-precision biomedical and laboratory equipment for hospitals, pathology labs, and diagnostic centres.`,
    image:
      typeof product.image === "string" && product.image.startsWith("http")
        ? [product.image]
        : product.images && Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : [`${SITE_URL}/humanlogo.png`],
    brand: {
      "@type": "Brand",
      name: product.brand || COMPANY_NAME,
    },
    category: product.category || "Biomedical & Laboratory Equipment",
    model: product.model || undefined,
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: COMPANY_NAME,
      },
    },
  };
}

export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateFAQSchema(faqs) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
