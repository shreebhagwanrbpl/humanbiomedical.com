import "./home.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Homeimg from "./img/Homeimg.jpg";
import heroimg from "./img/heroimg.jpg";
import Image from "next/image";
import {
  ShieldCheck,
  Truck,
  Award,
  Headphones,
  Sparkles,
  CheckCircle2,
  Building2,
  FlaskConical,
  Stethoscope,
  Activity,
  ArrowRight,
  Star,
  FileText,
  ChevronRight,
  HelpCircle,
  BadgeCheck,
  Microscope
} from "lucide-react";

export async function generateMetadata({ params }) {
  const district = params?.district;
  const location = district || "India";
  const url = district ? `https://humanbiomedical.com/${district}` : "https://humanbiomedical.com";
  return {
    title: `Laboratory & Hospital Equipment Supplier in ${location} | Human Biomedical LLP`,
    description: `Human Biomedical LLP is a trusted supplier of laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, laboratory consumables, and healthcare solutions in ${location}.`,
    keywords: [
      `laboratory equipment in ${location}`,
      `hospital equipment in ${location}`,
      `medical equipment supplier in ${location}`,
      `laboratory instruments in ${location}`,
      `diagnostic equipment in ${location}`,
      `pathology analyzer in ${location}`,
      `medical devices in ${location}`,
      `laboratory consumables in ${location}`,
      `healthcare equipment supplier ${location}`,
      `hospital laboratory supplier ${location}`,
      `lab equipment supplier ${location}`,
      `Human Biomedical LLP`,
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `Laboratory & Hospital Equipment Supplier in ${location} | Human Biomedical LLP`,
      description: `Explore premium laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, and healthcare solutions from Human Biomedical LLP in ${location}.`,
      url,
      siteName: "Human Biomedical LLP",
      locale: "en_IN",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

export default async function Home({ districtData }) {
  const docRef = doc(db, "websites", "humanbiomedicalcom", "pages", "home");
  const snap = await getDoc(docRef);
  const savedData = snap.exists() ? snap.data() : {};
  const location = districtData?.district || "India";

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: `Human Biomedical LLP - ${location}`,
    description: `Human Biomedical LLP is a trusted supplier of laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, laboratory consumables, and healthcare solutions in ${location}.`,
    areaServed: location,
    url: districtData?.slug
      ? `https://humanbiomedical.com/${districtData.slug}`
      : "https://humanbiomedical.com",
    medicalSpecialty: [
      "Diagnostic Services",
      "Laboratory Medicine",
      "Medical Equipment"
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Laboratory & Hospital Equipment",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Laboratory Instruments",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Diagnostic Equipment",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Hospital Equipment",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Medical Devices",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Laboratory Consumables",
          },
        },
      ],
    },
  };

  const getProductUrl = () => districtData?.slug ? `/${districtData.slug}/products` : "/products";
  const getContactUrl = () => districtData?.slug ? `/${districtData.slug}/contact` : "/contact";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container-custom hero-grid">
          <div className="hero-content">
            <span className="hero-badge">
              <Sparkles className="icon-pulse" size={16} />
              Human Biomedical LLP – Leading Equipment Partner in {location}
            </span>

            <h1>
              {savedData.title || (
                <>
                  Empowering Healthcare with <span>Precision Medical Systems</span>
                </>
              )}
            </h1>

            <p>
              {savedData.description ||
                `Human Biomedical LLP is a trusted supplier of laboratory and hospital equipment, providing high-quality medical instruments, diagnostic systems, pathology analyzers, ICU & OT equipment, laboratory consumables, and healthcare solutions for hospitals, diagnostic centres, research laboratories, and clinics in ${location}.`}
            </p>

            <div className="hero-buttons">
              <Link href={getProductUrl()} className="primary-btn flex items-center gap-2">
                <span>{savedData.button1Text || "Explore Products"}</span>
                <ArrowRight size={18} />
              </Link>

              <Link href={getContactUrl()} className="secondary-btn flex items-center gap-2">
                <span>{savedData.button2Text || "Request Quote"}</span>
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="hero-highlights">
              <div className="highlight-item">
                <CheckCircle2 size={18} className="text-blue-600" />
                <span>ISO Certified Quality</span>
              </div>
              <div className="highlight-item">
                <CheckCircle2 size={18} className="text-blue-600" />
                <span>Pan-{location} Express Delivery</span>
              </div>
              <div className="highlight-item">
                <CheckCircle2 size={18} className="text-blue-600" />
                <span>24/7 Technical Support</span>
              </div>
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div className="hero-image">
            <div className="hero-image-wrapper">
              <img
                src={heroimg.src}
                alt={`Human Biomedical LLP - Laboratory & Hospital Equipment Supplier in ${location}`}
              />
              <div className="floating-card">
                <div className="flex items-center gap-3">
                  <div className="badge-icon-bg">
                    <BadgeCheck size={24} color="#0f6cbd" />
                  </div>
                  <div>
                    <h3>100% Genuine</h3>
                    <p>Certified Biomedical Products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="container-custom">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>5000+</h3>
              <p>Medical Products & Reagents</p>
            </div>

            <div className="stat-card">
              <h3>1000+</h3>
              <p>Hospitals & Labs Served</p>
            </div>

            <div className="stat-card">
              <h3>15+</h3>
              <p>Years Industry Excellence</p>
            </div>

            <div className="stat-card">
              <h3>99.4%</h3>
              <p>Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES / PRODUCT SHOWCASE */}
      <section className="categories-section">
        <div className="container-custom">
          <div className="section-heading">
            <span>Our Core Capabilities</span>
            <h2>Comprehensive Medical & Laboratory Solutions</h2>
            <p className="section-subtext">
              High-performance diagnostic equipment and essential laboratory consumables tailored for modern healthcare institutions across {location}.
            </p>
          </div>

          <div className="category-cards-grid">
            {/* Category 1 */}
            <div className="cat-card">
              <div className="cat-icon-wrapper">
                <Activity size={32} />
              </div>
              <h3>Electrolyte & Blood Analyzers</h3>
              <p>
                Fully automatic and semi-automatic blood analyzers, electrolyte analyzers, and reagents designed for rapid, high-throughput diagnostic accuracy.
              </p>
              <Link href={getProductUrl()} className="cat-link">
                <span>Browse Analyzers</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Category 2 */}
            <div className="cat-card">
              <div className="cat-icon-wrapper">
                <FlaskConical size={32} />
              </div>
              <h3>Clinical Chemistry Reagents</h3>
              <p>
                Premium diagnostic reagents, calibrators, and control solutions ensuring exact pathology readings with high stability and shelf-life.
              </p>
              <Link href={getProductUrl()} className="cat-link">
                <span>Explore Reagents</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Category 3 */}
            <div className="cat-card">
              <div className="cat-icon-wrapper">
                <Stethoscope size={32} />
              </div>
              <h3>Hospital & ICU Equipment</h3>
              <p>
                State-of-the-art ICU patient monitors, operation theatre lights, surgical tables, and vital diagnostic monitors for modern medical centers.
              </p>
              <Link href={getProductUrl()} className="cat-link">
                <span>View Hospital Gear</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Category 4 */}
            <div className="cat-card">
              <div className="cat-icon-wrapper">
                <Microscope size={32} />
              </div>
              <h3>Laboratory Consumables</h3>
              <p>
                Sterile laboratory plasticware, glass items, test kits, blood collection tubes, and diagnostic supplies for daily clinical routine.
              </p>
              <Link href={getProductUrl()} className="cat-link">
                <span>View Consumables</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-section">
        <div className="container-custom why-grid">
          <div className="why-image">
            <div className="why-img-frame">
              <img
                src={Homeimg.src}
                alt={`Human Biomedical LLP - Laboratory & Hospital Equipment in ${location}`}
              />
            </div>
          </div>

          <div className="why-content">
            <span className="sub-title">Why Choose Human Biomedical LLP</span>

            <h2>
              Your Trusted Medical & Laboratory Partner in {location}
            </h2>

            <p>
              Human Biomedical LLP delivers genuine biomedical equipment, pathology analyzers, hospital machines, and healthcare consumables. We combine top industry brands with expert calibration, quick delivery, and dedicated maintenance support across {location}.
            </p>

            <div className="why-features-grid">
              <div className="feature-card">
                <div className="f-icon">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4>100% Quality Assured</h4>
                  <p>Certified equipment with manufacturer guarantee.</p>
                </div>
              </div>

              <div className="feature-card">
                <div className="f-icon">
                  <Truck size={24} />
                </div>
                <div>
                  <h4>Fast & Secure Logistics</h4>
                  <p>Safe door-step delivery across {location}.</p>
                </div>
              </div>

              <div className="feature-card">
                <div className="f-icon">
                  <Award size={24} />
                </div>
                <div>
                  <h4>Turnkey Lab Setup</h4>
                  <p>Complete installation, training & calibration.</p>
                </div>
              </div>

              <div className="feature-card">
                <div className="f-icon">
                  <Headphones size={24} />
                </div>
                <div>
                  <h4>24/7 Expert Support</h4>
                  <p>On-call biomedical engineers & quick maintenance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES SECTION */}
      <section className="industry-section">
        <div className="container-custom">
          <div className="section-heading">
            <span>Sectors Served</span>
            <h2>Serving Healthcare Institutions Across {location}</h2>
            <p className="section-subtext">
              Trusted by medical buyers, lab directors, and clinical specialists in diverse medical domains.
            </p>
          </div>

          <div className="industry-grid">
            <div className="industry-card">
              <div className="ind-icon">🏥</div>
              <h3>Hospitals & Multi-Specialty Clinics</h3>
              <p>Complete hospital equipment, ICU setups, and patient monitoring solutions.</p>
            </div>

            <div className="industry-card">
              <div className="ind-icon">🧪</div>
              <h3>Pathology & Diagnostic Centers</h3>
              <p>High-precision automated analyzers, electrolyte machines & reagents.</p>
            </div>

            <div className="industry-card">
              <div className="ind-icon">🔬</div>
              <h3>Research & Biotech Institutes</h3>
              <p>Advanced lab instruments, centrifuges, incubators & research consumables.</p>
            </div>

            <div className="industry-card">
              <div className="ind-icon">💊</div>
              <h3>Pharma & Chemical Labs</h3>
              <p>Analytical instruments, quality control solutions & measurement tools.</p>
            </div>

            <div className="industry-card">
              <div className="ind-icon">🩺</div>
              <h3>Blood Banks & Medical Centers</h3>
              <p>Blood collection, storage centrifuges, cold chain, and testing kits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="trust-section">
        <div className="container-custom">
          <div className="trust-banner">
            <div className="trust-banner-content">
              <h2>Ready to Upgrade Your Laboratory or Hospital Infrastructure?</h2>
              <p>
                Get custom quotations, official product brochures, technical specifications, and expert advice for your medical equipment requirements in {location}.
              </p>
              <div className="trust-banner-btns">
                <Link href={getContactUrl()} className="primary-btn">
                  Get Instant Quotation
                </Link>
                <Link href={getProductUrl()} className="secondary-btn-white">
                  Browse Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className="testimonial-section">
        <div className="container-custom">
          <div className="section-heading">
            <span>Customer Testimonials</span>
            <h2>What Healthcare Professionals Say</h2>
          </div>

          <div className="testimonial-grid">
            <div className="testimonial-card">
              <div className="stars flex gap-1 text-amber-400">
                <Star size={18} fill="#f59e0b" stroke="none" />
                <Star size={18} fill="#f59e0b" stroke="none" />
                <Star size={18} fill="#f59e0b" stroke="none" />
                <Star size={18} fill="#f59e0b" stroke="none" />
                <Star size={18} fill="#f59e0b" stroke="none" />
              </div>
              <p>
                "Human Biomedical LLP provided our hospital with top-tier blood analyzers and prompt installation support. Their team is extremely knowledgeable and responsive."
              </p>
              <div className="client-info">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
                  alt="Healthcare Professional"
                />
                <div>
                  <h4>Dr. Rajesh Sharma</h4>
                  <span>Chief Pathologist, Apex Diagnostics</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars flex gap-1 text-amber-400">
                <Star size={18} fill="#f59e0b" stroke="none" />
                <Star size={18} fill="#f59e0b" stroke="none" />
                <Star size={18} fill="#f59e0b" stroke="none" />
                <Star size={18} fill="#f59e0b" stroke="none" />
                <Star size={18} fill="#f59e0b" stroke="none" />
              </div>
              <p>
                "We appreciate the wide range of laboratory instruments and diagnostic reagents. The product quality and timely technical guidance have been outstanding."
              </p>
              <div className="client-info">
                <img
                  src="https://images.unsplash.com/photo-1594824813571-24a69985731f?w=150&auto=format&fit=crop&q=80"
                  alt="Laboratory Director"
                />
                <div>
                  <h4>Dr. Sunita Mehta</h4>
                  <span>Director, LifeCare Laboratories</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars flex gap-1 text-amber-400">
                <Star size={18} fill="#f59e0b" stroke="none" />
                <Star size={18} fill="#f59e0b" stroke="none" />
                <Star size={18} fill="#f59e0b" stroke="none" />
                <Star size={18} fill="#f59e0b" stroke="none" />
                <Star size={18} fill="#f59e0b" stroke="none" />
              </div>
              <p>
                "From initial product inquiry to seamless delivery and after-sales maintenance, Human Biomedical LLP has consistently delivered dependable service in {location}."
              </p>
              <div className="client-info">
                <img
                  src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"
                  alt="Equipment Buyer"
                />
                <div>
                  <h4>Vikram Verma</h4>
                  <span>Procurement Head, City Hospital</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <div className="container-custom">
          <div className="section-heading">
            <span>Frequently Asked Questions</span>
            <h2>Got Questions? We Have Answers</h2>
          </div>

          <div className="faq-grid">
            <div className="faq-card">
              <div className="faq-header">
                <HelpCircle size={20} className="text-blue-600 shrink-0" />
                <h3>What products does Human Biomedical LLP supply?</h3>
              </div>
              <p>
                We supply laboratory instruments, blood analyzers, electrolyte analyzers, clinical reagents, hospital ICU equipment, operation theatre machines, diagnostic kits, and medical consumables.
              </p>
            </div>

            <div className="faq-card">
              <div className="faq-header">
                <HelpCircle size={20} className="text-blue-600 shrink-0" />
                <h3>Do you deliver products across {location}?</h3>
              </div>
              <p>
                Yes, we provide safe, insured, and timely delivery of laboratory and hospital equipment across {location} with complete logistic support.
              </p>
            </div>

            <div className="faq-card">
              <div className="faq-header">
                <HelpCircle size={20} className="text-blue-600 shrink-0" />
                <h3>Do you provide technical support & installation?</h3>
              </div>
              <p>
                Absolutely. Our experienced biomedical engineers provide complete installation, initial user training, system calibration, and prompt after-sales technical service.
              </p>
            </div>

            <div className="faq-card">
              <div className="faq-header">
                <HelpCircle size={20} className="text-blue-600 shrink-0" />
                <h3>How can I download a product brochure or spec sheet?</h3>
              </div>
              <p>
                You can browse any product page on our site and click the "Download Brochure (PDF)" button to get an instant, official PDF brochure with technical specifications.
              </p>
            </div>

            <div className="faq-card">
              <div className="faq-header">
                <HelpCircle size={20} className="text-blue-600 shrink-0" />
                <h3>Can I request a customized quotation?</h3>
              </div>
              <p>
                Yes! Click the "Request Quote" or "Get Quote" button anywhere on our website to submit your lab or hospital requirements and get pricing within hours.
              </p>
            </div>

            <div className="faq-card">
              <div className="faq-header">
                <HelpCircle size={20} className="text-blue-600 shrink-0" />
                <h3>Are your products certified and genuine?</h3>
              </div>
              <p>
                Yes, all equipment and diagnostic reagents supplied by Human Biomedical LLP come directly from certified manufacturers with original warranty and documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO & FOOTER PRE-BANNER */}
      <section className="seo-banner-section">
        <div className="container-custom">
          <h2>
            Human Biomedical LLP – Leading Medical & Laboratory Equipment Supplier in {location}
          </h2>
          <p>
            Human Biomedical LLP is a premier supplier of laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, laboratory consumables, and healthcare solutions in {location}. We serve hospitals, pathology labs, diagnostic centers, research institutes, medical colleges, clinics, and healthcare facilities with top quality brands, competitive pricing, expert technical support, and express delivery.
          </p>
        </div>
      </section>
    </>
  );
}
