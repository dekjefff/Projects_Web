class footerMain extends HTMLElement {
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
                            <a href="#" class="footer-title">Eros</a>
                        </div>
                        <div class="link-group">
                            <a href="/TeamDev" class="footer-title">Admin</a>
                        </div>
                    </div>

                    <div class="footer-social">
                        <p class="social-title">FOLLOW US</p>
                        <div class="IGG-icon"><img src="src/assets/Instragram-logo.png" alt="IG" /></div>
                        <div class="FB-icon"><img src="src/assets/FB.png" alt="FB" /></div>
                        <div class="X-icon"><img src="src/assets/X.png" alt="X" /></div>
                        <div class="TT-icon"><img src="src/assets/TT.png" alt="TT" /></div>
                    </div>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p class="copyright">© 2025 Eros. All rights reserved.</p>
                </div>
            </footer>
        `
    }
}
customElements.define('footer-main-component', footerMain)