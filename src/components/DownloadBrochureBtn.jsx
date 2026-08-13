"use client";

import { useState, useRef } from "react";
import { Download, Loader2 } from "lucide-react";

export default function DownloadBrochureBtn({ product }) {
  const [downloading, setDownloading] = useState(false);
  const [base64Img, setBase64Img] = useState(null);
  const brochureRef = useRef(null);

  // Extract raw image URL from product object or DOM
  const getRawImageSrc = () => {
    if (Array.isArray(product?.images) && product.images.length > 0 && product.images[0]) {
      return product.images[0];
    }
    if (typeof product?.image === "string" && product.image.trim() !== "") {
      return product.image;
    }
    // Fallback: check main-product-image in DOM if rendered
    if (typeof document !== "undefined") {
      const domImg = document.querySelector(".main-product-image");
      if (domImg && domImg.src) {
        return domImg.src;
      }
    }
    return "";
  };

  // Convert image URL to base64 Data URL using API proxy + canvas fallback
  const fetchImageAsBase64 = async (url) => {
    if (!url || typeof url !== "string") return null;
    if (url.startsWith("data:")) return url;

    // 1. Try server-side proxy endpoint first (bypasses CORS completely)
    if (url.startsWith("http://") || url.startsWith("https://")) {
      try {
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl);
        if (res.ok) {
          const data = await res.json();
          if (data?.dataUrl) {
            return data.dataUrl;
          }
        }
      } catch (e1) {
        console.warn("Proxy API fetch failed:", e1);
      }
    }

    // 2. Fallback for relative URLs or local images
    let fullUrl = url;
    if (url.startsWith("/") && typeof window !== "undefined") {
      fullUrl = window.location.origin + url;
    }

    try {
      const res = await fetch(fullUrl);
      if (res.ok) {
        const blob = await res.blob();
        return await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        });
      }
    } catch (e2) {
      console.warn("Direct blob fetch failed:", e2);
    }

    // 3. Fallback to Image canvas draw
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width || 400;
          canvas.height = img.naturalHeight || img.height || 400;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg", 0.95));
        } catch (e3) {
          console.warn("Canvas toDataURL failed:", e3);
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = fullUrl;
    });
  };

  const handleDownloadPDF = async () => {
    if (downloading) return;
    setDownloading(true);

    try {
      const html2canvasModule = await import("html2canvas");
      const jsPDFModule = await import("jspdf");

      const html2canvas = html2canvasModule.default || html2canvasModule;
      const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default || jsPDFModule;

      // 1. Fetch current product's image as Base64 data URL
      const rawImg = getRawImageSrc();
      let imgB64 = null;
      if (rawImg) {
        imgB64 = await fetchImageAsBase64(rawImg);
      }
      setBase64Img(imgB64);

      // 2. Wait for DOM to update with the base64 image
      await new Promise((res) => setTimeout(res, 300));

      const element = brochureRef.current;
      if (!element) {
        throw new Error("Brochure element reference not found");
      }

      // 3. Capture element with html2canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 794,
        windowHeight: 1123,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

      const fileName = `${(product?.title || "product")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}-brochure.pdf`;

      pdf.save(fileName);
    } catch (err) {
      console.error("Failed to generate PDF brochure:", err);
      alert("Could not generate PDF brochure. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  // DYNAMIC DATA FROM THE CURRENT PRODUCT
  const productTitle = product?.title || "Medical Equipment";
  const brandName = product?.brand || "Human Biomedical";
  const modelName = product?.model || product?.modelNumber || "";
  const instrument = product?.instrument || product?.type || product?.category || "Diagnostic Equipment";
  const category = product?.category || "Medical Equipment";
  const subCategory = product?.subCategory || "Biomedical Supplies";
  const automation = product?.automation || "";
  const usage = product?.usage || product?.application || "";
  const parameters = product?.parameters || "";
  const throughput = product?.throughput || "";
  const availability = product?.availability || "In Stock";
  const description =
    product?.desc ||
    `${productTitle} is a high-quality laboratory and hospital equipment supplied by Human Biomedical LLP. Designed for reliable performance in laboratories, hospitals, pathology centers, and diagnostic facilities.`;

  // Construct main header title dynamically
  let fullProductHeading = "";
  if (brandName && !productTitle.toLowerCase().includes(brandName.toLowerCase())) {
    fullProductHeading += `${brandName.toUpperCase()} `;
  }
  fullProductHeading += productTitle.toUpperCase();
  if (modelName) {
    fullProductHeading += `, MODEL: ${modelName.toUpperCase()}`;
  }

  // Determine displayed image source for brochure template
  const currentDisplayedImage = base64Img || getRawImageSrc() || "/images/products/default.webp";

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleDownloadPDF}
        disabled={downloading}
        className="download-brochure-btn"
        style={{
          background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
          color: "#ffffff",
          padding: "12px 24px",
          borderRadius: "8px",
          border: "none",
          fontWeight: 600,
          fontSize: "15px",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 4px 12px rgba(13, 148, 136, 0.25)",
          transition: "all 0.2s ease",
        }}
      >
        {downloading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" style={{ animation: "spin 1s linear infinite" }} />
            <span>Generating PDF...</span>
          </>
        ) : (
          <>
            <Download size={18} />
            <span>Download Brochure (PDF)</span>
          </>
        )}
      </button>

      {/* Hidden Off-Screen A4 Brochure Template */}
      <div
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          width: "794px",
          height: "1123px",
          background: "#ffffff",
          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
          boxSizing: "border-box",
          padding: "36px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#1e293b",
          zIndex: -9999,
        }}
        ref={brochureRef}
      >
        {/* TOP HEADER */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "10px",
            }}
          >
            {/* Logo Left */}
            <div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#0d9488",
                  letterSpacing: "-0.5px",
                  lineHeight: "1.1",
                }}
              >
                Human Biomedical
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#64748b",
                  letterSpacing: "1.5px",
                  marginTop: "3px",
                  textTransform: "uppercase",
                }}
              >
                TRUSTED BIOMEDICAL SYSTEMS
              </div>
            </div>

            {/* Contact Right */}
            <div
              style={{
                textAlign: "right",
                fontSize: "11px",
                color: "#475569",
                lineHeight: "1.4",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#0d9488",
                  marginBottom: "2px",
                }}
              >
                www.humanbiomedical.com
              </div>
              <div>Email: humanbiomedicals@gmail.com</div>
              <div>Mob: +91 8112279728</div>
              <div>Mob: +91 9251598228</div>
            </div>
          </div>

          {/* Top Divider Line */}
          <div
            style={{
              height: "2.5px",
              backgroundColor: "#0d9488",
              width: "100%",
              marginBottom: "24px",
              borderRadius: "2px",
            }}
          />

          {/* DYNAMIC MAIN PRODUCT TITLE */}
          <h1
            style={{
              fontSize: "19px",
              fontWeight: 800,
              color: "#1e293b",
              textAlign: "center",
              textTransform: "uppercase",
              lineHeight: "1.35",
              margin: "0 0 28px 0",
              letterSpacing: "-0.2px",
            }}
          >
            {fullProductHeading}
          </h1>

          {/* 2-COLUMN GRID SECTION */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginBottom: "32px",
            }}
          >
            {/* LEFT BOX: CURRENT PRODUCT IMAGE */}
            <div
              style={{
                border: "2px solid #5eead4",
                borderRadius: "16px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "330px",
                backgroundColor: "#ffffff",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#1e293b",
                  marginBottom: "14px",
                  textAlign: "center",
                }}
              >
                {productTitle}
              </div>
              <div
                style={{
                  width: "100%",
                  height: "260px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {currentDisplayedImage ? (
                  <img
                    src={currentDisplayedImage}
                    alt={productTitle}
                    style={{
                      maxHeight: "250px",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div style={{ color: "#94a3b8", fontSize: "14px" }}>
                    No Image Available
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT BOX: DYNAMIC SPECIFICATIONS */}
            <div
              style={{
                border: "2px solid #5eead4",
                borderRadius: "16px",
                padding: "24px",
                backgroundColor: "#ffffff",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Specs Header */}
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#0d9488",
                  paddingBottom: "8px",
                  borderBottom: "2px solid #99f6e4",
                  marginBottom: "18px",
                }}
              >
                Specifications
              </div>

              {/* Dynamic Spec Rows */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  fontSize: "13px",
                  color: "#334155",
                  lineHeight: "1.4",
                }}
              >
                <div>
                  <strong style={{ color: "#0f172a" }}>Brand:</strong> {brandName}
                </div>

                {modelName && (
                  <div>
                    <strong style={{ color: "#0f172a" }}>Model:</strong> {modelName}
                  </div>
                )}

                {instrument && (
                  <div>
                    <strong style={{ color: "#0f172a" }}>Instrument:</strong> {instrument}
                  </div>
                )}

                {category && (
                  <div>
                    <strong style={{ color: "#0f172a" }}>Category:</strong> {category}
                  </div>
                )}

                {subCategory && (
                  <div>
                    <strong style={{ color: "#0f172a" }}>Subcategory:</strong> {subCategory}
                  </div>
                )}

                {automation && (
                  <div>
                    <strong style={{ color: "#0f172a" }}>Automation:</strong> {automation}
                  </div>
                )}

                {usage && (
                  <div>
                    <strong style={{ color: "#0f172a" }}>Application:</strong> {usage}
                  </div>
                )}

                {throughput && (
                  <div>
                    <strong style={{ color: "#0f172a" }}>Throughput:</strong> {throughput}
                  </div>
                )}

                {parameters && (
                  <div>
                    <strong style={{ color: "#0f172a" }}>Parameters:</strong> {parameters}
                  </div>
                )}

                {availability && (
                  <div>
                    <strong style={{ color: "#0f172a" }}>Availability:</strong> {availability}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DYNAMIC PRODUCT OVERVIEW SECTION */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "20px",
                  backgroundColor: "#0d9488",
                  borderRadius: "2px",
                }}
              />
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#0d9488",
                  margin: 0,
                }}
              >
                Product Overview
              </h2>
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "#475569",
                lineHeight: "1.65",
                margin: 0,
              }}
            >
              {description}
            </p>
          </div>
        </div>

        {/* FOOTER SECTION */}
        <div>
          {/* Bottom Divider Line */}
          <div
            style={{
              height: "1px",
              backgroundColor: "#cbd5e1",
              width: "100%",
              marginBottom: "14px",
            }}
          />

          <div
            style={{
              textAlign: "center",
              fontSize: "10px",
              color: "#64748b",
              lineHeight: "1.5",
            }}
          >
            <div>
              Office Address: F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, on Ajmer-Delhi, 200 Feet Bypass Rd, Jaipur, Rajasthan 302021
            </div>
            <div style={{ marginTop: "3px", color: "#94a3b8" }}>
              © {new Date().getFullYear()} Human Biomedicals. All rights reserved. Premium diagnostics and biomedical solutions.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
