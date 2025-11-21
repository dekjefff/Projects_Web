import React, { useState, useEffect } from 'react';
import './DetailMore.css'; // สมมติว่ามีไฟล์ CSS สำหรับหน้านี้
// import Navbar and Footer components here

// ข้อมูลจำลองสำหรับโครงสร้างข้อมูลที่คาดว่าจะได้รับจาก API
const dummyData = {
    name: "BLEU DE CHANEL L'EXCLUSIF",
    price: 7100,
    rating: 5.0,
    reviewCount: 17,
    description: "Ciste is an Extrait de Parfum. BLEU DE CHANEL L'EXCLUSIF is a complex and intense ambery-aromatic fragrance with a spellbinding trail. Its woody notes, the emblematic signature of BLEU DE CHANEL, have been accentuated, lending the scent a warm quality. Leathery, ambery and resinous notes make L'EXCLUSIF the most mysterious of all the BLEU DE CHANEL fragrances. Its opulente creates that truly unfurls on the skin. ...",
    scentNotes: [
        { key: "Sandalwood", value: "A key ingredient especially highlighted in this version, giving the scent a deep, warm, and soft quality." },
        { key: "Cistus Labdanum", value: "A sweet and resinous gum scent that helps create a mysterious and intriguing charm for the fragrance." },
        { key: "Leathery notes", value: "Mentioned for their warm and luxurious feel." },
        { key: "Woody Ambery notes", value: "A blend of woody and ambery notes that provides warmth and vitality, adding dimension and memorability to the fragrance." },
    ],
    reviews: [
        { id: 1, user: 'Yoyaho', score: 5, date: 'Review date', text: 'Text box...', likes: 0, dislikes: 100 },
        { id: 2, user: 'trpx06', score: 5, date: 'Review date', text: 'Text box...', likes: 17, dislikes: 0 },
        // ... รีวิวอื่นๆ
    ],
    imageUrl: 'api/images/main-bleu.jpg' // รูปสินค้าหลัก
};

