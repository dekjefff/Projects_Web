class NavLogo extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="navbar-logo">
                <div>
                    <img src="src/assets/Logo.png" alt="Logo" /> 
                </div>
            </div>
        `
    }
}
customElements.define('navlogo-component', NavLogo)