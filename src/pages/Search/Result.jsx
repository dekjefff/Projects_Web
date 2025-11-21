import React, { useState, useEffect } from 'react';
import './result.css'; 
import { FaArrowLeft, FaHeart, FaShareAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------
// --- 🚨 MOCK DATA & API SIMULATION (แทนที่ด้วย API จริง) ---
// ----------------------------------------------------------------

// ข้อมูลจำลองสำหรับตัวเลือกสินค้า (ใช้เป็นโครงสร้าง)
const DEFAULT_PRODUCT_DATA = {
    id: 0,
    name: "Product Loading...",
    brand: "Loading...",
    price: 0,
    images: ["src/assets/placeholder.jpg"], // ใช้ภาพ placeholder
    sizes: [{ size: "Loading...", price: 0 }],
    detail: "Loading product details...",
    rating: 0,
    reviewCount: 0
};

/**
 * 🚨 ฟังก์ชันจำลองการเรียก API Backend
 * ในการใช้งานจริง, ฟังก์ชันนี้จะใช้ fetch() เพื่อส่งค่า query/filter ไปยังเซิร์ฟเวอร์
 */
const fetchProductData = async (queryParams) => {
    // ในสถานการณ์จริง, เราจะใช้ queryParams (q, sex, size, season) 
    // เพื่อค้นหาสินค้าที่ตรงที่สุดเพียงชิ้นเดียว (หรือชิ้นแรกที่เจอ)
    console.log("Simulating API call with params:", queryParams);
    
    // 🚨 สมมติว่า API ค้นหาสินค้าที่ตรงกับ query ที่สุดและส่งกลับมา 1 ชิ้น
    // (ตอนนี้เรายังใช้ MOCK_PRODUCT_DATA อยู่)
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulating network delay
    
    // ถ้ามีการค้นหาที่ชัดเจน เช่น 'BLEU DE CHANEL' ให้ส่ง Mock Data กลับมา
    if (queryParams.q || queryParams.sex !== 'ALL') {
        return {
            id: 101,
            name: "BLEU DE CHANEL L'EXCLUSIF",
            brand: "CHANEL",
            price: 7100,
            images: [ /* ... (URL รูปภาพจริง) ... */ "src/assets/detail/bleu_main.jpg" ],
            sizes: [{ size: "60ml", price: 7100 }, { size: "100ml", price: 8900 }],
            detail: "A powerful and refined interpretation...",
            rating: 5.0,
            reviewCount: 17
        };
    }
    
    // ถ้าไม่มีการค้นหาที่ชัดเจน ให้คืนค่าว่างหรือค่าเริ่มต้น
    return DEFAULT_PRODUCT_DATA;
};


// ----------------------------------------------------------------
// --- Component หลัก: ProductDetailresult ---
// ----------------------------------------------------------------
const ProductDetailresult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(DEFAULT_PRODUCT_DATA);
    const [mainImage, setMainImage] = useState(DEFAULT_PRODUCT_DATA.images[0]);
    const [selectedSize, setSelectedSize] = useState(DEFAULT_PRODUCT_DATA.sizes[0].size);
    const [isLoading, setIsLoading] = useState(true); // สถานะโหลด

    // ------------------------------------
    // *** 🎯 การจัดการ Search/API ***
    // ------------------------------------
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        
        const q = queryParams.get('q') || '';
        const sex = queryParams.get('sex') || 'ALL';
        const size = queryParams.get('size') || 'ALL';
        const season = queryParams.get('season') || 'ALL';
        
        setIsLoading(true);

        // เรียก API ด้วยพารามิเตอร์จาก URL
        fetchProductData({ q, sex, size, season }).then(data => {
            // อัปเดต State ด้วยข้อมูลที่ได้จาก API
            setProduct(data);
            setMainImage(data.images[0]);
            setSelectedSize(data.sizes[0].size);
            setIsLoading(false);
        });

    }, [location.search]); // รันใหม่เมื่อ URL search string เปลี่ยน


    // คำนวณราคาสุทธิและจัดรูปแบบสกุลเงิน
    const currentPrice = product.sizes.find(s => s.size === selectedSize)?.price || product.price;
    const formattedPrice = currentPrice.toLocaleString('th-TH');

    const handleBackToSearch = () => {
        // นำทางกลับไปยังหน้าก่อนหน้า
        navigate(-1);
    };
    
    const handleAddToCart = () => {
        alert(`Added ${product.name} - ${selectedSize} (${formattedPrice} THB) to cart!`);
    };

    // ------------------------------------
    // *** ⚠️ สถานะ Loading ***
    // ------------------------------------
    if (isLoading) {
        return (
            <div className="product-detail-page-container loading">
                <h1>🔍 Searching for Product...</h1>
                <p>Please wait while we retrieve the best match for your criteria...</p>
            </div>
        );
    }
    
    // ------------------------------------
    // *** ⚠️ จัดการกรณีสินค้าไม่พบ ***
    // ------------------------------------
    if (product.id === 0 && !isLoading) {
        return (
            <div className="product-detail-page-container not-found">
                <h1>สินค้าไม่พบ (Not Found)</h1>
                <p>ไม่พบสินค้าที่ตรงกับคำค้นหาและตัวกรองของคุณ</p>
                <button className="back-button" onClick={handleBackToSearch}>
                    <FaArrowLeft /> Back to Search
                </button>
            </div>
        );
    }
    
    // ------------------------------------
    // *** Component UI (เหมือนเดิม) ***
    // ------------------------------------
    return (
        <div className="product-detail-page-container">
            
            <button className="back-button" onClick={handleBackToSearch}>
                <FaArrowLeft /> **Back to Search**
            </button>

            {/* --- Main Product Detail --- */}
            <div className="main-product-detail-section">
                
                {/* 1. Gallery รูปภาพ (ซ้าย) */}
                <div className="image-gallery-section">
                    <div className="thumbnail-list">
                        {product.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`View ${index + 1}`}
                                className={`thumbnail-image ${img === mainImage ? 'active' : ''}`}
                                onClick={() => setMainImage(img)}
                            />
                        ))}
                    </div>
                    <div className="main-image-container">
                        <img src={mainImage} alt={product.name} className="main-product-image" />
                    </div>
                </div>

                {/* 2. ข้อมูลสินค้า (ขวา) */}
                <div className="info-section">
                    <h1>{product.name}</h1>
                    <h2>{product.brand}</h2>
                    <p className="price-tag">{formattedPrice} THB</p>
                    
                    <div className="detail-links">
                        <a href="#details-section">More Details</a>
                        <span className="action-icons">
                            <FaHeart className="icon-link" />
                            <FaShareAlt className="icon-link" />
                        </span>
                    </div>
                    
                    <h3>Size:</h3>
                    <div className="size-options">
                        {/* ตรวจสอบว่ามี sizes ให้ map หรือไม่ */}
                        {product.sizes && product.sizes.map((sizeOption) => (
                            <button
                                key={sizeOption.size}
                                className={`size-button ${selectedSize === sizeOption.size ? 'active' : ''}`}
                                onClick={() => setSelectedSize(sizeOption.size)}
                            >
                                {sizeOption.size}
                            </button>
                        ))}
                    </div>

                    <button 
                        className="action-button-add-cart" 
                        onClick={handleAddToCart}
                    >
                        **Add to cart**
                    </button>

                    <div className="rating-section">
                        <div className="stars">
                            {'★'.repeat(Math.floor(product.rating))}
                            {'☆'.repeat(5 - Math.floor(product.rating))}
                        </div>
                        <span className="review-count">({product.reviewCount})</span>
                        <a href="#review-section" className="see-review-link">See Review</a>
                    </div>
                </div>
            </div>

            {/* ส่วนแสดงรายละเอียดสินค้าเพิ่มเติม (Detail/Description) */}
            <div id="details-section" className="product-description-section">
                <h3>Product Description</h3>
                <p>{product.detail}</p>
            </div>
            
            {/* Footer Component */}
            <footer-main-component/>
        </div>
    );
};

export default ProductDetailresult;