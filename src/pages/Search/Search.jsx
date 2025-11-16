// SearchOverlay.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ******************************************************
// สมมติว่ามี API Endpoints สำหรับดึงตัวเลือก:
// คุณอาจจะต้องสร้าง Route และ Controller ใน Node.js เพิ่มเติม
// ******************************************************
const API_OPTIONS = {
    SEX: 'http://localhost:3030/api/options/sex', 
    SIZE: 'http://localhost:3030/api/options/size', 
    SEASON: 'http://localhost:3030/api/options/season',
};

const SearchOverlay = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    // State สำหรับเก็บค่าที่ผู้ใช้เลือก
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSex, setSelectedSex] = useState('ALL');
    const [selectedSize, setSelectedSize] = useState('ALL');
    const [selectedSeason, setSelectedSeason] = useState('ALL');

    // State สำหรับเก็บตัวเลือกที่ดึงมาจาก API
    const [sexOptions, setSexOptions] = useState(['ALL']);
    const [sizeOptions, setSizeOptions] = useState(['ALL']);
    const [seasonOptions, setSeasonOptions] = useState(['ALL']);
    const [isOptionsLoading, setIsOptionsLoading] = useState(true);

    // ******************************************************
    // Hook สำหรับเรียก API เพื่อดึงตัวเลือก
    // ******************************************************
    useEffect(() => {
        const fetchOptions = async (url, setStateCallback) => {
            try {
                const response = await axios.get(url);
                // สมมติว่า response.data.data เป็น array ของ strings (เช่น ['Male', 'Female'])
                // เราเพิ่ม 'ALL' เข้าไปในตัวเลือกเสมอ
                setStateCallback(['ALL', ...response.data.data]);
            } catch (error) {
                console.error(`Error fetching options from ${url}:`, error);
                // หากดึงไม่ได้ ให้ใช้ค่าเริ่มต้นคือ ['ALL']
                setStateCallback(['ALL']); 
            }
        };

        const loadAllOptions = async () => {
            setIsOptionsLoading(true);
            await Promise.all([
                fetchOptions(API_OPTIONS.SEX, setSexOptions),
                fetchOptions(API_OPTIONS.SIZE, setSizeOptions),
                fetchOptions(API_OPTIONS.SEASON, setSeasonOptions),
            ]);
            setIsOptionsLoading(false);
        };

        loadAllOptions();
    }, []); // รันครั้งเดียวเมื่อคอมโพเนนต์โหลด

    if (!isOpen) {
        return null;
    }

    const handleSearch = () => {
        const queryParams = new URLSearchParams();
        if (searchTerm.trim()) {
            queryParams.append('search', searchTerm.trim());
        }
        queryParams.append('sex', selectedSex);
        queryParams.append('size', selectedSize);
        queryParams.append('season', selectedSeason);

        navigate(`/results?${queryParams.toString()}`);
        onClose();
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };
    
    // หากกำลังโหลดข้อมูล ให้แสดงสถานะโหลด
    if (isOptionsLoading) {
        return (
            <div className="search-overlay loading">
                <div className="search-box-content">
                    <div className="loading-message">กำลังโหลดตัวเลือกค้นหา...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="search-overlay">
            <div className="search-box-content">
                <div className="search-form-row">
                    {/* ช่อง Input หลัก: I'm Looking For... */}
                    <div className="main-input-group">
                        <span className="search-icon">
                            <i className="fas fa-search"></i>
                        </span>
                        <input
                            type="text"
                            placeholder="I'm Looking For...Search by Brand, Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="search-input-main"
                        />
                    </div>

                    {/* Dropdown Filters */}
                    <div className="filter-group">
                        <label>Sex:</label>
                        <select value={selectedSex} onChange={(e) => setSelectedSex(e.target.value)} className="search-select">
                            {sexOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>

                        <label>Size:</label>
                        <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="search-select">
                            {sizeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>

                        <label>Season:</label>
                        <select value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)} className="search-select">
                            {seasonOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>

                        <button onClick={handleSearch} className="search-button">
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;