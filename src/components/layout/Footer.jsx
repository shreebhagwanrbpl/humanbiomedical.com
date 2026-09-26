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

export default function Footer({
  districtData,
}) {
  const [contactInfo, setContactInfo] = useState([]);
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
        // Fetch contact info
        const contactRes = await fetch(
          `/api/site-data?type=contact&companyId=human&websiteId=humanbiomedicalcom&t=${Date.now()}`
        );
        if (contactRes.ok) {
          const json = await contactRes.json();
          const data = json.data;
          if (data && Array.isArray(data.contactInfo)) {
            setContactInfo(data.contactInfo);
          } else if (Array.isArray(data)) {
            setContactInfo(data);
          }
        }

        // District State
        if (district) {
          const distRes = await fetch(
            `/api/site-data?type=district&district=${encodeURIComponent(
              district.toLowerCase()
            )}&companyId=human&websiteId=humanbiomedicalcom&t=${Date.now()}`
          );
          if (distRes.ok) {
            const distJson = await distRes.json();
            const dData = distJson.data;
            if (dData && dData.state) {
              setStateName(dData.state);
            }
          }
        }
      } catch (err) {
        // Silently handle
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
              <a
                href="https://www.instagram.com/humanbiomedicals/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
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
              📍 {getValue("address") || Office}
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