import React, { useState, useEffect } from 'react';


const API_BASE_URL = 'http://localhost:3030/api/homepage'; 


const DUMMY_BRANDS = ['Creed', 'Chanel', 'Dior', 'Gucci'];

/**
 * 💡 ฟังก์ชันจำลองการเรียก API
 * ในโปรเจกต์จริง คุณจะต้องเปลี่ยนไปใช้ `fetch` หรือ Axios และจัดการกับ Error Handling
 */
const fetchProducts = async (endpoint, params) => {
  console.log(`Calling API: ${endpoint}`, params);
  
  // จำลองการกรองข้อมูลตาม API Logic
  if (endpoint.includes('brand')) {
    const brand = params.get('frombrand');
    return DUMMY_PRODUCTS.filter(p => p.brand_name === brand);
  }
  
  if (endpoint.includes('category')) {
    const season = params.get('category_season');
    const sex = params.get('category_sex');
    // ในฐานข้อมูลจริง จะเป็นการ JOIN และ WHERE ตามที่ Controller ทำงาน
    console.log(`Filtering for ${season} ${sex}`);
    return DUMMY_PRODUCTS.slice(0, 3); // ส่งสินค้า 3 ชิ้นแรกเป็นตัวอย่าง
  }

  return DUMMY_PRODUCTS;
};

// --- Sub-Component สำหรับแสดงสินค้า ---
const ProductCard = ({ product }) => (
  <div className="product-card">
    <img src={`/images/${product.image_url}`} alt={product.product_name} />
    <p className="product-name">**{product.product_name}**</p>
    <p className="product-price">{product.price} THB</p>
  </div>
);

// --- Component หลัก ---
const HomePage = () => {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [brandProducts, setBrandProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(DUMMY_BRANDS[0]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Best Summer Men');
  
  const bannerImages = ['banner1.jpg', 'banner2.jpg', 'banner3.jpg'];

  // 1. Logic สำหรับ Dynamic Banner
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex(prevIndex => (prevIndex + 1) % bannerImages.length);
    }, 5000); // เปลี่ยนรูปทุก 5 วินาที
    return () => clearInterval(interval);
  }, []);

  // 2. Logic สำหรับ Recommend by Brand
  useEffect(() => {
    const loadBrandProducts = async () => {
      const params = new URLSearchParams({ frombrand: selectedBrand });
      // URL: /api/homepage/brand?frombrand=SelectedBrand
      const products = await fetchProducts(`${API_BASE_URL}/brand`, params);
      setBrandProducts(products);
    };
    loadBrandProducts();
  }, [selectedBrand]);

  // 3. Logic สำหรับ Recommend by Category (Men/Women & Season)
  useEffect(() => {
    const loadCategoryProducts = async () => {
      // แยก season และ sex จาก string ที่เลือก
      const parts = selectedCategory.split(' ');
      const category_season = parts[1]; // เช่น 'Summer' หรือ 'Winter'
      const category_sex = parts[2];     // เช่น 'Men' หรือ 'Women'
      
      const params = new URLSearchParams({ category_season, category_sex });
      // URL: /api/homepage/category?category_season=...&category_sex=...
      const products = await fetchProducts(`${API_BASE_URL}/category`, params);
      setCategoryProducts(products);
    };
    loadCategoryProducts();
  }, [selectedCategory]);
  return (
    <div className="homepage-container">
      
      {/* 1. Dynamic Banner */}
      <div className="banner-section">
        <img 
          src={`/images/${bannerImages[bannerIndex]}`} 
          alt="Banner Ad" 
          className="dynamic-banner-img"
        />
        <div className="banner-dots">
          {bannerImages.map((_, index) => (
            <span key={index} className={index === bannerIndex ? 'active' : ''}></span>
          ))}
        </div>
      </div>

      <hr />

      {/* 2. Recommend by Brand  */}
      <section className="product-section brand-section">
        <h2> แนะนำสินค้าจากแบรนด์ {selectedBrand}</h2>
        <div className="form-creed">
          <label htmlFor="brand-select">Select Brand: </label>
          <select 
            id="brand-select"
            value={selectedBrand} 
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            {DUMMY_BRANDS.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
        <div className="product-list">
          {brandProducts.map(p => <ProductCard key={p.product_ID} product={p} />)}
        </div>
      </section>

      <hr />

      {/* 3. Recommend by Category  */}
      <section className="product-section category-section">
        <h2> หมวดหมู่แนะนำ: {selectedCategory}</h2>
        <div className="category-dropdown">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {['Best Summer Men', 'Best Summer Women', 'Best Winter Men', 'Best Winter Women'].map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="product-list">
          {categoryProducts.map(p => <ProductCard key={p.product_ID} product={p} />)}
        </div>
      </section>
      {/* 4. Recommend by Gender  */}
      <section className="product-section gender-section">
        <p className="note">ส่วนนี้จะแสดงผลสินค้าเพศ Men โดยตั้งค่าฤดูเป็น Summer </p>
        <div className="product-list">
          {/* ดึงสินค้า for Men/Women โดยตรง  */}
          {DUMMY_PRODUCTS.slice(1,4).map(p => <ProductCard key={p.product_ID} product={p} />)}
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;