class footerLogin extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            <footer class="site-footer">
                <div class="footer-content">
                    <div class="footer-links">
                        <div class="link-group">
                            <a href="#" class="footer-title">Services</a>
                        </div>
                        <div class="link-group">
                            <a href="#" class="footer-title">Policy</a>
                        </div>
                        <div class="link-group">
                            <a href="#" class="footer-title">Order</a>
                        </div>
                        <div class="link-group">
                            <a href="/TeamDev" class="footer-title">Eros</a>
                        </div>
                        <div class="link-group">
                            <a href="/Admin_Login" class="footer-title">Admin</a>
                        </div>
                    </div>

                    <div class="footer-social">
                        <p class="social-title">FOLLOW US</p>
                        <div class="social-icons">
                            <a href="#" class="social-icon">📷</a> 
                            <a href="#" class="social-icon">𝐟</a> 
                            <a href="#" class="social-icon">╳</a> 
                            <a href="#" class="social-icon">🎶</a> </div>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p class="copyright">© 2025 Eros. All rights reserved.</p>
                </div>
            </footer>
        `
    }
}
// 💥 แก้ไข: เปลี่ยนชื่อเป็นตัวพิมพ์เล็กทั้งหมด
customElements.define('footer-login-component', footerLogin)