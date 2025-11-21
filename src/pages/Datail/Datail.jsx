// detail.jsx
import React, { useState, useEffect } from 'react';
import './detail.css'; // ตรวจสอบให้แน่ใจว่าชื่อไฟล์ CSS ถูกต้อง (detail.css)

const dummyProduct = {
    id: '123',
    name: 'BLEU DE CHANEL L\'EXCLUSIF',
    price: 7100,
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
    const { addToCart } = useCart(); // <--- เพิ่ม: เรียกใช้ Context function
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('60ml');
    const [mainImage, setMainImage] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [copyMessage, setCopyMessage] = useState('');
    const [error, setError] = useState(null); // สถานะใหม่สำหรับจัดการ Error

    useEffect(() => {

        const fetchProductDetail = async () => {
            try {
                const response = await fetch("/api/ShowProduct");

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.data && data.data.length > 0) {
                    const singleProduct = data.data[0];

                    const mappedProduct = {
                        // ใช้ dummyProduct เป็นฐานข้อมูล fallback
                        ...dummyProduct,
                        id: singleProduct.product_ID,
                        name: singleProduct.product_name,
                        // NOTE: ควร map fields price, rating, sizes, imageUrls จาก API ด้วย
                    };

                    if (mappedProduct && mappedProduct.name) {
                        setProduct(mappedProduct);
                        setMainImage(mappedProduct.imageUrls[0] || dummyProduct.imageUrls[0]);
                    }
                } else {
                    setProduct(dummyProduct);
                    setMainImage(dummyProduct.imageUrls[0]);
                    console.error("API response structure is incorrect, using dummy data as fallback.");
                }

            } catch (err) {
                console.error("Error fetching product detail:", err);
                setError(`Failed to load product. ${err.message}`);
                setProduct(dummyProduct);
                setMainImage(dummyProduct.imageUrls[0]);
            }
        };

        fetchProductDetail();

    }, [productId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!product) {
        return <div>Loading product details...</div>;
    }

    const { name, price, rating, reviewCount, sizes, imageUrls } = product;
    const ratingStars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));

    const handleLikeToggle = () => {
        setIsLiked(prev => !prev);
        console.log(`Product Liked Status: ${!isLiked}`);
    };

    const handleAddToCart = () => {
        const productToAdd = {
            id: product.id,          // <--- ต้องมีค่า
            name: name,
            price: price,
            size: selectedSize,      // <--- ต้องมีค่า (เช่น '60ml')
            imageUrl: mainImage,
        };

        if (productToAdd.id && productToAdd.size) { // เพิ่มการตรวจสอบเพื่อความปลอดภัย
            addToCart(productToAdd); // <--- เรียกใช้ Context
            console.log(`Adding ${name} (Size: ${selectedSize}, ID: ${product.id}) to cart.`);
            alert(`Add ${name} Size: ${selectedSize} to cart!`);
        } else {
            console.error("Product ID or size is missing for adding to cart.");
            alert("Please select a size before adding to cart.");
        }
    };

    const handleShare = async () => {
        const urlToCopy = window.location.href;

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
            setCopyMessage('เบราว์เซอร์ไม่รองรับการคัดลอกอัตโนมัติ');
        }

        setTimeout(() => setCopyMessage(''), 3000);
    };

    return (
        <div className="product-detail-container">
            <navbar-component />
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

                    {copyMessage && <p className="copy-message">{copyMessage}</p>}

                    <div className="action-icons">
                        <div
                            className="icon-wrapper"
                            onClick={handleLikeToggle}
                            style={{ cursor: 'pointer' }}
                        >
                            {isLiked ? (
                                <img src="src/assets/Heart2.png" alt="Liked" className="like-icon" />
                            ) : (
                                <img src="src/assets/Heart.png" alt="Unliked" className="unlike-icon" />
                            )}
                        </div>

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
                        onClick={handleAddToCart} // <--- ใช้ฟังก์ชันที่อัปเดตแล้ว
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