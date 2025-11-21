import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./resultDetailsearch.css";

export default function ResultDetailSearch() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    const [results, setResults] = useState([]);

    // mock data (เหมือนหน้าที่คุณโชว์)
    const allProducts = [
        { id: 1, name: "Imagination", brand: "LOUIS VUITTON", price: "12,500.00", sex: "MEN", size: "M", season: "SUMMER", img: "/perfume/1.png" },
        { id: 2, name: "L’Immensité", brand: "LOUIS VUITTON", price: "12,500.00", sex: "MEN", size: "L", season: "SUMMER", img: "/perfume/2.png" },
        { id: 3, name: "Pacific Chill", brand: "LOUIS VUITTON", price: "12,500.00", sex: "MEN", size: "L", season: "WINTER", img: "/perfume/3.png" },
        { id: 4, name: "California Dream", brand: "LOUIS VUITTON", price: "12,500.00", sex: "WOMEN", size: "S", season: "SUMMER", img: "/perfume/4.png" },

        { id: 5, name: "Symphony", brand: "LOUIS VUITTON", price: "20,900.00", sex: "WOMEN", size: "M", season: "WINTER", img: "/perfume/5.png" },
        { id: 6, name: "Stellar Times", brand: "LOUIS VUITTON", price: "20,900.00", sex: "WOMEN", size: "S", season: "WINTER", img: "/perfume/6.png" },
        { id: 7, name: "Myriad", brand: "LOUIS VUITTON", price: "23,500.00", sex: "WOMEN", size: "M", season: "SUMMER", img: "/perfume/7.png" },
        { id: 8, name: "Dancing Blossom", brand: "LOUIS VUITTON", price: "20,900.00", sex: "WOMEN", size: "L", season: "SUMMER", img: "/perfume/8.png" },
    ];

    useEffect(() => {
        const q = params.get("q");
        const sex = params.get("sex");
        const size = params.get("size");
        const season = params.get("season");
        const all = params.get("all");

        // เอาค่าส่งมาจาก Navbar มา filter mock data
        let filtered = allProducts;

        if (all === "true") {
            setResults(filtered);
            return;
        }

        if (q) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(q.toLowerCase()) ||
                p.brand.toLowerCase().includes(q.toLowerCase())
            );
        }
        if (sex) filtered = filtered.filter(p => p.sex === sex);
        if (size) filtered = filtered.filter(p => p.size === size);
        if (season) filtered = filtered.filter(p => p.season === season);

        setResults(filtered);

    }, [location.search]);

    return (
        <div className="result-page">

            {/* Title */}
            <div className="result-header">
                <h2>All Product:</h2>
            </div>

            {/* Product Grid */}
            <div className="product-grid">
                {results.length === 0 ? (
                    <p className="no-result">No product found.</p>
                ) : (
                    results.map(product => (
                        <div key={product.id} className="product-card"
                            onClick={() => navigate(`/productDetail?id=${product.id}`)}
                        >
                            <img src={product.img} alt={product.name} className="product-img" />

                            <div className="product-info">
                                <p className="brand">{product.brand}</p>
                                <p className="name">{product.name}</p>
                                <p className="price">{product.price} THB</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}
