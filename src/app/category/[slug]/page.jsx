import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCategories, slugify } from "@/lib/data/products";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";
import "@/app/products/products.css";

export const dynamicParams = true;
export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categories = await getAllCategories();
  const cat = categories.find((c) => c.slug === slug);

  const formattedName = decodeURIComponent(slug)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const catName = cat ? cat.name : formattedName;
  const url = `https://humanbiomedical.com/category/${slug}`;

  return {
    title: `${catName} Supplier & Dealer | Laboratory & Hospital Equipment`,
    description: `Explore high-quality ${catName} from Human Biomedical LLP. Complete range of diagnostic instruments, analyzers, and medical devices supplied across India.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${catName} | Human Biomedical LLP`,
      description: `Premium ${catName} supplied to hospitals, pathology labs, and diagnostic centres.`,
      url,
      siteName: "Human Biomedical LLP",
      type: "website",
    },
  };
}

export default async function CategoryHubPage({ params }) {
  const { slug } = await params;
  const categories = await getAllCategories();
  const rawCat = categories.find((c) => c.slug === slug);

  const formattedName = decodeURIComponent(slug)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const cat = rawCat || {
    name: formattedName,
    slug: slug,
    products: [],
  };

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: cat.name, url: `/category/${cat.slug}` },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <section className="products-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container-custom py-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex text-sm text-slate-500 mb-6 gap-2 items-center">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{cat.name}</span>
        </nav>

        <div className="products-heading">
          <span>Category Hub</span>
          <h1>{cat.name}</h1>
          <p className="max-w-3xl">
            Human Biomedical LLP is a trusted supplier of <strong>{cat.name}</strong> for hospitals,
            pathology laboratories, diagnostic centres, research institutes, and healthcare facilities across India.
            We provide genuine equipment, technical installation support, and prompt delivery.
          </p>
        </div>

        {/* Category Products Grid or Custom Inquiry Banner */}
        {cat.products.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cat.products.map((product) => (
              <div
                key={product.slug || product.title}
                className="bg-white rounded-3xl border border-slate-100 p-6 shadow-md hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  <div className="bg-slate-50 rounded-2xl h-48 flex items-center justify-center p-4 mb-4">
                    {product.image || product.images?.[0] ? (
                      <img
                        src={product.image || product.images?.[0]}
                        alt={product.title}
                        className="max-h-40 object-contain"
                      />
                    ) : (
                      <div className="text-4xl">🧪</div>
                    )}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {product.brand || cat.name}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-3 mb-2">{product.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                    {product.desc || `${product.title} high-precision equipment for diagnostic and laboratory applications.`}
                  </p>
                </div>

                <Link
                  href={`/products/${product.slug || slugify(product.title)}`}
                  className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl transition"
                >
                  View Full Specifications
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm text-center">
            <div className="text-5xl mb-3">🔬</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {cat.name} Portfolio &amp; Direct Quotations
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto mb-6">
              Our <strong>{cat.name}</strong> equipment catalog is updated in real-time. For custom procurement, bulk orders, or specific model specifications, please request a fast quotation or explore all active products.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/products"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl transition"
              >
                Browse All Products
              </Link>
              <Link
                href="/contact"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-6 py-3 rounded-2xl transition"
              >
                Contact Sales Team
              </Link>
            </div>
          </div>
        )}

        {/* Category Information & Buying Guide */}
        <div className="mt-16 bg-slate-50 rounded-3xl p-8 border border-slate-200/60">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            About {cat.name} Equipment & Solutions
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Selection of the right <strong>{cat.name}</strong> is critical for clinical accuracy, laboratory throughput,
            and operational efficiency. Human Biomedical LLP offers top-performing instruments engineered to meet rigorous
            quality standards.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg mb-2">Key Applications</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                <li>Hospital Clinical Laboratories</li>
                <li>Pathology & Diagnostic Centres</li>
                <li>Research & Biotechnology Labs</li>
                <li>Medical Universities & Institutions</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg mb-2">Why Choose Human Biomedical LLP</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                <li>100% Genuine Certified Equipment</li>
                <li>Pan-India Sales & Service Network</li>
                <li>Expert Application Support & AMC</li>
                <li>Competitive Pricing & Easy Quotations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
