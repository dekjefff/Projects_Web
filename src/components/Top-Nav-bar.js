import './Top-nav-bar.css'; // *** ต้องอยู่บนสุดเท่านั้น ***

class NavbarTop extends HTMLElement {
    constructor() {
        super();
        this.isOpen = false;
        this.searchDropdown = null;
        this.searchIcon = null;
        this.searchInput = null;

        this.handleToggleSearch = this.handleToggleSearch.bind(this);
        this.closeSearch = this.closeSearch.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleKeyboardShortcut = this.handleKeyboardShortcut.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.getLoginState = this.getLoginState.bind(this);
    }

    // ✅ แก้ให้รองรับ token หลายรูปแบบ
    getLoginState() {
        const token =
            localStorage.getItem("authToken") ||
            localStorage.getItem("token") ||
            localStorage.getItem("userToken") ||
            localStorage.getItem("accessToken");

        return !!token;
    }

    connectedCallback() {
        const isUserLoggedIn = this.getLoginState();
        const loginHref = isUserLoggedIn ? "/profile" : "/login";

        this.innerHTML = `
            <div class="navbar-content">
                <div class="navbar-left">
                    <a href="/" class="nav-item home-button">HOME</a>
                    <a href="#" class="nav-item">COLLECTIONS</a>
                    <a href="/Admin_Login" class="nav-item">Admin</a>
                </div>

                <div class="navbar-logo">
                    <a href="${loginHref}">
                        <img src="src/assets/Logo.png" alt="Logo" />
                    </a>
                </div>

                <div class="navbar-right">
                    <a href="#" class="nav-item">Men</a>
                    <a href="#" class="nav-item">Women</a>
                    <div class="nav-icons">
                        <div class="search-icon-trigger">
                            <img src="src/assets/icon.png" alt="search" />
                        </div>

                        <a href="/cartpage" class="bag-icon">
                            <img src="src/assets/Bag_alt.png" alt="bag" />
                        </a>

                        <a href="${loginHref}" class="login-icon">
                            <img src="src/assets/Login.png"
                                 alt="${isUserLoggedIn ? 'Profile' : 'Login'}" />
                        </a>
                    </div>
                </div>
            </div>

            <div class="search-dropdown-overlay">
                <div class="search-content">
                    <button class="close-btn">&times;</button>

                    <div class="search-input-group">
                        <span class="magnifying-glass-icon">
                            <img src="src/assets/icon.png" alt="search" />
                        </span>

                        <input type="text"
                               placeholder="I'm Looking For... Search by Brand, Name"
                               class="search-input"/>

                        <button class="search-button">Search</button>
                    </div>

                    <div class="filter-group">
                        <label>Sex:</label>
                        <select id="filter-sex">
                            <option value="ALL">ALL</option>
                            <option value="MEN">MEN</option>
                            <option value="WOMEN">WOMEN</option>
                        </select>

                        <label>Size:</label>
                        <select id="filter-size">
                            <option value="ALL">ALL</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                        </select>

                        <label>Season:</label>
                        <select id="filter-season">
                            <option value="ALL">ALL</option>
                            <option value="SUMMER">SUMMER</option>
                            <option value="WINTER">WINTER</option>
                        </select>
                    </div>

                    <div class="search-result-area">
                        <p class="result-title">Search Result:</p>
                        <div class="result-list"></div>
                    </div>
                </div>
            </div>
        `;

        this.searchDropdown = this.querySelector('.search-dropdown-overlay');
        this.searchIcon = this.querySelector('.search-icon-trigger');
        const closeBtn = this.querySelector('.close-btn');
        this.searchInput = this.querySelector('.search-input');
        const searchButton = this.querySelector('.search-button');

        const sexFilter = this.querySelector('#filter-sex');
        const sizeFilter = this.querySelector('#filter-size');
        const seasonFilter = this.querySelector('#filter-season');

        this.resultList = this.querySelector(".result-list");

        this.searchIcon.addEventListener('click', this.handleToggleSearch);
        closeBtn.addEventListener('click', this.closeSearch);
        document.addEventListener('mousedown', this.handleClickOutside);
        document.addEventListener('keydown', this.handleKeyboardShortcut);

        searchButton.addEventListener('click', () => {
            this.handleSearch(
                sexFilter.value,
                sizeFilter.value,
                seasonFilter.value
            );
        });
    }

    disconnectedCallback() {
        if (this.searchIcon) {
            this.searchIcon.removeEventListener('click', this.handleToggleSearch);
        }
        document.removeEventListener('mousedown', this.handleClickOutside);
        document.removeEventListener('keydown', this.handleKeyboardShortcut);
    }

    handleKeyboardShortcut(event) {
        if (event.altKey && (event.key === 's' || event.key === 'S')) {
            event.preventDefault();
            this.handleToggleSearch();
            return;
        }

        if (this.isOpen && event.key === 'Escape') {
            this.closeSearch();
            return;
        }
    }

    handleToggleSearch() {
        this.isOpen = !this.isOpen;
        this.searchDropdown.classList.toggle('active', this.isOpen);

        if (this.isOpen) {
            this.searchInput.focus();
        } else {
            this.searchInput.blur();
        }
    }

    closeSearch() {
        this.isOpen = false;
        this.searchDropdown.classList.remove('active');
        this.searchInput.blur();
    }

    handleClickOutside(event) {
        if (this.isOpen &&
            !this.searchDropdown.contains(event.target) &&
            !this.searchIcon.contains(event.target)) {
            this.closeSearch();
        }
    }

    // --------------------------------------------------------
    // 🔥 SEARCH LOGIC — นำไปหน้า resultDetailsearch
    // --------------------------------------------------------
    handleSearch(sex, size, season) {
        const query = this.searchInput.value.trim();

        const noKeyword = query === "";
        const noCriteria =
            sex === "ALL" &&
            size === "ALL" &&
            season === "ALL";

        const params = new URLSearchParams();

        // (1) No criteria search
        if (noKeyword && noCriteria) {
            params.append("all", "true");
        } else {
            if (!noKeyword) params.append("q", query);
            if (sex !== "ALL") params.append("sex", sex);
            if (size !== "ALL") params.append("size", size);
            if (season !== "ALL") params.append("season", season);
        }

        const path = `/resultDetailsearch?${params.toString()}`;

        const navigateEvent = new CustomEvent('customNavigate', {
            bubbles: true,
            composed: true,
            detail: { path: path }
        });

        this.dispatchEvent(navigateEvent);

        this.closeSearch();
    }

    renderResults(results) {
        this.resultList.innerHTML = "";

        results.forEach(item => {
            const div = document.createElement("div");
            div.className = "result-item";

            div.innerHTML = `
                <span>${item.name}</span>
                <a href="/productDetail?id=${item.id}" class="detail-link">View Detail</a>
            `;

            this.resultList.appendChild(div);
        });

        if (results.length === 0) {
            this.resultList.innerHTML = `<p>No results found.</p>`;
        }
    }
}

customElements.define('navbar-component', NavbarTop);
