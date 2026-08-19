"use client";

import "./products.css";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { ChevronRight, ChevronUp, Search, X } from "lucide-react";

export default function ProductsClient({ initialProducts, initialCategories, districtData }) {
  const location = districtData?.district || "India";
  const district = districtData?.slug;
  const [productSearch, setProductSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [openedCategory, setOpenedCategory] = useState(
    initialCategories.length > 0 ? initialCategories[0].name : ""
  );
  const [openedSubCategory, setOpenedSubCategory] = useState({});
  const [showTopButton, setShowTopButton] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!productSearch) return initialProducts;
    const term = productSearch.toLowerCase();
    return initialProducts.filter((item) => {
      const text = `${item.title || ""} ${item.brand || ""} ${item.model || ""} ${item.instrument || ""} ${item.category || ""}`.toLowerCase();
      return text.includes(term);
    });
  }, [initialProducts, productSearch]);

  const groupedProducts = useMemo(() => {
    const obj = {};
    filteredProducts.forEach((item) => {
      const category = item.category || "Other Products";
      const subCategory = item.subCategory || "General";
      if (!obj[category]) obj[category] = {};
      if (!obj[category][subCategory]) obj[category][subCategory] = [];
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
    const handleScroll = () => setShowTopButton(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section className="products-page">
        <div className="container-custom">
          <div className="products-heading">
            <span>Our Products Catalog</span>
            <h1>Laboratory & Hospital Equipment in {location}</h1>
            <p>
              Explore our comprehensive catalog of laboratory instruments, diagnostic analyzers, hospital equipment, pathology reagents, and medical supplies. Human Biomedical LLP provides reliable quality, competitive pricing, and pan-India delivery across {location}.
            </p>
          </div>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <div className="container-custom">
        <div className="mt-8 relative">
          <div className="bg-white rounded-[35px] border border-blue-100 shadow-xl p-5">
            <div className="relative">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search biomedical products, analyzers, brands..."
                className="w-full h-16 pl-16 pr-6 rounded-3xl bg-[#f8fbff] border border-blue-100 outline-none focus:border-blue-500 text-lg"
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl">
                🔍
              </span>
            </div>
          </div>

          {/* SEARCH AUTO-COMPLETE */}
          {productSearch && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-3xl border border-blue-100 shadow-2xl overflow-hidden z-50">
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, 5).map((item) => (
                  <Link
                    key={item.slug || item.title}
                    href={
                      district
                        ? `/${district}/products/${item.slug}`
                        : `/products/${item.slug}`
                    }
                    className="flex items-center gap-4 p-4 hover:bg-blue-50 transition border-b border-blue-50"
                  >
                    <img
                      src={item.image || item.images?.[0] || "/humanlogo.png"}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-contain bg-slate-50 p-1"
                    />
                    <div className="text-left">
                      <h4 className="text-base font-bold text-gray-900">{item.title}</h4>
                      <p className="text-xs text-blue-600 font-semibold">{item.brand || item.category}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">No matching products found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PRODUCTS LAYOUT */}
      <div className="container-custom mt-8">
        <div className="products-layout">
          {/* CATEGORIES SIDEBAR */}
          <aside className="category-sidebar">
            <div className="category-sidebar-header">
              <h3 className="text-xl font-bold mb-3 text-slate-800">Categories</h3>
              <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Filter Categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-8 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500"
                />
                {categorySearch && (
                  <button
                    onClick={() => setCategorySearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="category-sidebar-body">
              <div className="sidebar-categories flex flex-col gap-2">
                {initialCategories
                  .filter((cat) =>
                    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
                  )
                  .map((cat) => {
                    const isOpen = openedCategory === cat.name;
                    return (
                      <div
                        key={cat.slug}
                        className={`sidebar-category rounded-xl border transition-all ${
                          isOpen ? "border-blue-500 bg-blue-50/20" : "border-slate-200"
                        }`}
                      >
                        <button
                          className="w-full p-3 flex items-center justify-between text-left"
                          onClick={() => setOpenedCategory(cat.name)}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <ChevronRight
                              size={16}
                              className={`transition-transform shrink-0 ${
                                isOpen ? "rotate-90 text-blue-600" : "text-slate-400"
                              }`}
                            />
                            <span
                              className={`text-sm truncate font-medium ${
                                isOpen ? "text-blue-600 font-bold" : "text-slate-700"
                              }`}
                            >
                              {cat.name}
                            </span>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                            {cat.count}
                          </span>
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="products-content">
            {Object.entries(sortedGroupedProducts)
              .filter(([category]) => !openedCategory || category === openedCategory)
              .map(([category, subCategories]) => (
                <section key={category} className="category-section mb-12">
                  <div className="category-header flex items-center justify-between border-b pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">{category}</h2>
                    <span className="text-sm font-medium text-slate-500">
                      {Object.values(subCategories).flat().length} Products
                    </span>
                  </div>

                  <div className="category-body space-y-8">
                    {Object.entries(subCategories).map(([subCategory, products]) => (
                      <div key={subCategory} className="subcategory-section">
                        <h3 className="subcategory-header text-xl font-bold text-blue-600 mb-4">
                          {subCategory}
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                          {products.map((product) => (
                            <div
                              id={product.slug || product.title}
                              key={product.slug || product.title}
                              className="category-product-card bg-white rounded-3xl border shadow-sm p-6 hover:shadow-lg transition"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-center">
                                <div className="bg-slate-50 rounded-2xl h-48 flex items-center justify-center p-4">
                                  {product.image || product.images?.[0] ? (
                                    <img
                                      src={product.image || product.images?.[0]}
                                      alt={product.title}
                                      className="max-h-36 object-contain"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="text-3xl">🧪</div>
                                  )}
                                </div>

                                <div className="flex flex-col justify-between h-full">
                                  <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                      {product.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      {product.brand && (
                                        <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">
                                          Brand: {product.brand}
                                        </span>
                                      )}
                                      {product.model && (
                                        <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">
                                          Model: {product.model}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                                      {product.desc ||
                                        `${product.title} supplied by Human Biomedical LLP. High precision equipment for diagnostic and research labs in ${location}.`}
                                    </p>
                                  </div>

                                  <Link
                                    href={
                                      district
                                        ? `/${district}/products/${product.slug}`
                                        : `/products/${product.slug}`
                                    }
                                    className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl transition w-fit"
                                  >
                                    View Specifications & Pricing →
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
          </div>
        </div>
      </div>

      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-[999] w-12 h-12 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center hover:bg-blue-700 transition"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </>
  );
}
