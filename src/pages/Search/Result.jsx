// SearchResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './result.css';

// URL API ที่ดึงสินค้าทั้งหมด (ตาม productRouter.js)
const API_URL = 'http://localhost:3030/api/SearchProduct'; 

const SearchResultsPage = () => {
    const location = useLocation();
    const [allProducts, setAllProducts] = useState([]); // เก็บสินค้าทั้งหมดที่ดึงมา
    const [filteredResults, setFilteredResults] = useState([]); // เก็บสินค้าที่กรองแล้ว
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('search') || '';
    const sexFilter = queryParams.get('sex') || 'ALL';
    const sizeFilter = queryParams.get('size') || 'ALL';
    const seasonFilter = queryParams.get('season') || 'ALL';

    // *** Logic: Client-Side Filtering (เหมือนเดิม) ***
    const clientSideFilter = (products) => {
        const query = searchTerm.toLowerCase();
        
        return products.filter(product => {
            const matchesSearch = !query || 
                (product.product_name && product.product_name.toLowerCase().includes(query)) ||
                (product.scent_description && product.scent_description.toLowerCase().includes(query));

            // สมมติว่าคอลัมน์ category_sex, size, category_season มีอยู่ในตาราง product
            const matchesSex = sexFilter === 'ALL' || (product.category_sex && product.category_sex.toLowerCase() === sexFilter.toLowerCase());
            const matchesSize = sizeFilter === 'ALL' || (product.size && product.size.toLowerCase() === sizeFilter.toLowerCase());
            const matchesSeason = seasonFilter === 'ALL' || (product.category_season && product.category_season.toLowerCase() === seasonFilter.toLowerCase());

            return matchesSearch && matchesSex && matchesSize && matchesSeason;
        });
    };

    // 1. ดึงข้อมูลทั้งหมดจาก API (รันครั้งเดียว)
    useEffect(() => {
        const fetchAllProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(API_URL);
                if (!response.data.error) {
                    setAllProducts(response.data.data);
                }
            } catch (err) {
                setError('ไม่สามารถดึงข้อมูลสินค้าทั้งหมดได้');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllProducts();
    }, []); 

    // 2. กรองข้อมูลเมื่อ allProducts หรือ Query Parameter เปลี่ยน
    useEffect(() => {
        const results = clientSideFilter(allProducts);
        setFilteredResults(results);
    }, [allProducts, location.search]); 
    
    // แสดงสรุปผลการค้นหา
    const searchSummary = [sexFilter, sizeFilter, seasonFilter].filter(f => f !== 'ALL').length > 0
        ? ` (Filtered by: ${[sexFilter, sizeFilter, seasonFilter].filter(f => f !== 'ALL').join(', ')})`
        : searchTerm ? ` (Search Term: ${searchTerm})` : '';
    return (
        <div className="search-results-page">
            
            {/* ส่วน Hero Image และ Banner (ปรับตามดีไซน์ Result.jpg) */}
            <div className="result-hero-image">
                {/* อาจจะใช้ Image ของสินค้าตัวแรก หรือภาพรวม */}
                {/*  */}
            </div>
            <div className="product-listing-header">
                {/* All Product: ส่วนหัวของ Grid Listing */}
                <h2 className="listing-title">All Product <span className="search-summary-text">{searchSummary}</span></h2>
                <div className="sort-dropdown">
                    {/* Placeholder for Sorting Dropdown */}
                    <select className="sort-select">
                        <option>Recommended</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                    </select>
                </div>
            </div>
            <hr className="divider-line" />
            {/* --- แสดงผลลัพธ์ --- */}
            {isLoading && <div className="loading-state">กำลังดึงข้อมูล...</div>}
            {error && <div className="error-state">{error}</div>}
            {!isLoading && !error && filteredResults.length === 0 && (
                <div className="no-results">
                    ไม่พบสินค้าที่ตรงตามเงื่อนไข
                </div>
            )}
            {!isLoading && !error && filteredResults.length > 0 && (
                <div className="product-grid">
                    {filteredResults.map((product) => (
                        <div key={product.product_ID} className="product-card-result">
                            <div className="card-image-wrapper">
                                <img 
                                    src={product.image_url || '/placeholder.jpg'} 
                                    alt={product.product_name} 
                                    className="product-image-result"
                                />
                            </div>
                            <div className="product-info-result">
                                <p className="product-brand">{product.brand_name || 'LOUIS VUITTON'}</p>
                                
                                {/* product_name เป็นตัวหนาและใหญ่กว่า */}
                                <h3 className="product-name-result">{product.product_name}</h3> 
                                
                                <p className="product-price-result">
                                    {product.price ? product.price.toLocaleString() : 'N/A'} THB
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* ส่วน Banner คั่นกลาง (ตามภาพ Result.jpg) */}
            <div className="middle-banner">
                {/*  */}
            </div>
            {/* หากมีผลลัพธ์ชุดที่สองต่อ ก็สามารถใช้ product-grid ซ้ำได้ */}
        </div>
    );
};

export default SearchResultsPage;