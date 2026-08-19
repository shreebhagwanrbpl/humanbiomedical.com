import { notFound } from "next/navigation";
import Link from "next/link";
import GetQuoteForm from "@/components/GetQuoteForm";
import DownloadBrochureBtn from "@/components/DownloadBrochureBtn";
import "../product-details.css";
import ProductGallery from "./ProductGallery";
import { getProductBySlug, getAllProducts, slugify } from "@/lib/data/products";
import { getDistrictBySlug, getAllDistricts } from "@/lib/data/districts";
import {
  generateProductSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/seo/schema";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug, district } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  let locationName = "India";
  if (district) {
    const dObj = await getDistrictBySlug(district);
    locationName = dObj ? dObj.district : district.charAt(0).toUpperCase() + district.slice(1);
  }

  const title = district
    ? `${product.title} Supplier in ${locationName} | Human Biomedical LLP`
    : `${product.title} | Biomedical & Laboratory Equipment Supplier`;

  const description = `Buy ${product.title} in ${locationName}. Supplied by Human Biomedical LLP for hospitals, pathology labs, and diagnostic centres with genuine warranty, quotation, and technical support.`;

  const canonical = district
    ? `https://humanbiomedical.com/${district}/products/${product.slug}`
    : `https://humanbiomedical.com/products/${product.slug}`;

  const ogImage =
    typeof product.image === "string" && product.image.startsWith("http")
      ? product.image
      : "https://humanbiomedical.com/humanlogo.png";

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${product.title} Supplier in ${locationName}`,
      description,
      url: canonical,
      siteName: "Human Biomedical LLP",
      images: [
        {
          url: ogImage,
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
      title: `${product.title} | Human Biomedical LLP`,
      description,
      images: [ogImage],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug, district } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  let locationName = "India";
  if (district) {
    const dObj = await getDistrictBySlug(district);
    locationName = dObj ? dObj.district : district.charAt(0).toUpperCase() + district.slice(1);
  }

  const allProducts = await getAllProducts();
  const allDistricts = await getAllDistricts();

  const relatedProducts = allProducts
    .filter((p) => p.slug !== product.slug && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  const topDistricts = allDistricts.slice(0, 8);

  const canonicalUrl = district
    ? `https://humanbiomedical.com/${district}/products/${product.slug}`
    : `https://humanbiomedical.com/products/${product.slug}`;

  const productSchema = generateProductSchema(product, canonicalUrl);
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
  ];
  if (product.category) {
    breadcrumbs.push({
      name: product.category,
      url: `/category/${slugify(product.category)}`,
    });
  }
  breadcrumbs.push({ name: product.title, url: `/products/${product.slug}` });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  const faqs = [
    {
      question: `What is ${product.title} used for?`,
      answer: `${product.title} is designed for medical laboratories, hospitals, diagnostic centres, and pathology labs for accurate testing and clinical diagnostics.`,
    },
    {
      question: `Do you provide installation and supply in ${locationName}?`,
      answer: `Yes. Human Biomedical LLP provides doorstep delivery, installation guidance, and technical support across ${locationName} and nationwide.`,
    },
    {
      question: `How can I request a quotation for ${product.title}?`,
      answer: `You can submit an online quotation request on this page or contact our customer support team directly.`,
    },
  ];
  const faqSchema = generateFAQSchema(faqs);

  const categorySlug = product.category ? slugify(product.category) : null;
  const brandSlug = product.brand ? slugify(product.brand) : null;

  return (
    <section className="product-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="container-custom py-8">
        {/* Visual Breadcrumb Navigation */}
        <nav className="flex text-sm text-slate-500 mb-6 gap-2 items-center flex-wrap">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          {categorySlug && (
            <>
              <span>/</span>
              <Link href={`/category/${categorySlug}`} className="hover:text-blue-600">
                {product.category}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-slate-900 font-semibold">{product.title}</span>
        </nav>

        <div className="product-grid">
          {/* Gallery */}
          <ProductGallery product={product} />

          {/* Product Info */}
          <div className="product-content">
            <span className="product-tag">Available in {locationName}</span>

            <h1 className="text-3xl font-bold text-slate-900 mt-2 mb-4">
              {product.title} {district ? `in ${locationName}` : ""}
            </h1>

            <p className="text-slate-700 leading-relaxed mb-6">
              {product.desc ||
                `${product.title} is a high-performance biomedical instrument supplied by Human Biomedical LLP. Specially designed for high accuracy and compliance in diagnostic centres, hospitals, and clinical labs across ${locationName}.`}
            </p>

            <div className="product-features grid grid-cols-2 gap-3 mb-6">
              <span className="text-sm font-medium text-slate-800 bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center gap-2">
                ✔ 100% Genuine Quality
              </span>
              <span className="text-sm font-medium text-slate-800 bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center gap-2">
                ✔ Fast & Secure Delivery
              </span>
              <span className="text-sm font-medium text-slate-800 bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center gap-2">
                ✔ Technical AMC Support
              </span>
              <span className="text-sm font-medium text-slate-800 bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center gap-2">
                ✔ Easy Quotation Request
              </span>
            </div>

            <div className="product-details bg-slate-50 p-6 rounded-2xl border border-slate-200/80 mb-6 space-y-2 text-sm text-slate-700">
              {product.brand && (
                <p>
                  <strong>Brand:</strong>{" "}
                  <Link href={`/brand/${brandSlug}`} className="text-blue-600 hover:underline">
                    {product.brand}
                  </Link>
                </p>
              )}
              {product.category && (
                <p>
                  <strong>Category:</strong>{" "}
                  <Link href={`/category/${categorySlug}`} className="text-blue-600 hover:underline">
                    {product.category}
                  </Link>
                </p>
              )}
              {product.model && <p><strong>Model:</strong> {product.model}</p>}
              {product.instrument && <p><strong>Instrument Type:</strong> {product.instrument}</p>}
              {product.throughput && <p><strong>Throughput:</strong> {product.throughput}</p>}
              {product.automation && <p><strong>Automation Level:</strong> {product.automation}</p>}
              {product.availability && <p><strong>Availability:</strong> {product.availability}</p>}
            </div>

            <div className="product-btns flex flex-wrap gap-4 items-center">
              <GetQuoteForm />
              <DownloadBrochureBtn product={product} />
              <Link
                href={district ? `/${district}/contact` : "/contact"}
                className="secondary-btn"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>

        {/* Informational SEO Content Section */}
        <div className="seo-content mt-16 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Trusted {product.title} Supplier in {locationName}
          </h2>
          <p className="text-slate-700 leading-relaxed">
            Human Biomedical LLP is a premier distributor and supplier of <strong>{product.title}</strong> in {locationName}.
            We serve healthcare institutions, medical colleges, pathology centers, and research labs with certified, robust diagnostic equipment.
          </p>

          <h3 className="text-xl font-bold text-slate-800">Applications & Suitability</h3>
          <ul className="grid md:grid-cols-2 gap-2 text-slate-700 text-sm list-disc pl-5">
            <li>Hospitals & ICU Diagnostics</li>
            <li>Pathology Laboratories</li>
            <li>Clinical Diagnostic Labs</li>
            <li>Biotechnology & Research Institutes</li>
            <li>Blood Banks & Specialized Clinics</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-800">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                <h4 className="font-bold text-slate-900 mb-1">{faq.question}</h4>
                <p className="text-sm text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligent Internal Linking Engine */}
        <div className="mt-16 bg-slate-50 p-8 rounded-3xl border border-slate-200/60">
          {relatedProducts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Related Laboratory Equipment</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/products/${rp.slug}`}
                    className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-blue-500 transition text-center"
                  >
                    <p className="font-bold text-slate-800 text-sm line-clamp-1">{rp.title}</p>
                    <p className="text-xs text-blue-600 mt-1">{rp.brand || rp.category}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {topDistricts.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Service Locations for {product.title}
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {topDistricts.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/${d.slug}/products/${product.slug}`}
                    className="bg-white px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-500 transition"
                  >
                    {product.title} in {d.district}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}