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
                    <div class="search-icon"><img src="src/assets/icon.png" alt="search" /></div>
                    <div class="bag-icon"><img src="src/assets/Bag_alt.png" alt="bag" /></div>
                    <div href="../pages/User_login/Login.jsx" class="login-icon"><img src="src/assets/Login.png" alt="Login" /></div>
                </div>
            </div>
        `
    }
}
customElements.define('navbar-component', NavbarTop)