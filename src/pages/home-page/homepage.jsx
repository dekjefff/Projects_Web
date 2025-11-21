// File: Homepage.jsx
import React, { useEffect, useState } from "react";
import { Link ,useNavigate} from 'react-router-dom';
import "./homepage.css";


const FALLBACK_IMAGE = "/src/assets/fallback.png";
const Img_url = [
  "/src/assets/banner1.png",
  "/src/assets/banner2.png",
  "/src/assets/banner3.png"
];

// ----------------- API -----------------
async function showProductByBrand(brand = "") {
  try {
    const params = new URLSearchParams();
    if (brand) params.append("frombrand", brand);
    const res = await fetch(
      `http://localhost:3030/api/homepage/brand?${params.toString()}`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );
    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching products by brand:", error);
    return [];
  }
}

async function showProductByCategory(season = "", sex = "") {
  try {
    const params = new URLSearchParams();
    if (season) params.append("category_season", season);
    if (sex) params.append("category_sex", sex);
    const res = await fetch(
      `http://localhost:3030/api/homepage/category?${params.toString()}`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );
    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

// ----------------- Components -----------------
const CategoryFilter = ({ season, setSeason, sex, setSex }) => (
  <div className="category-filter-root">
    <label style={{ marginRight: 8 }}>Best:</label>
    <select value={season} onChange={e => setSeason(e.target.value)} style={{ marginRight: 16 }}>
      <option value="">เลือกฤดู</option>
      <option value="Summer">Summer</option>
      <option value="Winter">Winter</option>
      <option value="Rainy">Rainy</option>
    </select>
    <label style={{ marginRight: 8 }}>For:</label>
    <select value={sex} onChange={e => setSex(e.target.value)}>
      <option value="">เลือก</option>
      <option value="Men">Men</option>
      <option value="Women">Women</option>
      <option value="Unisex">Unisex</option>
    </select>
  </div>
);

const CategorySection = () => (
  <div className="category-root">
    <div className="category-card">
      <img src="/src/assets/forman.png" alt="For Men" />
      <p>For Men</p>
    </div>
    <div className="category-card">
      <img src="/src/assets/forwomen.png" alt="For Women" />
      <p>For Women</p>
    </div>
  </div>
);

const BrandSelector = ({ selectedBrand, setSelectedBrand }) => (
  <div className="category-select">
    <label className="brand-select">From {selectedBrand || "All"}:</label>
    <select
      value={selectedBrand}
      onChange={(e) => setSelectedBrand(e.target.value)}
      style={{ padding: "8px 12px", fontSize: "16px", borderRadius: "6px" }}
    >
      <option value="">All Brands</option>
      <option value="Creed">Creed</option>
      <option value="Dior">Dior</option>
      <option value="Paco Rabanne">Paco Rabanne</option>
      <option value="Tom Ford">Tom Ford</option>
    </select>
  </div>
);

const ProductCard = ({ product }) => (
  <div className="product-card">
    <div className="image-box">
      <Link to={`/detail?product_id=${product.product_ID}`} aria-label={`View details for ${product.product_name}`}>
        <img
          src={product.image_url || FALLBACK_IMAGE}
          alt={product.product_name}
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
        />
      </Link>
    </div>
    <div className="product-info">
      <div className="brand">{product.brand_name || product.brand_ID || "Unknown Brand"}</div>
      <div className="name">{product.product_name}</div>
      <div className="price">{Number(product.price).toLocaleString("th-TH")} THB</div>
      <button className="add-btn" onClick={() => console.log("Add:", product.product_ID)}>ADD</button>
    </div>
  </div>
);

const ProductSection = ({ title, products, itemsPerPage = 3 }) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
  const pages = [];
  for (let i = 0; i < products.length; i += itemsPerPage) {
    pages.push(products.slice(i, i + itemsPerPage));
  }
  const prev = () => setPage(p => Math.max(0, p - 1));
  const next = () => setPage(p => Math.min(totalPages - 1, p + 1));

  if (!products.length) return <p style={{ textAlign: "center" }}>No products found.</p>;

  return (
    
    <div className="products-root">
      <div className="products-header">
        <div className="form-label"><span className="label-light">{title}</span></div>
      </div>
      <div className="products-carousel">
        <button className="arrow left" onClick={prev} disabled={page === 0}>‹</button>
        <div className="viewport">
          <div className="track" style={{ transform: `translateX(-${page * (100 / totalPages)}%)`, width: `${totalPages * 100}%` }}>
            {pages.map((chunk, i) => (
              <div className="page" key={i}>
                {chunk.map(product => <ProductCard key={product.product_ID} product={product} />)}
              </div>
            ))}
          </div>
        </div>
        <button className="arrow right" onClick={next} disabled={page >= totalPages - 1}>›</button>
      </div>
      <div className="products-footer">
        <div className="status">{products.length} items</div>
        <div className="pager">{Array.from({ length: totalPages }).map((_, i) => (
          <button key={i} className={`dot ${i === page ? "active" : ""}`} onClick={() => setPage(i)} />
        ))}</div>
      </div>
    </div>
  );
};

// ----------------- MAIN PAGE -----------------
export default function Homepage({ itemsPerPage = 3, headerAutoPlayMs = 3000 }) {
  // Default brand & category
  const [selectedBrand, setSelectedBrand] = useState("Creed");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerIndex, setBannerIndex] = useState(0);

  const [season, setSeason] = useState("Summer");
  const [sex, setSex] = useState("Men");
  const [categoryProducts, setCategoryProducts] = useState([]);

  // Banner AutoPlay
  useEffect(() => {
    const t = setInterval(() => setBannerIndex(prev => (prev + 1) % Img_url.length), headerAutoPlayMs);
    return () => clearInterval(t);
  }, [headerAutoPlayMs]);

  // Fetch brand products
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const data = await showProductByBrand(selectedBrand);
      if (mounted) setProducts(data);
      setLoading(false);
    };
    load();
    return () => (mounted = false);
  }, [selectedBrand]);

  // Fetch category products
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const data = await showProductByCategory(season, sex);
      if (mounted) setCategoryProducts(data);
    };
    load();
    return () => (mounted = false);
  }, [season, sex]);
  useEffect(() => {
    const handleCustomNavigate = (event) => {
        // ตรวจสอบชื่อ Event ที่ส่งมาจาก Custom Element (NavbarTop)
        if (event.detail && event.detail.path) {
            console.log("Navigating directly to:", event.detail.path);
            // สั่งให้ React Router เปลี่ยนหน้า
            navigate(event.detail.path); 
        }
    };

    // ผูก Event Listener เข้ากับ Document (เนื่องจาก Custom Element ส่ง Event แบบ bubbles: true)
    document.addEventListener('customNavigate', handleCustomNavigate);

    // Cleanup: ลบ Event Listener เมื่อ Component ถูกถอดออก
    return () => {
        document.removeEventListener('customNavigate', handleCustomNavigate);
    };
  }, [navigate]);
  return (
    <div className="page-root">
      <navbar-component />
      <header className="header-banner">
        <div className="slides">
          {Img_url.map((src, i) => <img key={i} src={src} alt={`banner-${i}`} className={`slide ${i === bannerIndex ? "active" : ""}`} />)}
        </div>
        <div className="header-inner">
          <div className="left">
            <h1 className="header-title">Le Male Elixir<br /><span className="header-sub">Absolu Parfum Intense</span></h1>
            <p className="header-desc">SHOP NOW</p>
          </div>
        </div>
      </header>

      <div className="products-category-wrapper">
        <BrandSelector selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} />

        {loading ? <p style={{ textAlign: "center", padding: "40px" }}>Loading...</p> :
          <ProductSection title={selectedBrand || "All Brands"} products={products} itemsPerPage={itemsPerPage} />
        }

        <CategorySection />

        <CategoryFilter season={season} setSeason={setSeason} sex={sex} setSex={setSex} />

        <div className="category-session-root">
          <div className="category-session-list">
            {categoryProducts.length === 0 ?
              <p style={{ textAlign: "center" }}>No category products found.</p> :
              categoryProducts.map(product => (
                <div className="category-session-card" key={product.product_ID}>
                  <Link to={`/detail?product_id=${product.product_ID}`} aria-label={`View details for ${product.product_name}`}>
                    <img src={product.image_url || FALLBACK_IMAGE} alt={product.product_name} className="category-session-img" />
                  </Link>
                  <div className="category-session-info">
                    <div className="category-session-brand">{product.brand_name || product.brand_ID || "Unknown Brand"}</div>
                    <div className="category-session-name">{product.product_name}</div>
                    <div className="category-session-price">{Number(product.price).toLocaleString("th-TH")} THB</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      <footer-main-component/>
      </div>
    </div>
    
  );
}