import React, { useState, useEffect } from 'react';
import './homepage.css';

// --- 1. Import ProductCard จากไฟล์อื่น ---
import ProductCard from '../../components/ProductCard'; 
// --- 3. Component หลัก ---
const ErosHomePage = () => { // หรือชื่อ Component ของคุณ
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bestOption, setBestOption] = useState('best summer for men');
  const [selectedBrand, setSelectedBrand] = useState('Creed'); 

  // --- fetchData 
  const fetchData = async () => {
    try {
      const productsRes = await fetch('http://localhost:3030/api/products');
      const productsData = await productsRes.json();
      
      // (ตัวอย่างข้อมูลชั่วคราว - ถูกต้องแล้ว)
      const bannerData = {
        title: 'Le Male Elixir',
        subtitle: 'Absolu Parfum Intense',
        imageUrl: `http://localhost:3030/images/main_banner.jpg`,
      };
      const genderBannersData = {
        men: `http://localhost:3030/images/for_men.jpg`,
        women: `http://localhost:3030/images/for_women.jpg`,
      };

      const apiData = {
        banner: bannerData,
        products: productsData, 
        genderBanners: genderBannersData,
      };
      setData(apiData);
    
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  

  if (loading) {
    return <div>Loading...</div>; 
  }

  // ---  2. กรองข้อมูล (เติม Logic ที่หายไป)  ---
  const getBestProducts = (option) => {
    if (!data) return [];
    
    // "best summer for men" -> parts[1] = "summer", parts[3] = "men"
    const parts = option.split(' '); 
    const season = parts[1];
    const gender = parts[3];

    return data.products.filter(p => {
      // ตรวจสอบเพศ (รองรับ unisex)
      const isCorrectGender = p.gender === gender || p.gender === 'unisex';
      
      // ตรวจสอบฤดู (ต้องมี isSummerBest, isWinterBest ใน API response)
      let isCorrectSeason = false;
      if (season === 'summer') {
        isCorrectSeason = p.isSummerBest; 
      } else if (season === 'winter') {
        isCorrectSeason = p.isWinterBest; 
      }
      
      return isCorrectGender && isCorrectSeason;
    });
  };

  const allBrands = data ? [...new Set(data.products.map(p => p.brand))] : [];
  const filteredBrandProducts = data ? data.products.filter(p => p.brand === selectedBrand) : [];
  const bestProducts = data ? getBestProducts(bestOption) : [];
  const bestOptionsList = [
    'best summer for men', 
    'best summer for women', 
    'best winter for men', 
    'best winter for women'
  ];


  //  3. ส่วน Return JSX (เติมเนื้อหาที่หายไป)  ---
  return (
    <div className="eros-page-container">
      <navlogo-component />
      <main className="eros-home-page">
        
        {/* Banner โฆษณารูปใหญ่ */}
        <section className="main-banner" style={{ backgroundImage: `url(${data.banner.imageUrl})` }}>
          <div className="banner-content">
            <h1>{data.banner.title}</h1>
            <h2>{data.banner.subtitle}</h2>
          </div>
        </section>
        
        <hr/>
        
        {/* From Brand (Dropdown) */}
        <section className="product-section">
          <div className="section-header">
            <h3>From Brand</h3>
            <select 
              value={selectedBrand} 
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="section-select" 
            >
              {allBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div className="product-list">
            {filteredBrandProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
        
        <hr/>
        
        {/* For Men / For Women */}
        <section className="gender-banners-section">
          <div className="gender-banner men" style={{ backgroundImage: `url(${data.genderBanners.men})` }}>
            <div className="overlay-text">For Men</div>
          </div>
          <div className="gender-banner women" style={{ backgroundImage: `url(${data.genderBanners.women})` }}>
            <div className="overlay-text">For Women</div>
          </div>
        </section>
        
        <hr/>
        
        {/*  Best For */}
        <section className="product-section best-for-section">
          <div className="section-header">
            <label htmlFor="best-option"><h3>{bestOption.toUpperCase()} ⌄</h3></label>
            <select 
              id="best-option" 
              value={bestOption} 
              onChange={(e) => setBestOption(e.target.value)}
              className="section-select" 
            >
              {bestOptionsList.map(option => (
                <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="product-list">
            {bestProducts.length > 0 ? (
              bestProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>No products found for {bestOption}.</p>
            )}
          </div>
        </section>
        
      </main>
      <footer-main-component />
    </div>
  );
};

export default ErosHomePage;