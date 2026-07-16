"use client";

import "./products.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
export default function Products({ districtData }) {
  const location =
    districtData?.district || "India";
  const [products, setProducts] = useState([]);
  const district = districtData?.slug;
  // const location = districtData?.district;
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDoc(
          doc(db, "websites", "qlyte", "pages", "products"),
        );

        if (snap.exists()) {
          const allProducts = snap.data().products || [];
          const publishedProducts = allProducts.filter(
            (item) => item.isPublished,
          );

          setProducts(publishedProducts);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);
  return (
    <>
      <section className="products-page">
        <div className="container-custom">
          <div className="products-heading">
            <span>Our Products</span>

            <h1>Premium Electrolyte Analyzer Reagents In {location}</h1>

            <p>
              Explore premium electrolyte analyzer reagents compatible with
              Roche 9180, ERBA EC 90, Medica EasyLyte, HDC Lyte, Sensacore ST200
              Aqua, Biosystem Diestro and more. Trusted by hospitals, pathology
              laboratories and diagnostic centers across {location}.
            </p>
          </div>

          <div className="products-grid-page">
            {products.map((item) => (
              <div className="product-card-page" key={item.id}>
                <img
                  src={
                    item.images?.length
                      ? item.images[0]
                      : item.image || "/no-image.png"
                  }
                  alt={`${item.title} Supplier in ${location}`}
                />

                <div className="card-content">
                  <h3>{item.title}</h3>

                  <h4>
                    Brand: <span>{item.brand}</span>
                  </h4>

                  <h4>
                    Instrument: <span>{item.instrument}</span>
                  </h4>

                  {/* <Link href={`/products/${item.slug}`} className="more-btn"> */}
                  <Link
                    href={`/products/${encodeURIComponent(item.title)}`}
                    className="more-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
