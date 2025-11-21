// Search.jsx
import React, { useState } from 'react';
// ตรวจสอบ Path ของ CSS
import './search.css'; 
import { FaSearch, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // ใช้สำหรับเปลี่ยนหน้าไปยัง Detail

// --- ข้อมูลสินค้าจำลอง (DUMMY DATA) ---
const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "IMAGINATION LOUIS VUITTON",
    brand: "LOUIS VUITTON",
    price: "12,500.00 THB",
    image: "src/assets/imagination.jpg", // ต้องมีรูปภาพนี้ใน Path
    sex: "Men",
    size: "100ml",
    season: "Summer",
    detail: "A burst of citruses, an explosion of light. The amber note gives it depth and complexity. Perfect for a refreshing and memorable day.",
  },
  {
    id: 2,
    name: "LE MALE ELIXIR ABSOLU PARFUM INTENSE",
    brand: "Jean Paul Gaultier",
    price: "4,500.00 THB",
    image: "src/assets/le_male_elixir.jpg", 
    sex: "Men",
    size: "125ml",
    season: "Winter",
    detail: "An amber, fougère, and woody fragrance with lavender, mint, and vanilla notes, providing a warm and sensual trail.",
  },
  {
    id: 3,
    name: "CHERRY AMOUR",
    brand: "LOUIS VUITTON",
    price: "15,000.00 THB",
    image: "src/assets/cherry_amour.jpg", 
    sex: "Women",
    size: "75ml",
    season: "Spring",
    detail: "A bright and fruity floral scent with notes of cherry and rose, perfect for daytime wear and joyous occasions.",
  },
  {
    id: 4,
    name: "PACIFIC CHILL",
    brand: "LOUIS VUITTON",
    price: "12,500.00 THB",
    image: "src/assets/pacific_chill.jpg", 
    sex: "Unisex",
    size: "100ml",
    season: "Summer",
    detail: "A refreshing wave of citrus and oceanic notes, capturing the essence of a tranquil Californian coast at dawn.",
  },
];
// ----------------------------------------

const ProductSearch = () => {
  const [searchResults, setSearchResults] = useState(DUMMY_PRODUCTS); // แสดงทั้งหมดในตอนเริ่มต้น (Select All)
  const [searchQuery, setSearchQuery] = useState('');
  const [sex, setSex] = useState('ALL');
  const [size, setSize] = useState('ALL');
  const [season, setSeason] = useState('ALL');

  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนหน้าด้วย Router

  // ฟังก์ชันจำลองการค้นหา (Requirement ข้อ 3)
  const handleSearch = (e) => {
    e.preventDefault();

    let results = DUMMY_PRODUCTS.filter(product => {
      // 1. ค้นหาด้วย Keyword/ชื่อ/แบรนด์ (Input Box)
      const matchesQuery = !searchQuery || 
                           product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. ค้นหาด้วยเกณฑ์ (Sex, Size, Season)
      const matchesSex = sex === 'ALL' || product.sex === sex;
      const matchesSize = size === 'ALL' || product.size.includes(size);
      const matchesSeason = season === 'ALL' || product.season === season;

      return matchesQuery && matchesSex && matchesSize && matchesSeason;
    });

    setSearchResults(results);
  };
  
  // ฟังก์ชันสำหรับเปลี่ยนหน้าไปแสดงรายละเอียดสินค้า (Requirement ข้อ 4)
  const handleShowDetail = (product) => {
    // ใช้ navigate เพื่อส่งข้อมูลสินค้าที่เลือกไปที่หน้า Result.jsx
    navigate('/resultDetailsearch', { state: { productData: product } });
  };

  return (
    <div className="product-search-container-page">
      
      {/* 1. ส่วนฟอร์มการค้นหา (แสดงถาวร) */}
      <div className="search-form-section">
          <form className="search-form-full" onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="I'm Looking For...Search by Brand, Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="criteria-group">
                <label>Sex:</label>
                <select value={sex} onChange={(e) => setSex(e.target.value)}>
                  <option value="ALL">ALL</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </select>

                <label>Size:</label>
                <select value={size} onChange={(e) => setSize(e.target.value)}>
                  <option value="ALL">ALL</option>
                  <option value="30ml">30ml</option>
                  <option value="50ml">50ml</option>
                  <option value="100ml">100ml</option>
                  <option value="125ml">125ml</option>
                </select>

                <label>Season:</label>
                <select value={season} onChange={(e) => setSeason(e.target.value)}>
                  <option value="ALL">ALL</option>
                  <option value="Summer">Summer</option>
                  <option value="Spring">Spring</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>

              <button type="submit" className="search-button">
                Search <FaSearch />
              </button>
          </form>
      </div>
      
      {/* 2. ส่วนแสดงผลลัพธ์การค้นหา */}
      <div className="search-results-list">
          <h2>🔍 Search Results ({searchResults.length} Products)</h2>
          <div className="product-list-grid">
              {searchResults.map((product) => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <div className="product-info">
                    <p className="product-name">
                      **{product.name}**
                    </p>
                    <p className="product-brand">{product.brand}</p>
                    <p className="product-price">{product.price}</p>
                    <button
                      className="detail-button"
                      onClick={() => handleShowDetail(product)} // ปุ่ม/ลิงก์ไปยังหน้าถัดไป
                    >
                      View Detail <FaEye />
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* แสดงข้อความเมื่อไม่พบสินค้า */}
          {searchResults.length === 0 && (
              <p className="no-results-message">
                  **No products found.** Please try adjusting your search criteria.
              </p>
          )}
      </div>
    </div>
  );
};

export default ProductSearch;