"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
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
  const [contactInfo, setContactInfo] =
    useState([]);

  const [stateName, setStateName] =
    useState("");

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
        // Contact Info
        const contactSnap = await getDoc(
          doc(
            db,
            "websites",
            "humanbiomedicalcom",
            "pages",
            "contact"
          )
        );

        if (contactSnap.exists()) {
          setContactInfo(
            contactSnap.data()
              .contactInfo || []
          );
        }

        // District State
        if (district) {
          const districtSnap =
            await getDoc(
              doc(
                db,
                "websites",
                "humanbiomedicalcom",
                "districts",
                district
              )
            );

          if (
            districtSnap.exists()
          ) {
            setStateName(
              districtSnap.data()
                ?.state || ""
            );
          }
        }
      } catch (err) {
        console.log(err);
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