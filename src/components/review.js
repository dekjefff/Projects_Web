// Helper function สำหรับสร้างดาว (ไม่สามารถใช้ JSX ได้ใน Web Component)
function createStars(rating) {
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

class ReviewItem extends HTMLElement {
    connectedCallback() {
        // ดึงข้อมูลรีวิวผ่าน Attributes (ต้องแปลง JSON String เป็น Object)
        const reviewJson = this.getAttribute('review-data');
        if (!reviewJson) return;
        
        try {
            const review = JSON.parse(reviewJson);
            
            this.innerHTML = `
                <div class="review-item">
                    <div class="review-rating-stars">
                        ${createStars(review.rating)}
                    </div>
                    <p class="reviewer-name">${review.user}</p>
                    <div class="review-date">Review date</div>
                    
                    <div class="review-text-box">
                        <p class="review-text">${review.comment}</p>
                        <div class="review-feedback">
                            <span class="feedback-like">👍 ${review.likes}</span>
                            <span class="feedback-dislike">👎 ${review.dislikes}</span>
                        </div>
                        <span class="review-report">Report</span>
                    </div>
                </div>
            `;
        } catch (e) {
            console.error("Invalid review-data JSON:", e);
        }
    }
}
customElements.define('review-item-component', ReviewItem);