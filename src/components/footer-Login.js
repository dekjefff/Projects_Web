import './footer-login.css';
class footerLogin extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            <footer class="site-footer">
                <div class="footer-content">
                    <a href="#" class="footer-title">Services</a>
                    <a href="#" class="footer-title">Policy</a>
                    <a href="#" class="footer-title">Order</a>
                    <a href="/TeamDev" class="footer-title">Eros</a>
                    <a href="/Admin_Login" class="footer-title">Admin</a>
                </div>

<<<<<<< HEAD
                <div class="footer-social">
                    <div class="social-icons">
                        <a href="#" class="social-icon">📷</a> 
                        <a href="#" class="social-icon">𝐟</a> 
                        <a href="#" class="social-icon">╳</a> 
                        <a href="#" class="social-icon">🎶</a> </div>
=======
                    <div class="footer-social">
                        <p class="social-title">FOLLOW US</p>
                        <div class="IGG-icon"><img src="src/assets/Instragram-logo.png" alt="IG" /></div>
                        <div class="FB-icon"><img src="src/assets/FB.png" alt="FB" /></div>
                        <div class="X-icon"><img src="src/assets/X.png" alt="X" /></div>
                        <div class="TT-icon"><img src="src/assets/TT.png" alt="TT" /></div>
>>>>>>> main
                    </div>
                </div>

                <div class="footer-bottom">
                    <p class="copyright">© 2025 Eros. All rights reserved.</p>
                </div>

                <p class="social-title">FOLLOW US</p>
            </footer>
        `
    }
}
customElements.define('footer-login-component', footerLogin)