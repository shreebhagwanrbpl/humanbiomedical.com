import "./about.css";

import Link from "next/link";
import Aboutmain from "../img/Aboutmain.jpg";

export const metadata = {
  title:
    "About Human Biomedical LLP | Trusted Laboratory & Hospital Equipment Supplier",

  description:
    "Learn about Human Biomedical LLP, a trusted supplier of laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, laboratory consumables, and healthcare solutions across India.",

  keywords: [
    "about Human Biomedical LLP",
    "laboratory equipment supplier India",
    "hospital equipment supplier India",
    "medical equipment supplier",
    "laboratory instruments supplier",
    "diagnostic equipment supplier",
    "pathology analyzer supplier",
    "medical devices supplier",
    "laboratory consumables supplier",
    "healthcare equipment supplier",
    "hospital laboratory supplier",
    "medical equipment company India",
    "diagnostic laboratory equipment",
    "laboratory instruments India",
    "hospital medical devices",
    "healthcare solutions India",
  ],

  alternates: {
    canonical: "https://humanbiomedical.com/about",
  },

  openGraph: {
    title:
      "About Human Biomedical LLP | Laboratory & Hospital Equipment Supplier",

    description:
      "Human Biomedical LLP is a trusted supplier of laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, laboratory consumables, and healthcare solutions for hospitals, laboratories, diagnostic centres, research institutes, and healthcare organizations across India.",

    url: "https://humanbiomedical.com/about",

    siteName: "Human Biomedical LLP",

    locale: "en_IN",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "About Human Biomedical LLP | Laboratory & Hospital Equipment Supplier",

    description:
      "Trusted supplier of laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, laboratory consumables, and healthcare solutions across India.",
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

export default function AboutPage({
  districtData,
}) {
  const location =
    districtData?.district || "India";
  return (
    <>
      {/* HERO */}
      {/* <section className="about-hero">
        <div className="container-custom">

        
        </div>
      </section> */}

      <section className="seo-about">
        <div className="container-custom">
          <span className="page-tag">
            About Human Biomedical LLP in {location}
          </span>

          <h2>
            Trusted Laboratory & Hospital Equipment Supplier in {location}
          </h2>

          <p>
            Human Biomedical LLP is a trusted supplier of laboratory instruments,
            hospital equipment, diagnostic systems, pathology analyzers, medical
            devices, laboratory consumables, and healthcare solutions in {location}.
            We proudly serve hospitals, pathology laboratories, diagnostic centres,
            research institutions, medical colleges, clinics, nursing homes, and
            healthcare organizations with reliable products, competitive pricing,
            expert technical support, and dependable delivery.
          </p>
        </div>
      </section>

      {/* COMPANY INTRO */}
      <section className="company-section">
        <div className="container-custom company-grid">
          <div className="company-image">
            <img
              src={Aboutmain.src}
              alt={`Human Biomedical LLP - Laboratory & Hospital Equipment Supplier in ${location}`}
            />
          </div>

          <div className="company-content">
            <span>Who We Are</span>

            <h2>
              Leading Supplier of Laboratory & Hospital Equipment in {location}
            </h2>

            <p>
              Human Biomedical LLP specializes in supplying high-quality laboratory
              instruments, diagnostic equipment, hospital machines, pathology
              analyzers, ICU & OT equipment, medical devices, laboratory
              consumables, and healthcare solutions. Our mission is to support
              healthcare professionals with dependable products that improve patient
              care and laboratory efficiency.
            </p>

            <p>
              We are committed to quality, innovation, customer satisfaction, and
              long-term partnerships by providing trusted products, expert guidance,
              timely delivery, and reliable after-sales support across {location}.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="about-stats">
        <div className="container-custom stats-about-grid">
          <div className="stat-card">
            <h2>5000+</h2>
            <p>Medical Products</p>
          </div>

          <div className="stat-card">
            <h2>1000+</h2>
            <p>Hospitals & Laboratories Served</p>
          </div>

          <div className="stat-card">
            <h2>15+</h2>
            <p>Years of Industry Experience</p>
          </div>

          <div className="stat-card">
            <h2>24/7</h2>
            <p>Technical & After-Sales Support</p>
          </div>
        </div>
      </section>

      {/* MISSION VISION */}
      <section className="mission-section">
        <div className="container-custom mission-grid">
          <div className="mission-card">
            <h2>Our Mission</h2>

            <p>
              To provide high-quality laboratory instruments, hospital equipment,
              diagnostic systems, and healthcare solutions that help hospitals,
              laboratories, and healthcare professionals deliver accurate diagnostics
              and better patient care.
            </p>
          </div>

          <div className="mission-card">
            <h2>Our Vision</h2>

            <p>
              To become one of the most trusted suppliers of laboratory and hospital
              equipment in {location} by delivering innovative healthcare solutions,
              premium-quality products, exceptional customer service, and long-term
              value to healthcare institutions.
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      {/* WHY CHOOSE */}
      <section className="why-about">
        <div className="container-custom">
          <div className="section-heading">
            <span>Why Choose Human Biomedical LLP</span>
            <h2>Why Hospitals, Laboratories & Healthcare Institutions Trust Us</h2>
          </div>

          <div className="why-grid-about">
            <div className="why-card">
              🏥 Premium Laboratory & Hospital Equipment
            </div>

            <div className="why-card">
              ✅ Trusted Quality & Reliable Performance
            </div>

            <div className="why-card">
              🚚 Fast Delivery Across {location}
            </div>

            <div className="why-card">
              🎧 Expert Technical & After-Sales Support
            </div>

            <div className="why-card">
              🔬 Wide Range of Medical & Diagnostic Products
            </div>

            <div className="why-card">
              🤝 Trusted Partner for Healthcare Institutions
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="timeline-section">
        <div className="container-custom">
          <div className="section-heading">
            <span>Our Journey</span>
            <h2>Delivering Quality Healthcare Solutions in {location}</h2>
          </div>

          <div className="timeline">
            <div className="timeline-card">
              <h3>Foundation</h3>
              <p>
                Started with a vision to provide reliable laboratory and hospital
                equipment for healthcare professionals.
              </p>
            </div>

            <div className="timeline-card">
              <h3>Growth</h3>
              <p>
                Expanded our portfolio with laboratory instruments, diagnostic
                systems, medical devices, and healthcare solutions.
              </p>
            </div>

            <div className="timeline-card">
              <h3>Trusted Partner</h3>
              <p>
                Serving hospitals, pathology laboratories, diagnostic centres,
                clinics, research institutes, and healthcare organizations.
              </p>
            </div>

            <div className="timeline-card">
              <h3>Today</h3>
              <p>
                Continuing to deliver premium medical equipment, competitive pricing,
                expert support, and reliable healthcare solutions across {location}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container-custom cta-box-about">
          <h2>
            Looking for Laboratory & Hospital Equipment?
          </h2>

          <p>
            Human Biomedical LLP offers a comprehensive range of laboratory
            instruments, hospital equipment, diagnostic systems, pathology analyzers,
            medical devices, laboratory consumables, and healthcare solutions. Contact
            our team for expert guidance, competitive pricing, and reliable delivery
            across {location}.
          </p>

          <Link
            href={
              districtData?.slug
                ? `/${districtData.slug}/contact`
                : "/contact"
            }
          >
            <button>Contact Us</button>
          </Link>
        </div>
      </section>
    </>
  );
}
