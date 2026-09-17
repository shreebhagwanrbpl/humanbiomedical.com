"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import "./footer.css";

const DEFAULT_CONTACT_INFO = [
  { label: "Address", value: "Unit S-1, 2nd Floor, Pn 16, D Block, Tagore Nagar, Vaishali Nagar, Jaipur, Rajasthan 302021" },
  { label: "Phone", value: "+91 98290 12345" },
  { label: "Email", value: "info@humanbiomedical.com" },
];

export default function Footer({
  districtData,
}) {
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT_INFO);
  const [stateName, setStateName] = useState("");
  const params = useParams();

  const district =
    params?.district || "";

  const getLink = (path) => {
    return district
      ? `/${district}${path}`
      : path;
  };

  const districtName =
    district || "India";

  const districtSlug =
    district || "";

  const formattedDistrict =
    districtName
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");

  const Office =
    districtSlug
      ? stateName
        ? `${formattedDistrict}, ${stateName}, India`
        : `${formattedDistrict}, India`
      : "Jaipur, Rajasthan, India";

  useEffect(() => {
    const loadData = async () => {
      try {
        const BASE_URL = "https://firestore.googleapis.com/v1/projects/rajbiosis-central/databases/(default)/documents";

        // Fetch contact info
        const contactRes = await fetch(`${BASE_URL}/websites/humanbiomedicalcom/pages/contact`);
        if (contactRes.ok) {
          const contactData = await contactRes.json();
          const rawItems = contactData.fields?.contactInfo?.arrayValue?.values || [];
          const parsed = rawItems.map((item) => ({
            label: item.mapValue?.fields?.label?.stringValue || "",
            value: item.mapValue?.fields?.value?.stringValue || "",
          }));
          if (parsed.length > 0) {
            setContactInfo(parsed);
          }
        }

        // District State
        if (district) {
          const distRes = await fetch(`${BASE_URL}/websites/humanbiomedicalcom/districts/${encodeURIComponent(district.toLowerCase())}`);
          if (distRes.ok) {
            const distData = await distRes.json();
            const state = distData.fields?.state?.stringValue;
            if (state) {
              setStateName(state);
            }
          }
        }
      } catch (err) {
        // Silently fall back to DEFAULT_CONTACT_INFO
      }
    };

    loadData();
  }, [district]);

  const getValue = (key) => {
    return (
      contactInfo.find((item) =>
        item.label
          ?.toLowerCase()
          .includes(key.toLowerCase())
      )?.value || ""
    );
  };
  return (
    <footer className="footer">
      <div className="container-custom">

        <div className="footer-top">

          {/* COMPANY */}
          <div className="footer-column">

            <h2 className="footer-logo">
              Human Biomedical LLP
            </h2>

            <p className="footer-text">
              Human Biomedical LLP is a trusted supplier of laboratory
              instruments, hospital equipment, diagnostic systems,
              pathology analyzers, medical devices, laboratory
              consumables, and healthcare solutions for hospitals,
              laboratories, research institutions, clinics, nursing
              homes, and healthcare organizations across India.
            </p>

            <div className="social-icons">
              {/* <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a> */}

              {<a
                href="https://www.instagram.com/humanbiomedicals/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>}

              {/* <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a> */}

              {/* <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a> */}
            </div>

          </div>

          {/* QUICK LINKS */}
          <div className="footer-column">

            <h3>Quick Links</h3>

            <Link href={getLink("/")}>
              Home
            </Link>

            <Link href={getLink("/about")}>
              About Us
            </Link>

            <Link href={getLink("/products")}>
              Products
            </Link>

            <Link href={getLink("/services")}>
              Services
            </Link>

            <Link href={getLink("/contact")}>
              Contact Us
            </Link>

          </div>

          {/* SERVICES */}
          <div className="footer-column">

            <h3>Our Services</h3>

            <Link href={getLink("/products")}>
              Laboratory Instruments
            </Link>

            <Link href={getLink("/products")}>
              Hospital Equipment
            </Link>

            <Link href={getLink("/products")}>
              Diagnostic Systems
            </Link>

            <Link href={getLink("/products")}>
              Medical Devices
            </Link>

            <Link href={getLink("/contact")}>
              Technical Support
            </Link>

          </div>

          {/* CONTACT */}
          <div className="footer-column">

            <h3>Contact Info</h3>

            <p>
              📍 {getValue("address")}
            </p>

            <p>
              📞{" "}
              {getValue("phone") ||
                "+91 XXXXX XXXXX"}
            </p>

            <p>
              ✉️{" "}
              {getValue("email") ||
                "info@humanbiomedical.com"}
            </p>

          </div>

        </div>

        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} Human Biomedical LLP. All Rights Reserved.
          </p>

        </div>

      </div>
    </footer>
  );
}