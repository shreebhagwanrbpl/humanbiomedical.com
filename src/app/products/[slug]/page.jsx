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
      "qlyte",
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
    ? `https://qlyte.com/${district}/products/${slug}`
    : `https://qlyte.com/products/${slug}`;

  return {
    title: `${product.title} Supplier in ${location} | Dealer, Distributor & Exporter | Qlyte`,

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
      title: `${product.title} Supplier in ${location} | Qlyte`,
      description: `Trusted supplier of ${product.title} for hospitals and pathology labs in ${location}.`,
      url,
      siteName: "Qlyte",
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
      title: `${product.title} | Qlyte`,
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
    doc(db, "websites", "qlyte", "pages", "products")
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
      name: "Qlyte",
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

          {/* Image */}
          {/* <div className="product-image-box">

            <img
              src={
                product.images?.[0] ||
                product.image ||
                "/images/products/default.webp"
              }
              alt={product.title}
            />

            {(product.images?.length > 1 ||
              product.video ||
              product.pdf) && (

                <div className="media-gallery">

                  {product.images?.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${product.title}-${index}`}
                      className="thumb-image"
                    />
                  ))}

                  {product.video && (
                    <a
                      href={product.video}
                      target="_blank"
                      rel="noreferrer"
                      className="media-btn"
                    >
                      🎥 Watch Video
                    </a>
                  )}

                  {product.pdf && (
                    <a
                      href={product.pdf}
                      target="_blank"
                      rel="noreferrer"
                      className="media-btn"
                    >
                      📄 Product PDF
                    </a>
                  )}

                </div>

              )}

          </div> */}
          <ProductGallery product={product} />
          {/* Content */}
          <div className="product-content">

            <span className="product-tag">
              Available in{" "}
              {district || "India"}
            </span>

            <h1>
              {product.title} Electrolyte Reagent in {district || "India"}
            </h1>

            <p>
              {product.desc}. Trusted
              supplier of{" "}
              {product.title} for
              hospitals, pathology labs
              and healthcare centres in{" "}
              {district || "India"}.
            </p>

            <div className="product-features">
              <span>
                ✔ Premium Quality
              </span>

              <span>
                ✔ Fast Delivery
              </span>

              <span>
                ✔ Technical Support
              </span>

              <span>
                ✔ Accurate Results
              </span>
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
            Electrolyte Reagent Supplier
            in {district || "India"}
          </h2>

          <p>
            We provide premium quality{" "}
            {product.title} electrolyte
            reagent for hospitals,
            pathology laboratories and
            diagnostic centres in{" "}
            {district || "India"}.
            Trusted quality, stable
            performance, competitive
            pricing and fast delivery.
          </p>

        </div>
        <div className="seo-content">

          <h2>
            {product.title} Supplier in {district || "India"}
          </h2>

          <p>
            Qlyte is a trusted supplier of {product.title} in {district || "India"}.
            We provide premium quality electrolyte analyzer reagents for hospitals,
            pathology laboratories, diagnostic centres and healthcare institutions.
          </p>

          <h2>
            Why Choose Our {product.title} in {district || "India"}
          </h2>

          <p>
            Our {product.title} is designed for accurate and reliable performance.
            Laboratories across {district || "India"} trust our products for
            consistent results, longer shelf life and compatibility with leading
            analyzer systems.
          </p>

          <h2>
            Trusted {product.title} Dealer in {district || "India"}
          </h2>

          <p>
            We are a reputed dealer and supplier of {product.title} in
            {district || "India"} offering genuine products, technical support
            and fast delivery services.
          </p>

          <h2>
            Applications of {product.title}
          </h2>

          <ul>
            <li>Hospitals</li>
            <li>Pathology Laboratories</li>
            <li>Diagnostic Centres</li>
            <li>Medical Colleges</li>
            <li>Research Laboratories</li>
            <li>Healthcare Institutions</li>
          </ul>

          <h2>
            FAQ - {product.title} in {district || "India"}
          </h2>

          <h3>
            What is {product.title} used for?
          </h3>

          <p>
            {product.title} is used for electrolyte testing and laboratory
            diagnostic applications.
          </p>

          <h3>
            Do you provide delivery in {district || "India"}?
          </h3>

          <p>
            Yes, we provide delivery and support services across
            {district || "India"}.
          </p>

        </div>
      </div>
    </section>
  );
}