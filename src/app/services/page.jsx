import "./services.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
export const metadata = {
  title:
    "Laboratory & Hospital Equipment Services in India | Human Biomedical LLP",

  description:
    "Human Biomedical LLP provides laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, laboratory consumables, and healthcare solutions across India for hospitals, laboratories, clinics, research institutions, and healthcare organizations.",

  keywords: [
    "laboratory equipment supplier india",
    "hospital equipment supplier india",
    "medical equipment supplier india",
    "diagnostic equipment supplier",
    "pathology laboratory equipment",
    "medical devices supplier india",
    "laboratory instruments india",
    "healthcare equipment supplier",
    "laboratory consumables supplier",
    "hospital furniture supplier",
    "ICU equipment supplier india",
    "OT equipment supplier india",
    "diagnostic systems india",
    "research laboratory equipment",
    "Human Biomedical LLP",
  ],

  alternates: {
    canonical: "https://humanbiomedical.com/services",
  },

  openGraph: {
    title:
      "Laboratory & Hospital Equipment Services in India | Human Biomedical LLP",

    description:
      "Human Biomedical LLP is a trusted supplier of laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, laboratory consumables, and healthcare solutions across India.",

    url: "https://humanbiomedical.com/services",
    siteName: "Human Biomedical LLP",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default async function Services({
  districtData,
}) {

  const districtName =
    districtData?.district ||
    "India";
  const snap = await getDoc(
    doc(db, "websites", "humanbiomedicalcom", "pages", "services")
  );

  const firebaseServices = snap.exists()
    ? snap.data().services || []
    : [];

  const icons = [
    "🧪",
    "⚡",
    "🔬",
    "🏥",
    "🚚",
    "🎧",
  ];

  return (
    <>
      {/* HERO */}
      <section className="services-hero">
        <div className="container-custom">
          <span className="service-tag">Our Services</span>


          <h1>
            Laboratory & Hospital Equipment in {districtName}
          </h1>


          <p>
            Explore our comprehensive range of laboratory instruments,
            hospital equipment, diagnostic systems, pathology analyzers,
            medical devices, laboratory consumables, and healthcare
            solutions. Human Biomedical LLP supplies premium-quality
            products for hospitals, diagnostic centres, pathology
            laboratories, research institutions, clinics, nursing homes,
            and healthcare organizations across {districtName}.
          </p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="services-section pt-16">
        <div className="container-custom">
          <div className="section-heading">
            <span>What We Offer</span>

            <h2>
              Complete Laboratory & Hospital Equipment Solutions
            </h2>
          </div>

          <div className="services-grid">
            {firebaseServices.slice(0, 6).map((item, index) => (
              <div className="service-card" key={index}>
                <div className="service-icon">
                  {icons[index] || "🏥"}
                </div>

                <h3>{item.title}</h3>

                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process-section pt-20">
        <div className="container-custom">
          <div className="section-heading">
            <span>How We Work</span>

            <h2>Our Service Process</h2>
          </div>

          <div className="process-grid">

            <div className="process-card">
              <h3>01</h3>
              <h4>Requirement Analysis</h4>

              <p>
                We understand your laboratory, hospital, and healthcare equipment
                requirements.
              </p>
            </div>

            <div className="process-card">
              <h3>02</h3>
              <h4>Product Recommendation</h4>

              <p>
                Our experts recommend the most suitable laboratory and medical
                equipment based on your needs.
              </p>
            </div>

            <div className="process-card">
              <h3>03</h3>
              <h4>Fast Delivery</h4>

              <p>
                Secure and timely delivery of medical equipment across{" "}
                {districtName}.
              </p>
            </div>

            <div className="process-card">
              <h3>04</h3>
              <h4>Technical Support</h4>

              <p>
                Expert installation guidance and dependable after-sales support
                whenever required.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="why-service py-20">
        <div className="container-custom why-grid-service">

          <div className="why-service-image">
            <img
              src="https://images.unsplash.com/photo-1581594549595-35f6edc7b762?q=80&w=1200"
              alt={`Laboratory & Hospital Equipment Supplier in ${districtName}`}
            />
          </div>

          <div className="why-service-content">

            <span>Why Choose Human Biomedical LLP</span>

            <h2>
              Trusted Laboratory & Hospital Equipment Supplier
            </h2>

            <p>
              Human Biomedical LLP is committed to supplying premium laboratory
              instruments, diagnostic systems, hospital equipment, medical
              devices, and healthcare solutions with reliable quality,
              competitive pricing, expert technical support, and timely
              delivery.
            </p>

            <div className="service-features">
              <div>🏥 Premium Medical Equipment</div>

              <div>🚚 Fast Delivery Across {districtName}</div>

              <div>🎧 Expert Technical Support</div>

              <div>🔬 Reliable Healthcare Solutions</div>
            </div>

          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="seo-services py-20">
        <div className="container-custom">

          <h2>
            Trusted Laboratory & Hospital Equipment Supplier in {districtName}
          </h2>

          <p>
            Human Biomedical LLP is a trusted supplier of laboratory
            instruments, hospital equipment, diagnostic systems, pathology
            analyzers, ICU & OT equipment, medical devices, laboratory
            consumables, and healthcare solutions in {districtName}. We serve
            hospitals, pathology laboratories, diagnostic centres, research
            institutions, clinics, nursing homes, blood banks, and healthcare
            organizations with quality products, competitive pricing, expert
            support, and dependable delivery.
          </p>

        </div>
      </section>

      {/* CTA */}
      <section className="service-cta">
        <div className="container-custom service-cta-box">

          <h2>
            Looking for Laboratory & Hospital Equipment?
          </h2>

          <p>
            Contact Human Biomedical LLP for high-quality laboratory
            instruments, hospital equipment, diagnostic systems, medical
            devices, and healthcare solutions with expert support and
            competitive pricing.
          </p>

          <Link
            href={
              districtData?.slug
                ? `/${districtData.slug}/contact`
                : "/contact"
            }
          >
            <button>
              Contact Us
            </button>
          </Link>

        </div>
      </section>
    </>
  );
}
