import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import GetQuoteForm from "@/components/GetQuoteForm";
import "../product-details.css";
import ProductGallery from "./ProductGallery";
export async function generateMetadata({
  params,
}) {
  const { slug, district } = await params;

  const snap = await getDoc(
    doc(
      db,
      "websites",
      "humanbiomedicalcom",
      "pages",
      "products"
    )
  );

  const products = snap.exists()
    ? snap.data().products || []
    : [];

  const product = products.find(
    (item) =>
      item.title === decodeURIComponent(slug)
  );

  if (!product) {
    return {
      title: "Product Not Found",
      description:
        "The requested product could not be found.",
    };
  }
  const location = district
    ? district.charAt(0).toUpperCase() + district.slice(1)
    : "India";
  const url = district
    ? `https://humanbiomedical.com/${district}/products/${slug}`
    : `https://humanbiomedical.com/products/${slug}`;

  return {
    title: `${product.title} Supplier in ${location} | Dealer, Distributor & Exporter | humanbiomedicalcom`,

    description: `Buy ${product.title} in ${location}. Trusted supplier of electrolyte analyzer reagents for hospitals, pathology labs, diagnostic centres and healthcare facilities across India.`,

    keywords: [
      product.title,
      `${product.title} supplier in ${location}`,
      `${product.title} dealer in ${location}`,
      `${product.title} manufacturer in ${location}`,
      `${product.title} exporter in ${location}`,
      `${product.title} price in ${location}`,
      `Buy ${product.title} in ${location}`,
      `${product.title} near me`,
      `${product.title} supplier`,
      `Electrolyte Reagent Supplier`,
      `Electrolyte Analyzer Reagent`,
      `Clinical Chemistry Reagent`,
      `Laboratory Reagent Supplier`,
      `Hospital Lab Reagent`,
      `Diagnostic Reagent Supplier`,
      `${location} Medical Supplier`,
      `${location} Pathology Lab Supplier`,
      `${location} Diagnostic Equipment Supplier`,
    ],

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: `${product.title} Supplier in ${location} | humanbiomedicalcom`,
      description: `Trusted supplier of ${product.title} for hospitals and pathology labs in ${location}.`,
      url,
      siteName: "humanbiomedicalcom",
      images: [
        {
          url:
            typeof product.image ===
              "string" &&
              product.image.startsWith(
                "http"
              )
              ? product.image
              : "/images/products/default.webp",
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      locale: "en_IN",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: `${product.title} | humanbiomedicalcom`,
      description: `Buy ${product.title} in ${location}.`,
      images: [
        typeof product.image ===
          "string" &&
          product.image.startsWith("http")
          ? product.image
          : "/images/products/default.webp",
      ],
    },

    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview":
          "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function ProductPage({
  params,
}) {
  const { district, slug } = await params;

  const snap = await getDoc(
    doc(db, "websites", "humanbiomedicalcom", "pages", "products")
  );

  const products = snap.exists()
    ? snap.data().products || []
    : [];

  const product = products.find(
    (item) =>
      item.title === decodeURIComponent(slug)
  );

  if (!product) {
    notFound();
  }

  const schemaData = {
    "@context":
      "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.desc,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: "humanbiomedicalcom",
    },
    category:
      "Electrolyte Analyzer Reagent",
    offers: {
      "@type": "Offer",
      availability:
        "https://schema.org/InStock",
      priceCurrency: "INR",
    },
  };

  return (
    <section className="product-page">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            schemaData
          ),
        }}
      />

      <div className="container-custom">

        <div className="product-grid">

          {/* Product Gallery */}
          <ProductGallery product={product} />

          {/* Product Content */}
          <div className="product-content">

            <span className="product-tag">
              Available in {district || "India"}
            </span>

            <h1>
              {product.title} in {district || "India"}
            </h1>

            <p>
              {product.desc ||
                `${product.title} is a high-quality laboratory and hospital equipment supplied by Human Biomedical LLP. Designed for reliable performance, it is widely used in hospitals, diagnostic centres, pathology laboratories, research institutions, clinics, and healthcare facilities across ${district || "India"}.`}
            </p>

            <div className="product-features">
              <span>✔ Premium Quality Product</span>

              <span>✔ Fast & Secure Delivery</span>

              <span>✔ Expert Technical Support</span>

              <span>✔ Trusted Performance</span>
            </div>

            <div className="product-details">

              {product.title && (
                <p>
                  <strong>Product:</strong> {product.title}
                </p>
              )}

              {product.brand && (
                <p>
                  <strong>Brand:</strong> {product.brand}
                </p>
              )}

              {product.instrument && (
                <p>
                  <strong>Instrument:</strong> {product.instrument}
                </p>
              )}

              {product.model && (
                <p>
                  <strong>Model:</strong> {product.model}
                </p>
              )}

              {product.usage && (
                <p>
                  <strong>Application:</strong> {product.usage}
                </p>
              )}

              {product.parameters && (
                <p>
                  <strong>Parameters:</strong> {product.parameters}
                </p>
              )}

              {product.throughput && (
                <p>
                  <strong>Throughput:</strong> {product.throughput}
                </p>
              )}

              {product.automation && (
                <p>
                  <strong>Automation:</strong> {product.automation}
                </p>
              )}

              {product.availability && (
                <p>
                  <strong>Availability:</strong> {product.availability}
                </p>
              )}

            </div>

            <div className="product-btns">

              <GetQuoteForm />

              <Link
                href={
                  district
                    ? `/${district}/contact`
                    : "/contact"
                }
                className="secondary-btn"
              >
                Contact Us
              </Link>

            </div>

          </div>

        </div>

        {/* Info Section */}
        <div className="info-box">

          <h2>
            Trusted Laboratory & Hospital Equipment Supplier in {district || "India"}
          </h2>

          <p>
            Human Biomedical LLP is a trusted supplier of <strong>{product.title}</strong> in{" "}
            {district || "India"}. We provide high-quality laboratory instruments,
            hospital equipment, diagnostic systems, medical devices, and healthcare
            solutions for hospitals, pathology laboratories, diagnostic centres,
            research institutions, clinics, and healthcare organizations. Our focus is
            on quality products, competitive pricing, expert technical support, and
            timely delivery.
          </p>

        </div>

        <div className="seo-content">

          <h2>
            {product.title} Supplier in {district || "India"}
          </h2>

          <p>
            Human Biomedical LLP is a trusted supplier of <strong>{product.title}</strong> in{" "}
            {district || "India"}. We offer reliable laboratory and hospital equipment
            for hospitals, diagnostic centres, pathology laboratories, medical colleges,
            research institutions, and healthcare organizations with dependable quality
            and professional support.
          </p>

          <h2>
            Why Choose Our {product.title} in {district || "India"}
          </h2>

          <p>
            Our <strong>{product.title}</strong> is selected for its reliable
            performance, quality construction, and suitability for modern healthcare
            environments. Human Biomedical LLP is committed to providing premium medical
            equipment backed by competitive pricing, expert guidance, and dependable
            after-sales support.
          </p>

          <h2>
            Trusted {product.title} Dealer in {district || "India"}
          </h2>

          <p>
            Human Biomedical LLP is a reliable dealer and supplier of{" "}
            <strong>{product.title}</strong> in {district || "India"}, serving
            hospitals, laboratories, clinics, diagnostic centres, research institutes,
            and healthcare facilities with genuine products and timely delivery.
          </p>

          <h2>
            Applications of {product.title}
          </h2>

          <ul>
            <li>Hospitals & Healthcare Institutions</li>
            <li>Diagnostic Centres</li>
            <li>Pathology Laboratories</li>
            <li>Research Laboratories</li>
            <li>Medical Colleges & Universities</li>
            <li>Clinics & Nursing Homes</li>
            <li>Blood Banks</li>
            <li>Pharmaceutical & Biotechnology Laboratories</li>
          </ul>

          <h2>
            Frequently Asked Questions
          </h2>

          <h3>
            What is {product.title} used for?
          </h3>

          <p>
            {product.title} is used in hospitals, laboratories, diagnostic centres,
            research institutions, and other healthcare facilities depending on its
            intended medical or laboratory application.
          </p>

          <h3>
            Do you provide delivery in {district || "India"}?
          </h3>

          <p>
            Yes. Human Biomedical LLP provides safe and timely delivery of{" "}
            {product.title} across {district || "India"} along with professional
            customer support.
          </p>

          <h3>
            Do you provide technical support?
          </h3>

          <p>
            Yes. We offer expert technical guidance and after-sales support for
            laboratory and hospital equipment to help ensure smooth installation and
            operation.
          </p>

          <h3>
            Can I request a quotation for {product.title}?
          </h3>

          <p>
            Absolutely. You can contact Human Biomedical LLP to receive a customized
            quotation based on your laboratory or hospital requirements.
          </p>

        </div>
      </div>
    </section>
  );
}