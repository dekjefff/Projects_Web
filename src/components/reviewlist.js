class ReviewList extends HTMLElement {
    constructor() {
        super();
        this.averageRating = 0;
        this.totalReviews = 0;
        this.reviews = [];
        this.productId = this.getAttribute('product-id'); // ดึง ID สินค้าจาก Attribute
    }

    // Helper function สำหรับสร้างดาว (ใช้ซ้ำได้)
    _createStars(rating) {
        const fullStar = '★';
        const emptyStar = '☆';
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            const char = i < rating ? fullStar : emptyStar;
            const className = i < rating ? 'full-star' : 'empty-star';
            starsHtml += `<span class="star ${className}">${char}</span>`;
        }
        return starsHtml;
    }

    connectedCallback() {
        this.renderInitialStructure();
        this.fetchReviews();
    }

    renderInitialStructure() {
        this.innerHTML = `
            <section class="review-section">
                <h3 class="section-title">Review</h3>

                <div class="average-rating-block">
                    <p class="average-rating-score loading">...</p>
                    <div class="average-rating-stars">
                        </div>
                    <span class="rating-count loading"></span>
                    <button class="write-review-button">Write a Review</button>
                </div>

                <div class="reviews-list loading-list">
                    กำลังโหลดรีวิว...
                </div>
            </section>
        `;
    }

    async fetchReviews() {
        // --- จำลอง API Fetch ---
        const mockProductStats = { averageRating: 5.0, totalReviews: 17 };
        const mockReviewsData = [
            { id: 1, user: "Yoyaho", rating: 5, comment: "Excellent!", likes: 100, dislikes: 0 },
            { id: 2, user: "trpx06", rating: 5, comment: "Worth every penny.", likes: 17, dislikes: 0 },
            // ... (ข้อมูลจาก API)
        ];
        
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        // --- สิ้นสุดการจำลอง API Fetch ---

        this.averageRating = mockProductStats.averageRating;
        this.totalReviews = mockProductStats.totalReviews;
        this.reviews = mockReviewsData;
        
        this.renderContent();
    }

    renderContent() {
        const reviewSection = this.querySelector('.review-section');
        if (!reviewSection) return;

        // อัปเดตส่วน Rating Rata-rata
        reviewSection.querySelector('.average-rating-score').textContent = this.averageRating.toFixed(1);
        reviewSection.querySelector('.average-rating-score').classList.remove('loading');
        
        reviewSection.querySelector('.average-rating-stars').innerHTML = this._createStars(Math.round(this.averageRating));
        
        reviewSection.querySelector('.rating-count').textContent = `(${this.totalReviews})`;
        reviewSection.querySelector('.rating-count').classList.remove('loading');

        // อัปเดตรายการรีวิว
        const reviewsListElement = reviewSection.querySelector('.reviews-list');
        reviewsListElement.innerHTML = ''; // เคลียร์สถานะ Loading
        reviewsListElement.classList.remove('loading-list');

        this.reviews.forEach(review => {
            // สร้าง JSON String สำหรับส่งข้อมูลไปยัง review-item-component
            const reviewJson = JSON.stringify(review);
            
            // สร้าง Custom Element และกำหนด Attribute
            const itemElement = document.createElement('review-item-component');
            itemElement.setAttribute('review-data', reviewJson);
            reviewsListElement.appendChild(itemElement);
        });
    }
}
customElements.define('review-list-component', ReviewList);