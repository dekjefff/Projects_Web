import './footer-login.css';
class footerLogin extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            <footer class="site-login-footer">
                <div class="footer-content">
                    <a href="#">Services</a>
                    <a href="#">Policy</a>
                    <a href="#">Order</a>
                    <a href="/TeamDev">Eros</a>
                </div>

                <div class="footer-bottom">

                    <div class="copyright">© 2025 Eros. All rights reserved.</div>
                
                    <div class="Social-login-footer">
                        <span class="Social-title">FOLLOW US</span>
                        
                        <div class="Social-icon">
                            <a href="https://www.instagram.com/dekjefff/" target="_blank" rel="noopener noreferrer">
                                <img src="src/assets/Instragram-logo.png" alt="Instragram"/>
                            </a>

                            <a href="https://www.facebook.com/share/17aGebKM63/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                                <img src="src/assets/FB.png" alt="Facebook" />
                            </a>
                    
                            <a href="https://www.instagram.com/dekjefff/" target="_blank" rel="noopener noreferrer">
                                <img src="src/assets/X.png" alt="Twitter" />
                            </a>
                    
                            <a href="https://www.tiktok.com/@yakkinkaiping?_r=1&_t=ZS-91ZBIjllqh0" target="_blank" rel="noopener noreferrer">
                                <img src="src/assets/TT.png" alt="Tiktok" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        `
    }
}
customElements.define('footer-login-component', footerLogin)