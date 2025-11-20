import React, { useState, useEffect } from 'react';
import './DetailMore.css'; // Import ไฟล์ CSS

const DetailMoreDetails = ({ productId }) => {
    // State สำหรับเก็บข้อมูลสินค้า (Reviews ถูกย้ายไปให้ Web Component จัดการเอง)
    const [product, setProduct] = useState(null);
    // ** ลบ const [reviews, setReviews] ออกไป **
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect เพื่อเรียก API เมื่อคอมโพเนนต์ถูก Mount
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                // --- จำลองข้อมูลที่จะได้จาก API  ---
                const mockProductData = {
                    id: productId,
                    name: "BLEU DE CHANEL",
                    exclusiveTag: "L'EXCLUSIF",
                    price: "7,100 THB",
                    imageUrl: "https://via.placeholder.com/250x350?text=BLEU+DE+CHANEL+Image",
                    description: "Described as an Extrait de Parfum, BLEU DE CHANEL L'EXCLUSIF is a complex and intense ambery-aromatic fragrance with a spellbinding trail... (etc)",
                    scentDetails: {
                        "Sandalwood": "A key ingredient especially highlighted in this version...",
                        "Leathery notes": "Mentioned for their warm and luxurious feel."
                    },
                    // ** ข้อมูลสถิติ (Rating/TotalReviews) ถูกย้ายไปให้ Web Component จัดการเองหรือดึงเอง **
                };
                
                // await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
                
                setProduct(mockProductData);
                // ** ลบ setReviews(mockReviewsData) ออก **

            } catch (err) {
                setError("ไม่สามารถดึงข้อมูลสินค้าได้ กรุณาลองใหม่อีกครั้ง");
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [productId]);

    if (loading) return <div className="loading-state">กำลังโหลดข้อมูลสินค้า...</div>;
    if (error) return <div className="error-state">ข้อผิดพลาด: {error}</div>;
    if (!product) return <div>ไม่พบข้อมูลสินค้า</div>;

    return (
        
        <div className="product-detail-container">
            <navbar-component/>
            {/* Header Product: ชื่อ, ราคา, และ รูปภาพ */}
            <div className="product-header">
                <div className="product-image-area">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-main-image"
                    />
                </div>
                <div className="product-info-area">
                    <h1 className="product-name">{product.name}</h1>
                    <h2 className="product-exclusif-tag">{product.exclusiveTag}</h2>
                    <p className="product-price">{product.price}</p>
                </div>
            </div>
            
            <hr/>

            {/* Product Info Section */}
            <section className="product-info-section">
                <h3 className="section-title">Product Info.</h3>
                <div className="info-block description">
                    <p className="info-label">DESCRIPTION</p>
                    <p className="info-content">{product.description}</p>
                </div>
                {product.scentDetails && Object.entries(product.scentDetails).map(([key, value]) => (
                    <div className="info-block" key={key}>
                        <p className="info-label">{key.toUpperCase()}</p>
                        <p className="info-content">{value}</p>
                    </div>
                ))}
            </section>

            <hr/>

            {/*
                *** Review Section ถูกแทนที่ด้วย Custom Element ***
                Web Component จะจัดการการดึงข้อมูลรีวิวเอง โดยใช้ product-id
            */}
            <review-list-component product-id={productId}></review-list-component>
            <footer-main-component />
        </div>
    );
};

export default DetailMoreDetails;