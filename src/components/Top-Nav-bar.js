import './Top-nav-bar.css'; // *** ต้องอยู่บนสุดเท่านั้น ***

class NavbarTop extends HTMLElement {
    constructor() {
        super();
        this.isOpen = false;
        this.searchDropdown = null;
        this.searchIcon = null;
        this.searchInput = null;

        // ผูกฟังก์ชันเข้ากับ instance ตั้งแต่แรกเพื่อป้องกันปัญหา 'this'
        this.handleToggleSearch = this.handleToggleSearch.bind(this);
        this.closeSearch = this.closeSearch.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleKeyboardShortcut = this.handleKeyboardShortcut.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        // เพิ่มการผูกฟังก์ชันใหม่
        this.getLoginState = this.getLoginState.bind(this);
    }

    // **********************************
    // ******* ฟังก์ชันตรวจสอบสถานะ Login *******
    // **********************************
    /**
     * @returns {boolean} ตรวจสอบสถานะการล็อกอิน (ตัวอย่าง: ใช้ localStorage หรือ Global Variable)
     */
    getLoginState() {
        // 🚨 ปรับเปลี่ยนตรรกะนี้ให้ตรงกับวิธีการจัดการสถานะการล็อกอินของแอปพลิเคชันจริงของคุณ
        // ตัวอย่างที่ 1: ตรวจสอบจาก localStorage
        const token = localStorage.getItem('authToken');
        return !!token; // คืนค่า true หากมี authToken

        // ตัวอย่างที่ 2: ตรวจสอบจากตัวแปร Global (ถ้าแอปพลิเคชันมีการตั้งค่าไว้)
        // return window.myApp.isLoggedIn === true;
    }


    connectedCallback() {
        // ตรวจสอบสถานะการล็อกอิน
        const isUserLoggedIn = this.getLoginState();
        
        // กำหนด URL และข้อความแสดงผลตามสถานะ
        const loginHref = isUserLoggedIn ? "/profile" : "/login";
        // หากต้องการเปลี่ยนข้อความจาก 'Login' เป็น 'Profile' เมื่อล็อกอินแล้ว:
        // const loginText = isUserLoggedIn ? "Profile" : "Login"; 
        
        // **ส่วนที่แก้ไข: อัปเดต HTML Template**
        this.innerHTML = `
            <div class="navbar-content">
                <div class="navbar-left">
                    <a href="/" class="nav-item home-button">HOME</a>
                    <a href="#" class="nav-item">COLLECTIONS</a>
                </div>

                <div class="navbar-logo">
                    <div><img src="src/assets/Logo.png" alt="Logo" /></div>
                </div>

                <div class="navbar-right">
                    <a href="#" class="nav-item">Men</a>
                    <a href="#" class="nav-item">Women</a>
                    <div class="nav-icons">
                        <div class="search-icon-trigger"> <img src="src/assets/icon.png" alt="search" /></div>
                        <a href="/cartpage" class="bag-icon"><img src="src/assets/Bag_alt.png" alt="bag" /></a>
                        
                                                <a href="${loginHref}" class="login-icon"><img src="src/assets/Login.png" alt="${isUserLoggedIn ? 'Profile' : 'Login'}" /></a>
                    </div>
                </div>
            </div>
            
                        <div class="search-dropdown-overlay">
                <div class="search-content"> 
                    <button class="close-btn">&times;</button>
                    <div class="search-input-group">
                        <span class="magnifying-glass-icon"> <img src="src/assets/icon.png" alt="search" /></span>
                        <input type="text" placeholder="I'm Looking For... Search by Brand, Name" class="search-input"/>
                        <button class="search-button">Search</button>
                    </div>
                    <div class="filter-group">
                        <label>Sex:</label>
                        <select id="filter-sex"><option value="ALL">ALL</option></select>
                        <label>Size:</label>
                        <select id="filter-size"><option value="ALL">ALL</option></select>
                        <label>Season:</label>
                        <select id="filter-season"><option value="ALL">ALL</option></select>
                    </div>
                </div>
            </div>
        `;
        
        // 1. หา Element ที่เกี่ยวข้อง (ส่วนนี้คงเดิม)
        this.searchDropdown = this.querySelector('.search-dropdown-overlay');
        this.searchIcon = this.querySelector('.search-icon-trigger');
        const closeBtn = this.querySelector('.close-btn');
        this.searchInput = this.querySelector('.search-input');
        const searchButton = this.querySelector('.search-button');

        // หา Select filters โดยใช้ ID ใหม่ (แนะนำ) หรือ nth-of-type
        const sexFilter = this.querySelector('#filter-sex');
        const sizeFilter = this.querySelector('#filter-size');
        const seasonFilter = this.querySelector('#filter-season');

        // 2. ผูก Event Listener (ส่วนนี้คงเดิม)
        this.searchIcon.addEventListener('click', this.handleToggleSearch);
        closeBtn.addEventListener('click', this.closeSearch);
        document.addEventListener('mousedown', this.handleClickOutside);
        document.addEventListener('keydown', this.handleKeyboardShortcut);

        // ผูกปุ่มค้นหาเข้ากับฟังก์ชัน handleSearch
        searchButton.addEventListener('click', () => {
            this.handleSearch(
                sexFilter.value,
                sizeFilter.value,
                seasonFilter.value
            );
        });
    }
    
    // ส่วนที่เหลือของ Class (disconnectedCallback, handleKeyboardShortcut, handleToggleSearch, closeSearch, handleClickOutside, handleSearch) **คงเดิม**

    /**
     * ทำความสะอาด Event Listener เมื่อ Component ถูกถอดออก (ป้องกัน Memory Leak)
     */
    disconnectedCallback() {
        if (this.searchIcon) {
            this.searchIcon.removeEventListener('click', this.handleToggleSearch);
        }
        document.removeEventListener('mousedown', this.handleClickOutside);
        document.removeEventListener('keydown', this.handleKeyboardShortcut);
    }

    // **********************************
    // ******* ฟังก์ชันจัดการคีย์บอร์ด *******
    // **********************************
    handleKeyboardShortcut(event) {
        // คีย์ลัด: Alt + S
        if (event.altKey && (event.key === 's' || event.key === 'S')) {
            event.preventDefault();
            this.handleToggleSearch();
            return;
        }

        // คีย์ลัด: ESCAPE สำหรับปิด
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

    /**
     * ฟังก์ชันจัดการการค้นหา: สร้าง URL และนำทางไปยังหน้า Result
     */
    handleSearch(sex, size, season) {
        const query = this.searchInput.value.trim();
        const params = new URLSearchParams();

        if (query) {
            params.append('q', query);
        }
        if (sex && sex !== 'ALL') {
            params.append('sex', sex);
        }
        if (size && size !== 'ALL') {
            params.append('size', size);
        }
        if (season && season !== 'ALL') {
            params.append('season', season);
        }

        // *** สร้างเส้นทางปลายทางที่ต้องการ ***
        const path = `/resultDetailsearch?${params.toString()}`;

        // 🚨 การแก้ไข: สร้าง Custom Event แทน window.location.href
        const navigateEvent = new CustomEvent('customNavigate', {
            bubbles: true,
            composed: true,
            detail: { path: path }
        });

        // สั่งให้ Custom Element กระจาย Event นี้ออกไป
        this.dispatchEvent(navigateEvent);

        this.closeSearch();
    }
}

customElements.define('navbar-component', NavbarTop);
