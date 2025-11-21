// Result.jsx
import React, { useState } from 'react';
import './result.css'; 
import { FaArrowLeft, FaHeart, FaShareAlt } from 'react-icons/fa'; // เพิ่ม FaHeart, FaShareAlt
import { useLocation, useNavigate } from 'react-router-dom';

// --- ข้อมูลจำลองสำหรับตัวเลือกสินค้า (Mock Data Extension) ---
// เราจะสมมติว่าข้อมูลสินค้าที่ถูกส่งมามี Array ของรูปภาพและขนาด
const MOCK_PRODUCT_DATA = {
    id: 101,
    name: "BLEU DE CHANEL L'EXCLUSIF", // เปลี่ยนชื่อให้ตรงกับภาพ
    brand: "CHANEL",
    price: 7100, // ราคาเริ่มต้น
    images: [ // รูปภาพย่อย
        "src/assets/detail/bleu_main.jpg", 
        "src/assets/detail/bleu_thumb1.jpg", 
        "src/assets/detail/bleu_thumb2.jpg", 
        "src/assets/detail/bleu_thumb3.jpg", 
    ],
    sizes: [ // ตัวเลือกขนาดและราคาที่เพิ่มขึ้น
        { size: "60ml", price: 7100 },
        { size: "100ml", price: 8900 }, // สมมติว่า 100ml ราคาสูงกว่า
    ],
    detail: "A powerful and refined interpretation of the iconic fragrance, embodying the essence of a man who chooses his own destiny. Notes of cedar and sandalwood create a profound, lasting trail.",
    rating: 5.0,
    reviewCount: 17
};

// --- ข้อมูลสินค้าเพิ่มเติม (Related Products - เหมือนเดิม) ---
const DUMMY_PRODUCTS = [
  // ... ใส่ข้อมูล DUMMY_PRODUCTS ที่เกี่ยวข้องสำหรับส่วนสินค้าเพิ่มเติมที่ด้านล่าง ...
  // ... (เพื่อความกระชับ ขอละไว้ แต่ควรมีเพื่อให้หน้าไม่ว่างเปล่า) ...
];


const ProductDetailresult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // ดึงข้อมูลสินค้าที่ส่งมา หรือใช้ข้อมูลจำลองถ้าไม่มี (สำหรับ Debug)
    const initialProduct = location.state?.productData || MOCK_PRODUCT_DATA; 
    
    // State สำหรับการจัดการ Gallery และ Size
    const [product, setProduct] = useState(initialProduct);
    const [mainImage, setMainImage] = useState(initialProduct.images[0]); // รูปภาพหลักที่แสดง
    const [selectedSize, setSelectedSize] = useState(initialProduct.sizes[0].size); // ขนาดที่ถูกเลือก

    // คำนวณราคาสุทธิ
    const currentPrice = product.sizes.find(s => s.size === selectedSize)?.price || product.price;

    const handleBackToSearch = () => {
        navigate('/Search');
    };

    // กรองสินค้าอื่นๆ ที่ไม่ใช่สินค้าหลัก
    const relatedProducts = DUMMY_PRODUCTS.filter(p => p.id !== product?.id);

    return (
        <div className="product-detail-page-container">
            {/* --- Header/Navigation Bar (Home, Collections, Eros) --- */}
            {/* ส่วนนี้จะอยู่ใน Component NavbarTop ที่คุณได้สร้างไว้ */}
            
            <button className="back-button" onClick={handleBackToSearch}>
                <FaArrowLeft /> Back to Search
            </button>

            {/* --- ส่วนแสดงรายละเอียดสินค้าหลัก (Main Product Detail) --- */}
            <div className="main-product-detail-section">
                
                {/* 1. ส่วน Gallery รูปภาพ (ซ้าย) */}
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

                {/* 2. ส่วนข้อมูลสินค้า (ขวา) */}
                <div className="info-section">
                    <h1>{product.name}</h1>
                    <h2>{product.brand}</h2>
                    <p className="price-tag">{currentPrice.toLocaleString('th-TH')} THB</p>
                    
                    <div className="detail-links">
                        <a href="#details-section">More Details</a>
                        <span className="action-icons">
                            <FaHeart className="icon-link" />
                            <FaShareAlt className="icon-link" />
                        </span>
                    </div>
                    
                    <h3>Size:</h3>
                    <div className="size-options">
                        {product.sizes.map((sizeOption) => (
                            <button
                                key={sizeOption.size}
                                className={`size-button ${selectedSize === sizeOption.size ? 'active' : ''}`}
                                onClick={() => setSelectedSize(sizeOption.size)}
                            >
                                {sizeOption.size}
                            </button>
                        ))}
                    </div>

                    <button className="action-button-add-cart">Add to cart</button>

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

            {/* --- Footer (Service, Policy, Order, Eros) --- */}
            {/* ส่วนนี้จะอยู่ใน Component Footer ที่คุณได้สร้างไว้ */}
            
            {/* --- ส่วนแสดงสินค้าเพิ่มเติม (Related Products / More Products) --- */}
            {/* สามารถนำส่วน Related Products กลับมาใช้ที่ด้านล่างได้หากต้องการ */}
            
        </div>
    );
};

export default ProductDetailresult;