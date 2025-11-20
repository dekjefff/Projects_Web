import React, { useState, useEffect } from 'react';
import './detail.css'; // ตรวจสอบให้แน่ใจว่าชื่อไฟล์ CSS ถูกต้อง (detail.css)

// ข้อมูลจำลอง (ไม่เปลี่ยนแปลง)
const dummyProduct = {
    id: '123',
    name: 'BLEU DE CHANEL L\'EXCLUSIF',
    price: 7100, // THB
    rating: 5.0,
    reviewCount: 17,
    sizes: ['60ml', '100ml'],
    imageUrls: [
        'api/images/main-bleu.jpg', 
        'api/images/thumb-1.jpg',   
        'api/images/thumb-2.jpg',   
        'api/images/thumb-3.jpg',   
        'api/images/thumb-4.jpg',   
    ]
};

// *********** Component หลัก ***********
const ProductDetail = ({ productId }) => {
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('60ml');
    const [mainImage, setMainImage] = useState('');
    const [isLiked, setIsLiked] = useState(false); 
    // ******* สถานะใหม่สำหรับแจ้งเตือนการคัดลอก *******
    const [copyMessage, setCopyMessage] = useState('');

    useEffect(() => {
        setProduct(dummyProduct);
        setMainImage(dummyProduct.imageUrls[0]);
    }, [productId]);

    if (!product) {
        return <div>Loading product details...</div>;
    }

    const { name, price, rating, reviewCount, sizes, imageUrls } = product;
    const ratingStars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));

    // ******* ฟังก์ชันจัดการถูกใจ *******
    const handleLikeToggle = () => {
        setIsLiked(prev => !prev);
        console.log(`Product Liked Status: ${!isLiked}`);
    };

    // ******* ฟังก์ชันจัดการ Add to Cart *******
    const handleAddToCart = () => {
        console.log(`Adding ${name} (Size: ${selectedSize}, ID: ${productId}) to cart.`);
        alert(`เพิ่ม ${name} ขนาด ${selectedSize} ลงในตะกร้าแล้ว!`);
    };

    // ******* ฟังก์ชันใหม่สำหรับปุ่มแชร์ (คัดลอก URL) *******
    const handleShare = async () => {
        const urlToCopy = window.location.href; // ดึง URL ปัจจุบันของหน้า
        
        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(urlToCopy);
                setCopyMessage('คัดลอกลิงก์สำเร็จ!');
                console.log('URL copied to clipboard:', urlToCopy);
            } catch (err) {
                setCopyMessage('คัดลอกลิงก์ไม่สำเร็จ');
                console.error('Failed to copy: ', err);
            }
        } else {
            // Fallback สำหรับเบราว์เซอร์เก่า
            setCopyMessage('เบราว์เซอร์ไม่รองรับการคัดลอกอัตโนมัติ');
        }

        // ซ่อนข้อความแจ้งเตือนหลังจาก 3 วินาที
        setTimeout(() => setCopyMessage(''), 3000);
    };
    // *******************************************************

    return (
        <div className="product-detail-container">
            <navbar-component/>

            <main className="product-content">
                <div className="image-gallery">
                    <div className="thumbnails">
                        {imageUrls.map((url, index) => (
                            <div 
                                key={index} 
                                className={`thumbnail-item ${mainImage === url ? 'active' : ''}`}
                                onClick={() => setMainImage(url)}
                            >
                                <img src={url} alt={`Thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                    
                    <div className="main-image">
                        <img 
                            src={mainImage} 
                            alt={name} 
                            className="product-main-img" 
                        />
                    </div>
                </div>

                <div className="product-info">
                    <h1 className="product-name">{name}</h1>
                    <p className="product-price">{price.toLocaleString('th-TH')} THB</p>
                    <a href="/detailMore" className="more-details">More Details</a>

                    {/* แสดงข้อความแจ้งเตือนการคัดลอก */}
                    {copyMessage && <p className="copy-message">{copyMessage}</p>}

                    <div className="action-icons">
                        {/* ปุ่มถูกใจ (Heart) ที่มีสถานะ */}
                        <div 
                            className="icon-wrapper" 
                            onClick={handleLikeToggle}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* ใช้รูปภาพตามที่คุณกำหนด: Heart2.png (ถูกใจ) และ Heart.png (ไม่ถูกใจ) */}
                            {isLiked ? (
                                <img src="src/assets/Heart2.png" alt="Liked" className="like-icon" />
                            ) : (
                                <img src="src/assets/Heart.png" alt="Unliked" className="unlike-icon" />
                            )}
                        </div>
                        
                        {/* ปุ่มแชร์: ผูกกับฟังก์ชัน handleShare */}
                        <div 
                            className="icon-wrapper" 
                            onClick={handleShare}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src="src/assets/Upload.png" alt="Share" />
                        </div>
                    </div>

                    <div className="size-options">
                        {sizes.map(size => (
                            <button
                                key={size}
                                className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>

                    <button 
                        className="add-to-cart-button"
                        onClick={handleAddToCart}
                    >
                        Add to cart
                    </button>

                    <div className="reviews">
                        <span className="rating-stars">{ratingStars}</span>
                        <span className="rating-value">{rating.toFixed(1)}</span>
                        <span className="review-count">({reviewCount})</span>
                        <a href="#reviews" className="see-review-link">See Review</a>
                    </div>
                </div>
            </main>
            
            {/*<footer-main-component />*/}
        </div>
    );
};

export default ProductDetail;