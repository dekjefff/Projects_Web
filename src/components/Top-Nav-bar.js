import { Link } from 'react-router-dom';
class NavbarTop extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="navbar-left">
                <a href="../pages/home-page/homepage.jsx" class="nav-item home-button">HOME</a>
                <a href="#" class="nav-item">COLLECTIONS</a>
            </div>

            <div class="navbar-logo">
                <div><img src="src/assets/Logo.png" alt="Logo" /></div>
            </div>

            <div class="navbar-right">
                <a href="#" class="nav-item">Men</a>
                <a href="#" class="nav-item">Women</a>
                <div class="nav-icons">
                    <a href="/Search" class="search-icon"><img src="src/assets/icon.png" alt="search" /></a>
                    <a href="/cartpage" class="bag-icon"><img src="src/assets/Bag_alt.png" alt="bag" /></a>
                    <a href="/login" class="login-icon"><img src="src/assets/Login.png" alt="Login" /></a>
                </div>
            </div>
        `
    }
}
customElements.define('navbar-component', NavbarTop)