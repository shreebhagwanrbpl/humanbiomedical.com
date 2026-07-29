import "./home.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Homeimg from "./img/Homeimg.jpg";
// import picone from "./img/tg.png";
import heroimg from "./img/heroimg.jpg";
// import pictwo from "./img/we.png";
// import picthree from "./img/d.png";
// import humanbiomedicalcom from "./img/humanbiomedicalcom.png";

import Image from "next/image";

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

      description:
        `Explore premium laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, and healthcare solutions from Human Biomedical LLP in ${location}.`,

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

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container-custom hero-grid">
          <div className="hero-content">

            <span className="hero-badge">
              Human Biomedical LLP – Trusted Laboratory & Hospital Equipment Supplier in {location}
            </span>

            <h1>
              {savedData.title} in {location}
            </h1>

            <p>
              {savedData.description ||
                `Human Biomedical LLP is a trusted supplier of laboratory and hospital equipment, providing high-quality medical instruments, diagnostic systems, pathology analyzers, ICU equipment, operation theatre equipment, laboratory consumables, and healthcare solutions for hospitals, diagnostic centres, research laboratories, and clinics in ${location}.`}
            </p>

            <div className="hero-buttons">
              <Link
                href={
                  districtData?.slug
                    ? `/${districtData.slug}/products`
                    : "/products"
                }
                className="primary-btn"
              >
                {savedData.button1Text || "Explore Products"}
              </Link>

              <Link
                href={
                  districtData?.slug
                    ? `/${districtData.slug}/contact`
                    : "/contact"
                }
                className="primary-btn"
              >
                {savedData.button2Text || "Contact Us"}
              </Link>
            </div>

          </div>

          <div className="hero-image">
            {/* Uncomment if using an image */}

            <img
              src={heroimg.src}
              alt={`Human Biomedical LLP - Laboratory & Hospital Equipment Supplier in ${location}`}
            />
          </div>
        </div>

        <div className="stats-grid">

          <div>
            <h3>5000+</h3>
            <p>Medical Products</p>
          </div>

          <div>
            <h3>1000+</h3>
            <p>Hospitals & Laboratories Served</p>
          </div>

          <div>
            <h3>15+</h3>
            <p>Years of Industry Experience</p>
          </div>

        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="trust-section">
        <div className="container-custom">
          <h2>
            Your Trusted Partner for Laboratory & Hospital Equipment in {location}
          </h2>

          <div className="trust-grid">
            <div className="trust-card">
              ✔ Premium Quality Medical Equipment
            </div>

            <div className="trust-card">
              ✔ Laboratory & Diagnostic Solutions
            </div>

            <div className="trust-card">
              ✔ Fast Delivery Across {location}
            </div>

            <div className="trust-card">
              ✔ Installation, Training & Technical Support
            </div>
          </div>
        </div>
      </section>


      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container-custom cta-box">
          <h2>
            Looking for High-Quality Laboratory & Hospital Equipment?
          </h2>

          <p>
            Human Biomedical LLP provides premium laboratory instruments, diagnostic
            equipment, pathology analyzers, hospital machines, ICU & OT equipment,
            medical consumables, and complete healthcare solutions with competitive
            pricing, expert technical support, and fast delivery across {location}.
          </p>

          <Link
            href={
              districtData?.slug
                ? `/${districtData.slug}/about`
                : "/about"
            }
            className="primary-btn"
          >
            About Human Biomedical LLP
          </Link>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-section">
        <div className="container-custom why-grid">
          <div className="why-image">
            <img
              src={Homeimg.src}
              alt={`Human Biomedical LLP - Laboratory & Hospital Equipment in ${location}`}
            />
          </div>

          <div className="why-content">
            <span>Why Choose Human Biomedical LLP</span>

            <h2>
              Trusted Laboratory & Hospital Equipment Supplier in {location}
            </h2>

            <p>
              Human Biomedical LLP is a trusted supplier of laboratory instruments,
              diagnostic equipment, pathology analyzers, hospital machines, ICU &
              OT equipment, medical consumables, and healthcare solutions. We are
              committed to delivering premium-quality products, reliable performance,
              competitive pricing, expert technical support, and fast delivery across{" "}
              {location}.
            </p>

            <div className="why-features">
              <div className="feature-box">
                ✅ Premium Quality Medical Equipment
              </div>

              <div className="feature-box">
                🚚 Fast Delivery Across {location}
              </div>

              <div className="feature-box">
                🏥 Complete Laboratory & Hospital Solutions
              </div>

              <div className="feature-box">
                🎧 Expert Technical & After-Sales Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES SECTION */}
      <section className="industry-section">
        <div className="container-custom">
          <div className="section-heading">
            <span>Industries We Serve</span>

            <h2>
              Serving Hospitals, Laboratories & Healthcare Institutions Across {location}
            </h2>
          </div>

          <div className="industry-grid">
            <div className="industry-card">
              🏥 Hospitals & Multi-Specialty Healthcare Centers
            </div>

            <div className="industry-card">
              🧪 Pathology & Diagnostic Laboratories
            </div>

            <div className="industry-card">
              🔬 Research & Educational Institutions
            </div>

            <div className="industry-card">
              💊 Pharmaceutical & Biotechnology Companies
            </div>

            <div className="industry-card">
              🏨 Clinics, Nursing Homes & Healthcare Facilities
            </div>

            <div className="industry-card">
              🩺 Blood Banks & Medical Centers
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className="testimonial-section">
        <div className="container-custom">
          <div className="section-heading">
            <span>Customer Feedback</span>
            <h2>What Healthcare Professionals Appreciate About Us</h2>
          </div>

          <div className="testimonial-grid">

            <div className="testimonial-card">
              <div className="stars">★★★★★</div>

              <p>
                Human Biomedical LLP provides high-quality laboratory and hospital
                equipment with reliable performance. Their team offers prompt support
                and timely delivery, making procurement smooth and efficient.
              </p>

              <div className="client-info">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Healthcare Professional"
                />

                <div>
                  <h4>Healthcare Professional</h4>
                  <span>Hospital Procurement Team</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">★★★★★</div>

              <p>
                We appreciate the wide range of laboratory instruments, diagnostic
                equipment, and medical devices. The product quality and technical
                assistance have been excellent.
              </p>

              <div className="client-info">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Laboratory Professional"
                />

                <div>
                  <h4>Laboratory Professional</h4>
                  <span>Diagnostic Laboratory</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">★★★★★</div>

              <p>
                From product selection to after-sales support, Human Biomedical LLP
                has consistently delivered dependable service and quality healthcare
                solutions across {location}.
              </p>

              <div className="client-info">
                <img
                  src="https://randomuser.me/api/portraits/men/50.jpg"
                  alt="Medical Equipment Buyer"
                />

                <div>
                  <h4>Medical Equipment Buyer</h4>
                  <span>Healthcare Institution</span>
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

            <h2>
              Common Questions About Laboratory & Hospital Equipment
            </h2>
          </div>

          <div className="faq-grid">
            <div className="faq-card">
              <h3>What products does Human Biomedical LLP supply?</h3>

              <p>
                We supply a wide range of laboratory instruments, diagnostic
                equipment, hospital machines, pathology analyzers, ICU & OT
                equipment, medical consumables, reagents, and healthcare devices
                from trusted brands.
              </p>
            </div>

            <div className="faq-card">
              <h3>Do you deliver products across {location}?</h3>

              <p>
                Yes, we provide safe and timely delivery of laboratory and hospital
                equipment across {location}, ensuring secure packaging and reliable
                logistics support.
              </p>
            </div>

            <div className="faq-card">
              <h3>Who can purchase your medical equipment?</h3>

              <p>
                Our products are supplied to hospitals, diagnostic centres,
                pathology laboratories, research institutions, clinics, nursing
                homes, medical colleges, and other healthcare organizations.
              </p>
            </div>

            <div className="faq-card">
              <h3>Do you provide installation and technical support?</h3>

              <p>
                Yes, we offer expert technical guidance, product assistance, and
                after-sales support for selected laboratory and hospital equipment
                to ensure smooth operation.
              </p>
            </div>

            <div className="faq-card">
              <h3>Can I request a quotation for multiple products?</h3>

              <p>
                Absolutely. You can contact our team to receive a customized
                quotation based on your laboratory or hospital requirements.
              </p>
            </div>

            <div className="faq-card">
              <h3>Do you supply products from leading medical brands?</h3>

              <p>
                Yes, we offer quality laboratory and hospital equipment from trusted
                manufacturers to meet the needs of healthcare professionals and
                medical institutions.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section
        style={{
          textAlign: "center",
          padding: "40px 0",
        }}
      >
        <Link
          href={
            districtData?.slug ? `/${districtData.slug}/products` : "/products"
          }
          style={{
            color: "#1565d8",
            fontSize: "18px",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          Browse Medical Equipment & Laboratory Products in {location}
        </Link>
      </section>

      <section
        style={{
          padding: "50px 0",
          background: "#fff",
        }}
      >
        <div className="container-custom">
          <h2>
            Human Biomedical LLP – Trusted Medical Equipment Supplier in {location}
          </h2>

          <p>
            Human Biomedical LLP is a leading supplier of laboratory instruments,
            hospital equipment, diagnostic systems, pathology analyzers, ICU & OT
            equipment, medical devices, laboratory consumables, and healthcare
            solutions in {location}. We provide reliable products from trusted brands
            for hospitals, pathology laboratories, diagnostic centres, research
            institutes, medical colleges, clinics, and healthcare facilities,
            supported by competitive pricing, expert technical assistance, and timely
            delivery.
          </p>
        </div>
      </section>
    </>
  );
}
