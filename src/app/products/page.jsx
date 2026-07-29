"use client";

import "./products.css";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
export default function Products({ districtData }) {
  const location = districtData?.district || "India";
  const district = districtData?.slug;
  const [productSearch, setProductSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [categorySearch, setCategorySearch] = useState("");
  const [openedCategory, setOpenedCategory] = useState("");
  const [openedSubCategory, setOpenedSubCategory] = useState({});
  const [showTopButton, setShowTopButton] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // ==========================
        // NORMAL PRODUCTS
        // ==========================

        const snap = await getDoc(
          doc(
            db,
            "websites",
            "humanbiomedicalcom",
            "pages",
            "products"
          )
        );

        let publishedProducts = [];

        if (snap.exists()) {
          const allProducts = snap.data().products || [];

          publishedProducts = allProducts.filter(
            (item) => item.isPublished
          );
        }

        // ==========================
        // CATEGORY PRODUCTS
        // ==========================

        const categorySnap = await getDocs(
          collection(
            db,
            "websites",
            "humanbiomedicalcom",
            "pages",
            "categoryproducts",
            "categories"
          )
        );

        let categoryProducts = [];

        for (const categoryDoc of categorySnap.docs) {
          const categoryData = categoryDoc.data();

          const subSnap = await getDocs(
            collection(
              db,
              "websites",
              "humanbiomedicalcom",
              "pages",
              "categoryproducts",
              "categories",
              categoryDoc.id,
              "subcategories"
            )
          );

          subSnap.forEach((subDoc) => {
            const subData = subDoc.data();

            (subData.products || []).forEach((item) => {
              if (item.isPublished) {
                categoryProducts.push({
                  ...item,
                  category: categoryData.category,
                  subCategory: subData.subCategory,
                });
              }
            });
          });
        }

        // ==========================
        // MERGE BOTH
        // ==========================

        setProducts([
          ...publishedProducts,
          ...categoryProducts,
        ]);



        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    fetchProducts();
  }, []);
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const text = `
      ${item.title}
      ${item.brand}
      ${item.model}
      ${item.instrument}
      ${item.category}
    `.toLowerCase();

      return text.includes(
        productSearch.toLowerCase()
      );
    });
  }, [products, productSearch]);
  const groupedProducts = useMemo(() => {
    const obj = {};

    filteredProducts.forEach((item) => {
      const category = item.category || "Other Products";
      const subCategory = item.subCategory || "Other";

      if (!obj[category]) {
        obj[category] = {};
      }

      if (!obj[category][subCategory]) {
        obj[category][subCategory] = [];
      }

      obj[category][subCategory].push(item);
    });

    return obj;
  }, [filteredProducts]);
  const sortedGroupedProducts = useMemo(() => {

    const entries = Object.entries(groupedProducts);

    entries.sort(([a], [b]) => {

      if (a === "Other Products") return 1;
      if (b === "Other Products") return -1;

      return a.localeCompare(b);

    });

    return Object.fromEntries(entries);

  }, [groupedProducts]);

  useEffect(() => {
    const categories = Object.keys(sortedGroupedProducts);

    if (!categories.length) return;

    setOpenedCategory((prev) => prev || categories[0]);
  }, [sortedGroupedProducts]);

  useEffect(() => {
    if (!Object.keys(sortedGroupedProducts).length) return;

    const initialState = {};

    Object.entries(sortedGroupedProducts).forEach(
      ([category, subCategories]) => {
        const firstSubCategory = Object.keys(subCategories)[0];

        if (firstSubCategory) {
          initialState[`${category}-${firstSubCategory}`] = true;
        }
      }
    );

    setOpenedSubCategory(initialState);
  }, [sortedGroupedProducts]);
  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <section className="products-page">
        <div className="container-custom">
          <div className="products-heading">
            <span>Our Products</span>

            <h1>
              Laboratory & Hospital Equipment in {location}
            </h1>

            <p>
              Explore our comprehensive range of laboratory instruments,
              hospital equipment, diagnostic systems, pathology analyzers,
              medical devices, laboratory consumables, and healthcare
              solutions. Human Biomedical LLP supplies premium-quality
              products for hospitals, diagnostic centres, pathology
              laboratories, research institutions, clinics, nursing homes,
              and healthcare organizations across {location}.
            </p>
          </div>


        </div>
      </section>
      {/* SEARCH */}
      <div className="container-custom">
        <div className="mt-20 relative">

          <div className="bg-white rounded-[35px] border border-blue-100 shadow-2xl p-5">

            <div className="relative">

              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search biomedical products..."
                className="w-full h-20 pl-20 pr-6 rounded-3xl bg-[#f8fbff] border border-blue-100 outline-none focus:border-blue-500 text-lg"
              />

              <span className="absolute left-7 top-1/2 -translate-y-1/2 text-3xl">
                🔍
              </span>

            </div>

          </div>

          {/* AUTO SEARCH DROPDOWN */}
          {productSearch && (
            <div className="absolute top-full left-0 w-full mt-4 bg-white rounded-[30px] border border-blue-100 shadow-2xl overflow-hidden z-50">

              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setProductSearch("");
                    }}
                    className="w-full flex items-center gap-5 p-5 hover:bg-blue-50 transition border-b border-blue-50"
                  >

                    <img
                      src={item.images?.[0] || item.image}
                      alt={item.title}
                      className="w-20 h-20 rounded-2xl object-cover"
                    />

                    <div className="text-left">

                      <h3 className="text-2xl font-black text-gray-900">

                        {item.title}

                      </h3>

                      <p className="mt-1 text-blue-600 font-semibold">

                        {item.brand}

                      </p>

                    </div>

                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 text-lg">

                  No products found

                </div>
              )}

            </div>
          )}

        </div>
      </div>
      <div className="container-custom">
        {!loading ? (

          <div className="products-layout">

            {/* LEFT SIDEBAR */}

            <aside className="category-sidebar">
              <div className="category-sidebar-header">
                <h3 className="text-2xl font-bold mb-5">
                  Categories
                </h3>

                <input
                  type="text"
                  placeholder="Search Category..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-300"
                />
              </div>

              <div className="category-sidebar-body">
                <div className="sidebar-categories">

                  {Object.keys(sortedGroupedProducts)
                    .filter((category) =>
                      category
                        .toLowerCase()
                        .includes(categorySearch.toLowerCase())
                    )
                    .map((category) => (

                      <div
                        key={category}
                        className="sidebar-category rounded-2xl overflow-hidden shadow-sm border border-slate-200"
                      >

                        <button
                          className="sidebar-category-header w-full p-4 flex items-center justify-between bg-white hover:bg-blue-50"
                          onClick={() =>
                            setOpenedCategory(
                              openedCategory === category
                                ? ""
                                : category
                            )
                          }
                        >

                          <div className="flex items-center gap-2">

                            {openedCategory === category ? (
                              <ChevronDown size={18} />
                            ) : (
                              <ChevronRight size={18} />
                            )}

                            <span>{category}</span>

                          </div>

                          <span>
                            {Object.values(sortedGroupedProducts[category]).flat().length}
                          </span>

                        </button>

                        {openedCategory === category && (

                          <div className="sidebar-subcategory-list border-t bg-slate-50">

                            {Object.entries(sortedGroupedProducts[category]).map(
                              ([subCategory, products]) => {

                                const key = `${category}-${subCategory}`;

                                return (

                                  <div
                                    key={key}
                                    className="sidebar-subcategory"
                                  >

                                    {/* SUB CATEGORY */}

                                    <button
                                      className="sidebar-subcategory-header w-full px-6 py-3 flex justify-between items-center bg-slate-50 hover:bg-blue-50 border-t border-slate-200"
                                      onClick={() =>
                                        setOpenedSubCategory((prev) => ({
                                          ...prev,
                                          [key]: !prev[key],
                                        }))
                                      }
                                    >

                                      <div className="flex items-center gap-2">

                                        {openedSubCategory[key] ? (
                                          <ChevronDown size={16} />
                                        ) : (
                                          <ChevronRight size={16} />
                                        )}

                                        {subCategory}

                                      </div>

                                      <span>{products.length}</span>

                                    </button>

                                    {openedSubCategory[key] && (

                                      <div className="sidebar-product-list">

                                        {products.map((product) => (

                                          <button
                                            key={
                                              product.id ||
                                              product.productId ||
                                              product.slug ||
                                              product.title
                                            }
                                            className="block w-full text-left pl-10 pr-4 py-3 text-sm hover:bg-blue-50"
                                            onClick={() => {

                                              document
                                                .getElementById(
                                                  product.id || product.title
                                                )
                                                ?.scrollIntoView({
                                                  behavior: "smooth",
                                                  block: "start",
                                                });

                                            }}
                                          >

                                            {product.title}

                                          </button>

                                        ))}

                                      </div>

                                    )}

                                  </div>

                                );

                              }
                            )}

                          </div>

                        )}

                      </div>

                    ))}

                </div>
              </div>
            </aside>

            {/* RIGHT SIDE */}

            <div className="products-content">
              {Object.entries(sortedGroupedProducts).map(
                ([category, subCategories]) => (

                  <section
                    key={category}
                    className="category-section"
                  >

                    <div className="category-header">

                      <h2 className="text-3xl font-bold">
                        {category}
                      </h2>

                      <span>
                        {Object.values(subCategories).flat().length} Products
                      </span>

                    </div>

                    <div className="category-body">

                      {Object.entries(subCategories).map(
                        ([subCategory, products]) => (

                          <div
                            key={subCategory}
                            className="subcategory-section"
                          >

                            <h3 className="subcategory-header text-2xl font-bold text-blue-600">
                              {subCategory}
                            </h3>

                            <div className="subcategory-products">

                              {products.map((product) => (

                                <div
                                  id={product.id || product.title}
                                  key={product.id || product.productId || product.slug || product.title}
                                  className="category-product-card bg-white rounded-[32px] border shadow-lg p-8"
                                >

                                  <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-8 items-center">

                                    <div className="bg-slate-50 rounded-[30px] h-[260px] flex items-center justify-center p-6">

                                      {(product.image || product.images?.[0]) ? (
                                        <img
                                          src={product.image || product.images?.[0]}
                                          alt={product.title}
                                          className="max-h-[180px] object-contain"
                                        />
                                      ) : (
                                        <div className="text-center">
                                          <div className="text-5xl mb-2">🧪</div>

                                          <p className="text-sm text-slate-500">
                                            No Image Available
                                          </p>
                                        </div>
                                      )}

                                    </div>

                                    <div className="min-w-0 w-full flex flex-col justify-center">

                                      <h3 className="text-[34px] font-bold leading-tight text-slate-900 mb-6">
                                        {product.title}
                                      </h3>

                                      <div className="grid md:grid-cols-2 gap-4">

                                        <div className="bg-slate-50 rounded-2xl p-4">
                                          <p className="text-xs uppercase text-slate-400 mb-1">
                                            Brand
                                          </p>

                                          <p className="font-semibold">
                                            {product.brand}
                                          </p>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-4">
                                          <p className="text-xs uppercase text-slate-400 mb-1">
                                            Model
                                          </p>

                                          <p className="font-semibold">
                                            {product.model}
                                          </p>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-4">
                                          <p className="text-xs uppercase text-slate-400 mb-1">
                                            Instrument
                                          </p>

                                          <p className="font-semibold">
                                            {product.instrument}
                                          </p>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-4">
                                          <p className="text-xs uppercase text-slate-400 mb-1">
                                            Throughput
                                          </p>

                                          <p className="font-semibold">
                                            {product.throughput}
                                          </p>
                                        </div>

                                      </div>

                                      <div className="mt-6">
                                        <Link
                                          href={
                                            district
                                              ? `/${district.toLowerCase().replace(/\s+/g, "-")}/items/${product.slug ||
                                              product.title
                                                ?.toLowerCase()
                                                .replace(/\s+/g, "-")
                                                .replace(/[^\w-]+/g, "")}`
                                              : `/items/${product.slug ||
                                              product.title
                                                ?.toLowerCase()
                                                .replace(/\s+/g, "-")
                                                .replace(/[^\w-]+/g, "")}`
                                          }
                                          className="category-view-btn bg-blue-600 text-white inline-flex items-center justify-center"
                                        >
                                          View Details
                                        </Link>
                                      </div>

                                    </div>



                                  </div>

                                </div>

                              ))}

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </section>

                )
              )}

            </div>

          </div>

        ) : (

          <div className="text-center py-20">
            Loading...
          </div>

        )}
      </div>
      {/* <div className="dna-pagination">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="dna-nav-btn"
            >
              ← Prev
            </button>

            <div className="dna-track">

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`dna-node ${currentPage === index + 1 ? "active" : ""
                    }`}
                />
              ))}

            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="dna-nav-btn"
            >
              Next →
            </button>

          </div>

          <div className="dna-batch">
            Batch {String(currentPage).padStart(2, "0")} of{" "}
            {String(totalPages).padStart(2, "0")}
          </div> */}

      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300"
        >
          <ChevronUp size={28} />
        </button>
      )}
    </>
  );
}