// 🌟 Component ย่อย: ฟอร์มสำหรับเขียนรีวิว (Modal) 🌟
const ReviewForm = ({ productId, onClose, onReviewSubmitted }) => {
    const currentUserId = 1; 
    
    // 🔑 เพิ่ม State สำหรับเก็บชื่อผู้รีวิว
    const [reviewerName, setReviewerName] = useState(''); 
    
    const [score, setScore] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 🔑 ตรวจสอบชื่อผู้รีวิว
        if (!reviewerName.trim()) return alert("กรุณาใส่ชื่อผู้รีวิว");
        if (!reviewText.trim()) return alert("กรุณาใส่ข้อความรีวิว");
        
        setSubmitting(true);
        
        const reviewData = {
            product_ID: productId || '1000000002', 
            user_ID: currentUserId, 
            user_name: reviewerName, // 🔑 ส่งชื่อผู้รีวิวไป Backend
            rating_score: score,
            review_text: reviewText,
        };

        try {
            const response = await fetch("/api/AddReview", { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });

            const data = await response.json();

            if (response.ok && !data.error) {
                alert("รีวิวสำเร็จ! ขอบคุณสำหรับความคิดเห็น");
                onReviewSubmitted(); 
                onClose();
            } else {
                alert(`การส่งรีวิวล้มเหลว: ${data.message || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์'}`);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="review-modal-overlay">
            <div className="review-modal">
                <h3>Write a review</h3>
                <form onSubmit={handleSubmit}>
                    
                    {/*  ส่วนที่เพิ่ม: Input สำหรับชื่อผู้รีวิว */}
                    <div className="input-group">
                        <label htmlFor="reviewerName">Name:</label>
                        <input
                            type="text"
                            id="reviewerName"
                            placeholder="Ex. DekJeff, Yoyaho"
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="rating-input">
                        <label>Score:</label>
                        <select value={score} onChange={(e) => setScore(parseInt(e.target.value))} required>
                            {[5, 4, 3, 2, 1].map(s => (
                                <option key={s} value={s}>{s} star</option>
                            ))}
                        </select>
                    </div>

                    <textarea 
                        placeholder="แบ่งปันความคิดเห็นของคุณ..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows="5"
                        required
                    />
                    <div className="form-actions">
                        <button type="submit" disabled={submitting}>
                            {submitting ? 'กำลังส่ง...' : 'submit'}
                        </button>
                        <button type="button" onClick={onClose} disabled={submitting}>cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

//  Component ย่อย: แสดงรีวิวแต่ละรายการ 
const ReviewItem = ({ review }) => {
    const reviewStars = '★'.repeat(review.score) + '☆'.repeat(5 - review.score);
    return (
        <div className="review-item">
            <div className="review-header">
                <span className="review-stars">{reviewStars}</span>
                <span className="review-user">{review.user}</span>
            </div>
            <div className="review-body">
                <p className="review-text">{review.text}</p> 
            </div>
            <div className="review-footer">
                <span className="review-date">{review.date}</span>
                <div className="review-actions">
                    <span className="action-like">👍 {review.likes}</span>
                    <span className="action-dislike">👎 {review.dislikes}</span>
                    <span className="action-report">Report</span>
                </div>
            </div>
        </div>
    );
};


// ⭐️ Component หลัก: DetailMore ⭐️
const DetailMore = ({ productId }) => {
    const [productDetails, setProductDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false); // State สำหรับ Modal

    // ฟังก์ชันสำหรับดึงข้อมูลสินค้า/รีวิว
    const fetchDetails = async () => {
        setIsLoading(true); 
        try {
            const response = await fetch(`/api/ShowProduct`); 
            if (!response.ok) {
                throw new Error('Failed to fetch product details.');
            }
            const data = await response.json();
            
            setProductDetails(dummyData); 
            
        } catch (err) {
            console.error("Error fetching detail:", err);
            setError(err.message);
            setProductDetails(dummyData); 
        } finally {
            setIsLoading(false);
        }
    };

    // การดึงข้อมูลครั้งแรก
    useEffect(() => {
        fetchDetails();
    }, [productId]);

    // ฟังก์ชันสำหรับเรียกซ้ำเมื่อมีการส่งรีวิวใหม่
    const handleReviewSubmitted = () => {
        fetchDetails(); 
    };


    if (isLoading) {
        return <div className="loading-state">Loading product details...</div>;
    }

    if (error) {
        return <div className="error-state">Error: {error}</div>;
    }

    const product = productDetails;
    const ratingStars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

    // JSX Output หลัก
    return (
        <div className="detail-more-container">
            {/* แสดง Modal Review Form หาก showReviewForm เป็น true */}
            {showReviewForm && (
                <ReviewForm 
                    productId={productId || '1000000002'} 
                    onClose={() => setShowReviewForm(false)} 
                    onReviewSubmitted={handleReviewSubmitted} 
                />
            )}

            <navbar-component />
            <header className="product-header-sm">
                <div className="product-image-sm">
                    <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="product-info-sm">
                    <h1 className="product-name">{product.name}</h1>
                    <p className="product-price">{product.price.toLocaleString('th-TH')} THB</p>
                </div>
            </header>

            <main className="detail-more-content">
                
                {/* --- Product Info Section --- */}
                <section className="product-info-section">
                    <h2>Product Info.</h2>
                    
                    <div className="description-block">
                        <h3>DESCRIPTION</h3>
                        <p>{product.description}</p>
                    </div>

                    <div className="scent-block">
                        <h3>Scent</h3>
                        {product.scentNotes.map((note, index) => (
                            <p key={index}>
                                <strong>{note.key}:</strong> {note.value}
                            </p>
                        ))}
                    </div>
                </section>
                
                <hr className="divider" />
                
                {/* --- Review Section --- */}
                <section className="review-section">
                    <h2>Review</h2>
                    <div className="review-summary">
                        <span className="rating-value">{product.rating.toFixed(1)}</span>
                        <span className="rating-stars">{ratingStars}</span>
                        <span className="review-count">({product.reviewCount})</span>
                        {/* ปุ่มสำหรับเปิด Modal */}
                        <button 
                            className="write-review-button"
                            onClick={() => setShowReviewForm(true)}
                        >
                            Write a Review
                        </button>
                    </div>

                    <div className="reviews-list">
                        {product.reviews.map(review => (
                            <ReviewItem key={review.id} review={review} />
                        ))}
                    </div>
                </section>
            </main>

            <footer-main-component />
        </div>
    );
};

export default DetailMore;