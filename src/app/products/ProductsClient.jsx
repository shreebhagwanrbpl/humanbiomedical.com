"use client";

import "./products.css";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { ChevronRight, ChevronUp, Search, X, Layers, ShieldCheck, Sparkles, RefreshCw } from "lucide-react";

export default function ProductsClient({ initialProducts = [], initialCategories = [], districtData }) {
  const location = districtData?.district || "India";
  const district = districtData?.slug;

  const [productsList, setProductsList] = useState(initialProducts);
  const [categoriesList, setCategoriesList] = useState(initialCategories);

  const [productSearch, setProductSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedUsage, setSelectedUsage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  // Default opened category and subcategory
  const [openedCategory, setOpenedCategory] = useState(initialCategories[0]?.name || "");
  const [openedSubcategory, setOpenedSubcategory] = useState(
    initialCategories[0]?.subcategories?.[0]?.name || ""
  );
  const [showTopButton, setShowTopButton] = useState(false);

  // Sync state when props change
  useEffect(() => {
    if (initialProducts) setProductsList(initialProducts);
    if (initialCategories) {
      setCategoriesList(initialCategories);
      if (!openedCategory && initialCategories.length > 0) {
        setOpenedCategory(initialCategories[0].name);
        setOpenedSubcategory(initialCategories[0].subcategories?.[0]?.name || "");
      }
    }
  }, [initialProducts, initialCategories]);

  // LIVE REAL-TIME SYNC: Auto-sync on Tab Focus, Visibility Change, and 3s Polling
  useEffect(() => {
    let isMounted = true;

    const syncLiveData = async () => {
      try {
        const res = await fetch(`/api/products?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, max-age=0",
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data && Array.isArray(data.products) && Array.isArray(data.categories)) {
            setProductsList(data.products);
            setCategoriesList(data.categories);

            // Auto-adjust opened category if the currently opened category is removed
            setOpenedCategory((currCat) => {
              if (currCat && !data.categories.some((c) => c.name === currCat)) {
                return data.categories[0]?.name || "";
              }
              if (!currCat && data.categories.length > 0) {
                return data.categories[0]?.name || "";
              }
              return currCat;
            });

            setOpenedSubcategory((currSub) => {
              const activeCat = data.categories.find((c) => c.name === openedCategory) || data.categories[0];
              if (currSub && !activeCat?.subcategories?.some((s) => s.name === currSub)) {
                return activeCat?.subcategories?.[0]?.name || "";
              }
              if (!currSub && activeCat?.subcategories?.length > 0) {
                return activeCat.subcategories[0]?.name || "";
              }
              return currSub;
            });
          }
        }
      } catch (e) {
        // silent fail
      }
    };

    // Instant sync when user switches back from Admin tab to website tab
    const handleFocus = () => syncLiveData();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        syncLiveData();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    // Fast background sync every 3 seconds for immediate UI reaction
    const timer = setInterval(syncLiveData, 3000);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(timer);
    };
  }, [openedCategory]);

  // Extract unique brands & usages
  const allBrands = useMemo(() => {
    const brands = new Set();
    productsList.forEach((p) => {
      if (p.brand && p.brand.trim()) brands.add(p.brand.trim());
    });
    return Array.from(brands).sort();
  }, [productsList]);

  const allUsages = useMemo(() => {
    const usages = new Set();
    productsList.forEach((p) => {
      if (p.usage && p.usage.trim()) usages.add(p.usage.trim());
      else if (p.automation && p.automation.trim()) usages.add(p.automation.trim());
      else if (p.instrument && p.instrument.trim()) usages.add(p.instrument.trim());
    });
    return Array.from(usages).sort();
  }, [productsList]);

  const filteredProducts = useMemo(() => {
    return productsList.filter((item) => {
      // Search filter
      if (productSearch) {
        const term = productSearch.toLowerCase();
        const text = `${item.title || ""} ${item.brand || ""} ${item.model || ""} ${item.instrument || ""} ${item.category || ""} ${item.subCategory || ""}`.toLowerCase();
        if (!text.includes(term)) return false;
      }
      // Brand filter
      if (selectedBrand && (item.brand || "").trim().toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      // Usage filter
      if (selectedUsage) {
        const u = selectedUsage.toLowerCase();
        const itemU = `${item.usage || ""} ${item.automation || ""} ${item.instrument || ""}`.toLowerCase();
        if (!itemU.includes(u)) return false;
      }
      return true;
    });
  }, [productsList, productSearch, selectedBrand, selectedUsage]);

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

  const visibleCategories = useMemo(() => {
    const result = [];
    Object.entries(sortedGroupedProducts).forEach(([category, subCategories]) => {
      if (openedCategory && category !== openedCategory) return;

      const subCategoryEntries = Object.entries(subCategories).filter(
        ([subCategory]) => !openedSubcategory || subCategory === openedSubcategory
      );

      // If openedSubcategory had no matches under active search/filters, fallback to all matching subcategories in this category
      const effectiveSubEntries =
        subCategoryEntries.length > 0
          ? subCategoryEntries
          : productSearch || selectedBrand || selectedUsage
            ? Object.entries(subCategories)
            : [];

      const totalCategoryCount = effectiveSubEntries.reduce(
        (acc, [, prods]) => acc + prods.length,
        0
      );

      if (effectiveSubEntries.length > 0 && totalCategoryCount > 0) {
        result.push({
          category,
          subCategoryEntries: effectiveSubEntries,
          totalCategoryCount,
        });
      }
    });
    return result;
  }, [sortedGroupedProducts, openedCategory, openedSubcategory, productSearch, selectedBrand, selectedUsage]);

  useEffect(() => {
    const handleScroll = () => setShowTopButton(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategorySelect = (categoryName) => {
    if (openedCategory === categoryName) {
      setOpenedCategory("");
      setOpenedSubcategory("");
    } else {
      setOpenedCategory(categoryName);
      const catObj = categoriesList.find((c) => c.name === categoryName);
      setOpenedSubcategory(catObj?.subcategories?.[0]?.name || "");
    }
    const contentElement = document.querySelector(".products-content");
    if (contentElement && window.scrollY > 350) {
      contentElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubcategoryToggle = (categoryName, subcategoryName) => {
    setOpenedCategory(categoryName);
    if (openedSubcategory === subcategoryName) {
      setOpenedSubcategory("");
    } else {
      setOpenedSubcategory(subcategoryName);
    }
  };

  const handleProductScroll = (product) => {
    setSelectedProduct(product.slug || product.id);
    const prodId = product.slug || product.title;
    const el = document.getElementById(prodId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("highlight-pulse");
      setTimeout(() => el.classList.remove("highlight-pulse"), 2500);
    }
  };

  const handleResetFilters = () => {
    setProductSearch("");
    setSelectedBrand("");
    setSelectedUsage("");
    setSelectedProduct("");
    setOpenedCategory(categoriesList[0]?.name || "");
    setOpenedSubcategory(categoriesList[0]?.subcategories?.[0]?.name || "");
  };

  return (
    <div className="products-page-wrapper">
      {/* PRODUCTS HERO BANNER */}
      <section className="products-hero-section">
        <div className="container-custom">
          <div className="products-heading">
            <span>Biomedical &amp; Laboratory Catalog</span>
            <h1>Diagnostic Equipment &amp; Instruments in {location}</h1>
            <p>
              Explore our comprehensive range of certified clinical analyzers, diagnostic instruments, and healthcare equipment supplied across {location} with full warranty and nationwide support.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS MAIN SECTION */}
      <section className="products-main-section">
        <div className="container-custom">
          <div className="products-layout">
            {/* STICKY NESTED CATEGORIES SIDEBAR */}
            <aside className="category-sidebar">
              <div className="category-sidebar-header">
                <div className="sidebar-header-top">
                  <h3 className="sidebar-title">Categories</h3>
                </div>

                <div className="sidebar-search-box">
                  <input
                    type="text"
                    placeholder="Search Product..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="sidebar-search-input"
                  />
                  {categorySearch && (
                    <button
                      onClick={() => setCategorySearch("")}
                      className="sidebar-search-clear"
                      aria-label="Clear filter"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              <div className="category-sidebar-body">
                {categoriesList
                  .filter((cat) => {
                    if (!categorySearch) return true;
                    const q = categorySearch.toLowerCase();
                    const matchCat = cat.name.toLowerCase().includes(q);
                    const matchSub = cat.subcategories?.some((s) => s.name.toLowerCase().includes(q));
                    const matchProd = cat.subcategories?.some((s) =>
                      s.products?.some((p) => p.title.toLowerCase().includes(q))
                    );
                    return matchCat || matchSub || matchProd;
                  })
                  .map((cat) => {
                    const isOpen = openedCategory === cat.name;
                    const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;

                    return (
                      <div key={cat.slug} className="sidebar-cat-group">
                        {/* CATEGORY ACCORDION HEADER */}
                        <button
                          type="button"
                          className={`sidebar-cat-btn ${isOpen ? "is-active" : ""}`}
                          onClick={() => handleCategorySelect(cat.name)}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span className="cat-arrow-symbol">
                              {isOpen ? "∧" : ">"}
                            </span>
                            <span className="cat-name-text truncate">
                              {cat.name}
                            </span>
                          </div>
                          <span className="cat-count-badge">
                            {cat.count}
                          </span>
                        </button>

                        {/* LEVEL 2: SUBCATEGORIES */}
                        {isOpen && hasSubcategories && (
                          <div className="sidebar-subcat-container">
                            {cat.subcategories.map((sub) => {
                              const isSubOpen = openedSubcategory === sub.name;
                              const hasProducts = sub.products && sub.products.length > 0;

                              return (
                                <div key={sub.id || sub.slug} className="sidebar-subcat-group">
                                  {/* SUBCATEGORY ACCORDION HEADER */}
                                  <button
                                    type="button"
                                    className={`sidebar-subcat-header-btn ${isSubOpen ? "is-open" : ""}`}
                                    onClick={() => handleSubcategoryToggle(cat.name, sub.name)}
                                  >
                                    <div className="flex items-center gap-1.5 min-w-0 pr-1">
                                      <span className="subcat-arrow-symbol">
                                        {isSubOpen ? "∧" : ">"}
                                      </span>
                                      <span className="subcat-title-text truncate">
                                        {sub.name}
                                      </span>
                                    </div>
                                    <span className="subcat-count-pill">
                                      {sub.count}
                                    </span>
                                  </button>

                                  {/* LEVEL 3: PRODUCT LIST */}
                                  {isSubOpen && hasProducts && (
                                    <div className="sidebar-product-list">
                                      {sub.products
                                        .filter((p) =>
                                          !categorySearch ||
                                          p.title.toLowerCase().includes(categorySearch.toLowerCase())
                                        )
                                        .map((prod) => {
                                          const isSelected = selectedProduct === (prod.slug || prod.id);
                                          return (
                                            <button
                                              key={prod.id || prod.slug}
                                              type="button"
                                              className={`sidebar-product-link ${isSelected ? "is-selected" : ""}`}
                                              onClick={() => handleProductScroll(prod)}
                                              title={prod.title}
                                            >
                                              {prod.title}
                                            </button>
                                          );
                                        })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </aside>

            {/* PRODUCTS CONTENT RIGHT COLUMN */}
            <main className="products-content">
              {/* TOP FILTER TOOLBAR */}
              <div className="products-toolbar">
                <div className="toolbar-search-wrap">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="toolbar-input"
                  />
                </div>

                <div className="toolbar-select-wrap">
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="toolbar-select"
                  >
                    <option value="">Brand</option>
                    {allBrands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="toolbar-select-wrap">
                  <select
                    value={selectedUsage}
                    onChange={(e) => setSelectedUsage(e.target.value)}
                    className="toolbar-select"
                  >
                    <option value="">Usage</option>
                    {allUsages.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="toolbar-reset-btn"
                >
                  Reset
                </button>
              </div>

              {/* PRODUCTS CATALOG LIST */}
              {visibleCategories.length > 0 ? (
                visibleCategories.map(({ category, subCategoryEntries, totalCategoryCount }) => (
                  <div key={category} className="category-products-wrapper">
                    {/* CATEGORY HEADER MATCHING SCREENSHOT */}
                    <div className="category-header-banner">
                      <h2 className="category-banner-title">{category}</h2>
                      <span className="category-banner-badge">
                        {totalCategoryCount}Products
                      </span>
                    </div>

                    {/* SUBCATEGORIES & PRODUCTS */}
                    <div className="category-body">
                      {subCategoryEntries.map(([subCategory, products]) => {
                        const subId = (subCategory || "")
                          .toLowerCase()
                          .trim()
                          .replace(/\s+/g, "-")
                          .replace(/[^\w\-]+/g, "");
                        return (
                          <div key={subCategory} id={subId} className="subcategory-section">
                            <div className="subcategory-products-list">
                              {products.map((product) => (
                                <div
                                  id={product.slug || product.title}
                                  key={product.slug || product.title}
                                  className="category-product-card"
                                >
                                  <div className="product-card-grid">
                                    {/* PRODUCT IMAGE */}
                                    <div className="product-card-img-wrapper">
                                      {product.image || product.images?.[0] ? (
                                        <img
                                          src={product.image || product.images?.[0]}
                                          alt={product.title}
                                          loading="lazy"
                                        />
                                      ) : (
                                        <div className="no-img-placeholder">🔬</div>
                                      )}
                                    </div>

                                    {/* PRODUCT DETAILS */}
                                    <div className="product-card-info">
                                      <h3 className="product-card-title">
                                        {product.title}
                                      </h3>

                                      {/* 2X2 SPECIFICATIONS GRID */}
                                      <div className="product-specs-2x2">
                                        <div className="spec-box">
                                          <span className="spec-label">Brand</span>
                                          <span className="spec-val">{product.brand || "-"}</span>
                                        </div>
                                        <div className="spec-box">
                                          <span className="spec-label">Usage</span>
                                          <span className="spec-val">
                                            {product.usage || product.automation || "-"}
                                          </span>
                                        </div>
                                        <div className="spec-box">
                                          <span className="spec-label">Model</span>
                                          <span className="spec-val">{product.model || "-"}</span>
                                        </div>
                                        <div className="spec-box">
                                          <span className="spec-label">Availability</span>
                                          <span className="spec-val">
                                            {product.availability || "In Stock"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* ACTION BUTTON */}
                                    <div className="product-card-action">
                                      <Link
                                        href={
                                          district
                                            ? `/${district}/products/${product.slug}`
                                            : `/products/${product.slug}`
                                        }
                                        className="product-view-btn"
                                      >
                                        View Details
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                /* INSPIRING BIOMEDICAL SLOGAN & SOURCING CARD */
                <div className="procurement-slogan-card">
                  <div className="slogan-badge">
                    <Sparkles size={14} className="text-blue-600" />
                    <span>Precision Diagnostics • Engineering Excellence • Pan-India Biomedical Support</span>
                  </div>

                  <h3 className="slogan-title">
                    Advancing Healthcare with Next-Generation Biomedical Solutions
                  </h3>

                  <p className="slogan-desc">
                    Equipping hospitals, pathology laboratories, and diagnostic centers across <strong>{location}</strong> with certified analyzers, precision reagents, and uncompromised technical reliability.
                  </p>

                  <div className="slogan-highlight-box">
                    <p className="slogan-highlight-text">
                      <strong>Looking for a specific diagnostic analyzer, test parameter, or bulk reagents?</strong><br />
                      Even if a particular model is not currently listed under your active filter, our biomedical engineers and procurement specialists will source, calibrate, and install it directly for your facility.
                    </p>
                  </div>

                  <div className="slogan-actions">
                    <Link
                      href={district ? `/${district}/contact` : `/contact`}
                      className="slogan-inquiry-btn"
                    >
                      <span>Request Custom Equipment Quotation</span>
                      <ChevronRight size={16} />
                    </Link>

                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="slogan-reset-btn"
                    >
                      <RefreshCw size={15} />
                      <span>Explore Full Equipment Catalog</span>
                    </button>
                  </div>

                  {/* TRUST PILLARS MICRO-GRID */}
                  <div className="slogan-trust-grid">
                    <div className="trust-pillar-item">
                      <ShieldCheck size={18} className="text-blue-600 flex-shrink-0" />
                      <div>
                        <h4>100% Certified &amp; Calibrated</h4>
                        <p>ISO, CE &amp; NABL standard compliant diagnostic instruments</p>
                      </div>
                    </div>
                    <div className="trust-pillar-item">
                      <Sparkles size={18} className="text-blue-600 flex-shrink-0" />
                      <div>
                        <h4>Direct Technical Sourcing</h4>
                        <p>Global biomedical brands &amp; fast doorstep dispatch</p>
                      </div>
                    </div>
                    <div className="trust-pillar-item">
                      <Layers size={18} className="text-blue-600 flex-shrink-0" />
                      <div>
                        <h4>Biomedical Engineers Support</h4>
                        <p>On-site installation, training &amp; 24/7 AMC warranty across {location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* BACK TO TOP BUTTON */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="back-to-top-btn"
          aria-label="Back to top"
        >
          <ChevronUp size={22} />
        </button>
      )}
    </div>
  );
}
