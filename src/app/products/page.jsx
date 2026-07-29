"use client";

import "./products.css";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { ChevronDown, ChevronRight, ChevronUp, Search, X } from "lucide-react";
let clientCategoriesCache = null; // [{ id: '...', name: '...' }]
let clientNormalProducts = null;  // [...products]
let clientLoadedCategories = {};  // { "Category Name": [...products] }
let clientAllProductsLoaded = false;
let clientAllProductsPromise = null;

export default function Products({ districtData }) {
  const location = districtData?.district || "India";
  const district = districtData?.slug;
  const [productSearch, setProductSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [normalProducts, setNormalProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [allProductsLoaded, setAllProductsLoaded] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [openedCategory, setOpenedCategory] = useState("");
  const [openedSubCategory, setOpenedSubCategory] = useState({});
  const [showTopButton, setShowTopButton] = useState(false);

  // Initial load: Fetch category list and normal products only (<300ms query)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        let cats = [];
        let normals = [];

        if (clientCategoriesCache && clientNormalProducts) {
          cats = clientCategoriesCache;
          normals = clientNormalProducts;
        } else {
          const [snap, categorySnap] = await Promise.all([
            getDoc(
              doc(
                db,
                "websites",
                "humanbiomedicalcom",
                "pages",
                "products"
              )
            ),
            getDocs(
              collection(
                db,
                "websites",
                "humanbiomedicalcom",
                "pages",
                "categoryproducts",
                "categories"
              )
            )
          ]);

          if (snap.exists()) {
            const allProducts = snap.data().products || [];
            normals = allProducts.filter((item) => item.isPublished);
          }

          cats = categorySnap.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().category || "Uncategorized",
          }));
          cats.sort((a, b) => a.name.localeCompare(b.name));

          clientCategoriesCache = cats;
          clientNormalProducts = normals;
        }

        setCategoriesList(cats);
        setNormalProducts(normals);
        setLoading(false);

        // Pre-set the first category
        if (cats.length > 0) {
          setOpenedCategory((prev) => prev || cats[0].name);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error loading initial products data:", error);
      }
    };

    loadInitialData();
  }, []);

  // Fetch category products on demand when active category changes
  useEffect(() => {
    if (!openedCategory || !categoriesList.length) return;
    if (allProductsLoaded) return;

    const loadCategoryProducts = async () => {
      const catObj = categoriesList.find((c) => c.name === openedCategory);
      if (!catObj) {
        setProducts(normalProducts);
        return;
      }

      // Read from global memory cache
      if (clientLoadedCategories[openedCategory]) {
        setProducts([...normalProducts, ...clientLoadedCategories[openedCategory]]);
        return;
      }

      setLoadingCategory(true);
      try {
        const subSnap = await getDocs(
          collection(
            db,
            "websites",
            "humanbiomedicalcom",
            "pages",
            "categoryproducts",
            "categories",
            catObj.id,
            "subcategories"
          )
        );

        const list = [];
        subSnap.forEach((subDoc) => {
          const subData = subDoc.data();
          (subData.products || []).forEach((item) => {
            if (item.isPublished) {
              list.push({
                ...item,
                category: openedCategory,
                subCategory: subData.subCategory,
              });
            }
          });
        });

        clientLoadedCategories[openedCategory] = list;

        setProducts([...normalProducts, ...list]);
        setLoadingCategory(false);
        requestAnimationFrame(() => {
          window.dispatchEvent(new Event("resize"));
        });
      } catch (err) {
        console.error(`Failed to fetch category ${openedCategory} products:`, err);
        setProducts(normalProducts);
        setLoadingCategory(false);
      }
    };

    loadCategoryProducts();
  }, [openedCategory, categoriesList, normalProducts, allProductsLoaded]);

  // Fetch-on-Focus helper to load all other products for global site-wide search
  const loadAllProductsInBackground = async () => {
    if (allProductsLoaded || clientAllProductsLoaded) {
      if (!allProductsLoaded) {
        let merged = [...normalProducts];
        Object.values(clientLoadedCategories).forEach((list) => {
          merged.push(...list);
        });
        setProducts(merged);
        setAllProductsLoaded(true);
      }
      return;
    }

    if (clientAllProductsPromise) {
      await clientAllProductsPromise;
      let merged = [...normalProducts];
      Object.values(clientLoadedCategories).forEach((list) => {
        merged.push(...list);
      });
      setProducts(merged);
      setAllProductsLoaded(true);
      return;
    }

    clientAllProductsPromise = (async () => {
      try {
        const promises = categoriesList.map(async (catObj) => {
          if (clientLoadedCategories[catObj.name]) return;

          try {
            const subSnap = await getDocs(
              collection(
                db,
                "websites",
                "humanbiomedicalcom",
                "pages",
                "categoryproducts",
                "categories",
                catObj.id,
                "subcategories"
              )
            );

            const list = [];
            subSnap.forEach((subDoc) => {
              const subData = subDoc.data();
              (subData.products || []).forEach((item) => {
                if (item.isPublished) {
                  list.push({
                    ...item,
                    category: catObj.name,
                    subCategory: subData.subCategory,
                  });
                }
              });
            });

            clientLoadedCategories[catObj.name] = list;
          } catch (e) {
            console.error(e);
          }
        });

        await Promise.all(promises);
        clientAllProductsLoaded = true;

        let merged = [...normalProducts];
        Object.values(clientLoadedCategories).forEach((list) => {
          merged.push(...list);
        });
        setProducts(merged);
        setAllProductsLoaded(true);
      } catch (err) {
        console.error("Error loading all products in background:", err);
      } finally {
        clientAllProductsPromise = null;
      }
    })();

    await clientAllProductsPromise;
  };
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

    setOpenedSubCategory((prev) => {
      if (Object.keys(prev).length) return prev;
      return initialState;
    });
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
                onFocus={loadAllProductsInBackground}
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

        <div className="products-layout">

          {/* LEFT SIDEBAR */}

          <aside className="category-sidebar">
            <div className="category-sidebar-header">
              <h3 className="text-2xl font-bold mb-4 text-slate-800">
                Categories
              </h3>

              <div className="relative mb-5">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Search Category..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full h-11 pl-11 pr-10 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                />
                {categorySearch && (
                  <button
                    onClick={() => setCategorySearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="category-sidebar-body">

              {loading ? (

                <div className="flex flex-col gap-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="skeleton-item h-14 w-full rounded-2xl"
                    />
                  ))}
                </div>

              ) : (

                <div className="sidebar-categories">

                  {categoriesList
                    .filter((cat) =>
                      cat.name
                        .toLowerCase()
                        .includes(categorySearch.toLowerCase())
                    )
                    .map((cat) => {
                      const category = cat.name;
                      const isOpen = openedCategory === category;
                      return (
                        <div
                          key={category}
                          className={`sidebar-category rounded-2xl border border-slate-200/80 shadow-sm transition-all duration-300 ${isOpen ? "is-open" : ""
                            }`}
                        >
                          <button
                            className="sidebar-category-header w-full p-4 flex items-center justify-between bg-white hover:bg-blue-50/30 transition-colors duration-200 text-left"
                            onClick={() => {
                              setOpenedCategory(category);
                              if (clientLoadedCategories[category]) {
                                setProducts([...normalProducts, ...clientLoadedCategories[category]]);
                              } else {
                                setLoadingCategory(true);
                              }
                            }}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <ChevronRight
                                size={18}
                                className={`transition-transform duration-300 shrink-0 ${isOpen ? "rotate-90 text-blue-600" : "text-slate-400"
                                  }`}
                              />
                              <span className={`font-semibold text-sm truncate transition-colors duration-200 ${isOpen ? "text-blue-600 font-bold" : "text-slate-700"
                                }`}>
                                {category}
                              </span>
                            </div>

                            {isOpen && (
                              <span className="text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 bg-blue-100 text-blue-700">
                                {Object.values(sortedGroupedProducts[category] || {}).flat().length || 0}
                              </span>
                            )}

                          </button>

                          {isOpen && (

                            <div className="sidebar-subcategory-list border-t border-slate-100 bg-slate-50/30">
                              {loadingCategory && !clientLoadedCategories[category] ? (
                                <div className="p-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                                  <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span>Loading subcategories...</span>
                                </div>
                              ) : Object.keys(sortedGroupedProducts[category] || {}).length === 0 ? (
                                <div className="p-4 text-center text-xs text-slate-400">
                                  No subcategories found
                                </div>
                              ) : (
                                Object.entries(sortedGroupedProducts[category] || {}).map(
                                  ([subCategory, products]) => {

                                    const key = `${category}-${subCategory}`;
                                    const isSubOpen = openedSubCategory[key];

                                    return (

                                      <div
                                        key={key}
                                        className="sidebar-subcategory"
                                      >

                                        {/* SUB CATEGORY */}

                                        <button
                                          className="sidebar-subcategory-header w-full px-5 py-3 flex justify-between items-center bg-slate-50/50 hover:bg-blue-50/40 border-b border-slate-150 transition-colors duration-200 text-left"
                                          onClick={() =>
                                            setOpenedSubCategory((prev) => ({
                                              ...prev,
                                              [key]: !prev[key],
                                            }))
                                          }
                                        >

                                          <div className="flex items-center gap-2 min-w-0 pr-2">
                                            <ChevronRight
                                              size={16}
                                              className={`transition-transform duration-300 shrink-0 ${isSubOpen ? "rotate-90 text-blue-600" : "text-slate-400"
                                                }`}
                                            />
                                            <span className={`text-xs font-semibold truncate transition-colors duration-200 ${isSubOpen ? "text-blue-600 font-bold" : "text-slate-600"
                                              }`}>
                                              {subCategory}
                                            </span>
                                          </div>

                                          <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 transition-colors ${isSubOpen ? "bg-blue-100 text-blue-700 font-semibold" : "bg-slate-200/60 text-slate-500"
                                            }`}>
                                            {products.length}
                                          </span>

                                        </button>

                                        {isSubOpen && (

                                          <div className="sidebar-product-list">

                                            {products.map((product) => (

                                              <button
                                                key={
                                                  product.id ||
                                                  product.productId ||
                                                  product.slug ||
                                                  product.title
                                                }
                                                className="sidebar-product-item flex items-center gap-2 w-full text-left pl-9 pr-4 py-2.5 text-[13px] text-slate-500 hover:text-blue-600 hover:pl-10 transition-all duration-200"
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

                                                <span className="sidebar-product-dot w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 transition-colors" />
                                                <span className="truncate">{product.title}</span>

                                              </button>

                                            ))}

                                          </div>

                                        )}

                                      </div>

                                    );

                                  }
                                ))}

                            </div>

                          )}

                        </div>
                      );
                    })}
                </div>

              )}

            </div>
          </aside>

          <div className="products-content">
            <p style={{ display: "none" }}>
              {Object.keys(sortedGroupedProducts).length}
            </p>
            {loading || (loadingCategory && !clientLoadedCategories[openedCategory]) ? (
              <div className="flex flex-col gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-8 items-center animate-pulse">
                      <div className="rounded-[30px] h-[260px] bg-slate-100" />
                      <div className="flex flex-col gap-4">
                        <div className="h-10 w-2/3 bg-slate-100 rounded-lg" />
                        <div className="h-6 w-1/2 bg-slate-100 rounded-lg" />
                        <div className="h-6 w-1/3 bg-slate-100 rounded-lg" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              Object.entries(sortedGroupedProducts)
                .filter(([category]) => category === openedCategory)
                .map(([category, subCategories]) => (

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
                                          loading="lazy"
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
                                              ? `/${district.toLowerCase().replace(/\s+/g, "-")}/products/${product.slug ||
                                              product.title
                                                ?.toLowerCase()
                                                .replace(/\s+/g, "-")
                                                .replace(/[^\w-]+/g, "")}`
                                              : `/products/${product.slug ||
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

                ))
            )}

          </div>

        </div>

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