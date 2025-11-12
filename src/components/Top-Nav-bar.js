class NavbarTop extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="navbar-left">
                <a href="#" class="nav-item home-button">HOME</a>
                <a href="#" class="nav-item">COLLECTIONS</a>
            </div>

            <div class="navbar-logo">
                <div>
                    <img src="src/assets/Logo.png" alt="Logo" /> 
                </div>
            </div>

            <div class="navbar-right">
                <a href="#" class="nav-item">Men</a>
                <a href="#" class="nav-item">Women</a>
                <div class="nav-icons">
                    <span class="icon search-icon">🔍</span>
                    <span class="icon bag-icon">🛍️</span>
                    <div class="icon login-icon">
                        <span class="user-icon">👤</span>
                        <span class="login-text">Login</span>
                    </div>
                </div>
            </div>
        `
    }
}
customElements.define('navbar-component', NavbarTop)