import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllBrands, slugify } from "@/lib/data/products";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";
import "@/app/products/products.css";

export async function generateStaticParams() {
  const brands = await getAllBrands();
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brands = await getAllBrands();
  const brand = brands.find((b) => b.slug === slug);

  const formattedName = decodeURIComponent(slug)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const brandName = brand ? brand.name : formattedName;
  const url = `https://humanbiomedical.com/brand/${slug}`;

  return {
    title: `${brandName} Equipment Supplier & Authorized Products | Human Biomedical LLP`,
    description: `Browse authorized ${brandName} laboratory equipment, diagnostic analyzers, and reagents supplied by Human Biomedical LLP across India.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${brandName} Products | Human Biomedical LLP`,
      description: `Authorized supply and support for ${brandName} medical and laboratory equipment.`,
      url,
      siteName: "Human Biomedical LLP",
      type: "website",
    },
  };
}

export default async function BrandHubPage({ params }) {
  const { slug } = await params;
  const brands = await getAllBrands();
  const rawBrand = brands.find((b) => b.slug === slug);

  const formattedName = decodeURIComponent(slug)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const brand = rawBrand || {
    name: formattedName,
    slug: slug,
    products: [],
  };

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: brand.name, url: `/brand/${brand.slug}` },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <section className="products-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container-custom py-10">
        <nav className="flex text-sm text-slate-500 mb-6 gap-2 items-center">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{brand.name}</span>
        </nav>

        <div className="products-heading">
          <span>Brand Partner</span>
          <h1>{brand.name} Equipment &amp; Solutions</h1>
          <p className="max-w-3xl">
            Human Biomedical LLP supplies genuine <strong>{brand.name}</strong> instruments, diagnostic analyzers,
            reagents, and accessories. Designed for accuracy, high throughput, and long-term durability in medical laboratories.
          </p>
        </div>

        {brand.products.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brand.products.map((product) => (
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
                      <div className="text-4xl">🔬</div>
                    )}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
                    {brand.name}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-3 mb-2">{product.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                    {product.desc || `${product.title} manufactured by ${brand.name}.`}
                  </p>
                </div>

                <Link
                  href={`/products/${product.slug || slugify(product.title)}`}
                  className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl transition"
                >
                  View Product Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm text-center">
            <div className="text-5xl mb-3">🏥</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {brand.name} Equipment Supply &amp; Support
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto mb-6">
              Human Biomedical LLP provides authorized sales, installation, reagents, and annual maintenance (AMC) for <strong>{brand.name}</strong> instruments. Contact our sales team for pricing or explore our catalog.
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
                Request Brand Quotation
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
