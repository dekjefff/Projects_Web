import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './SearchPage.css';

// Import เฉพาะไฟล์เพื่อให้ Custom Element ลงทะเบียนตัวเอง
import '../../components/Nav-Logo.js'; 
import '../../components/footer-Login.js';;

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // State for Inputs
    const [searchText, setSearchText] = useState(searchParams.get('q') || '');
    const [sex, setSex] = useState(searchParams.get('sex') || 'ALL');
    const [size, setSize] = useState(searchParams.get('size') || 'ALL');
    const [season, setSeason] = useState(searchParams.get('season') || 'ALL');

    // State for Data
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch Data when URL parameters change
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Construct Query String
                const query = new URLSearchParams({
                    q: searchParams.get('q') || '',
                    sex: searchParams.get('sex') || 'ALL',
                    size: searchParams.get('size') || 'ALL',
                    season: searchParams.get('season') || 'ALL'
                }).toString();

                const res = await fetch(`http://localhost:3030/api/products/search?${query}`);
                const json = await res.json();
                if (!json.error) {
                    setProducts(json.data);
                }
            } catch (err) {
                console.error("Error fetching search results:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams]);

    // Handle "Search" Button Click
    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchText) params.set('q', searchText);
        if (sex !== 'ALL') params.set('sex', sex);
        if (size !== 'ALL') params.set('size', size);
        if (season !== 'ALL') params.set('season', season);
        
        navigate(`/search?${params.toString()}`);
    };

    // Separate Hero Product (1st item) from Grid Products (Rest)
    const heroProduct = products.length > 0 ? products[0] : null;
    const gridProducts = products.length > 1 ? products.slice(1) : [];

    return (
        <div className="search-page-container">
            {/* --- NavBar --- */}
            <navlogo-component></navlogo-component> 
            {/* Or utilize your specific Navbar component logic */}

            {/* --- SEARCH BAR SECTION (Screenshot 1 Style) --- */}
            <div className="search-bar-wrapper">
                <div className="search-input-group">
                    <span className="search-icon-large">🔍</span>
                    <input 
                        type="text" 
                        className="main-search-input"
                        placeholder="I'm Looking For... Search by Brand, Name"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                <div className="filters-group">
                    <div className="filter-item">
                        <label>Sex:</label>
                        <select value={sex} onChange={(e) => setSex(e.target.value)}>
                            <option value="ALL">ALL</option>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Unisex">Unisex</option>
                        </select>
                    </div>

                    <div className="filter-item">
                        <label>Size:</label>
                        <select value={size} onChange={(e) => setSize(e.target.value)}>
                            <option value="ALL">ALL</option>
                            <option value="50">50ml</option>
                            <option value="100">100ml</option>
                        </select>
                    </div>

                    <div className="filter-item">
                        <label>Season:</label>
                        <select value={season} onChange={(e) => setSeason(e.target.value)}>
                            <option value="ALL">ALL</option>
                            <option value="Summer">Summer</option>
                            <option value="Winter">Winter</option>
                        </select>
                    </div>

                    <button className="search-action-btn" onClick={handleSearch}>
                        Search
                    </button>
                </div>
            </div>

            {/* --- RESULT SECTION (Screenshot 2 Style) --- */}
            <div className="results-container">
                {loading && <p className="loading-text">Searching...</p>}
                
                {!loading && products.length === 0 && (
                    <div className="no-results">No perfumes found matching your criteria.</div>
                )}

                {!loading && heroProduct && (
                    <>
                        {/* HERO IMAGE (Large First Result) */}
                        <div className="hero-result">
                            <div 
                                className="hero-image-box" 
                                onClick={() => navigate(`/detail?product_id=${heroProduct.product_ID}`)}
                            >
                                {/* Use placeholder if image_url is missing */}
                                <img 
                                    src={heroProduct.image_url || '/src/assets/banner1.png'} 
                                    alt={heroProduct.product_name} 
                                />
                                <div className="hero-text-overlay">
                                    <h2>{heroProduct.product_name}</h2>
                                    <h3>{heroProduct.brand_name}</h3>
                                </div>
                            </div>
                        </div>

                        {/* GRID IMAGES (The rest) */}
                        <div className="results-header">
                            <span>All Product: ⌄</span>
                        </div>

                        <div className="product-grid">
                            {gridProducts.map((product) => (
                                <div key={product.product_ID} className="grid-card">
                                    <div 
                                        className="grid-image-wrapper"
                                        onClick={() => navigate(`/detail?product_id=${product.product_ID}`)}
                                    >
                                        <img 
                                            src={product.image_url || '/src/server/photo/creed2.jpg'} 
                                            alt={product.product_name} 
                                        />
                                    </div>
                                    <div className="grid-info">
                                        <p className="grid-brand">{product.brand_name || "Brand"}</p>
                                        <p className="grid-name">{product.product_name}</p>
                                        <p className="grid-price">
                                            {Number(product.price).toLocaleString()} THB
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <footer-login-component></footer-login-component>
        </div>
    );
};

export default SearchPage;