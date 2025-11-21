import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./addProduct.css";

export default function AddProduct() {
    const navigate = useNavigate();
    const BASE_URL = "http://localhost:3030";

    const [form, setForm] = useState({
        name: "",
        code: "",
        type: "product",
        status: "active",
        description: "",
        category: "General",
        tags: "",
        price: "",
        unit: "",
        tax: "none",
        discount: "",
        show: "true",
        stock_qty: "0",
        reorder_point: "0",
        sku: "",
        barcode: "",
        images: []
    });

    const updateForm = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const autoCode = (prefix) => `${prefix}${Math.floor(Math.random() * 900 + 100)}`;

    const saveToAPI = async () => {
        const productPayload = {
            product_ID: form.code.trim()
                ? form.code
                : autoCode(form.type === "product" ? "P" : "S"),
            product_name: form.name,
            _description: form.description,
            price: form.price || 0,
            image_url: "placeholder.jpg",
            stock_quantity: form.type === "product" ? Number(form.stock_qty) : 0,
            size: form.category,
            scent_description: "",
            brand_ID: null,
            supplier_ID: null
        };

        await fetch(`${BASE_URL}/api/SearchProduct`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product: productPayload })
        });

        return productPayload.product_ID;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await saveToAPI();
        alert("เพิ่มสินค้าแล้ว!");
        navigate("/ProductList");

    };

    const saveAndAddAnother = async () => {
        await saveToAPI();
        alert("บันทึกแล้ว พร้อมเพิ่มรายการถัดไป");

        setForm({
            name: "",
            code: "",
            type: "product",
            status: "active",
            description: "",
            category: "General",
            tags: "",
            price: "",
            unit: "",
            tax: "none",
            discount: "",
            show: "true",
            stock_qty: "0",
            reorder_point: "0",
            sku: "",
            barcode: "",
            images: []
        });
    };

    return (
        <div className="add_container">
            <div className="add_app">

                {/* HEADER */}
                <header className="add_header">
                    <div>
                        <h1>Product / Service Management</h1>
                        <div className="add_tag">Admin • CRUD</div>
                    </div>

                    <nav className="add_tabs">
                        <button className="add_tab_btn" onClick={() => navigate("/ProductList")}>
                            รายการ
                        </button>
                        <button className="add_tab_btn" aria-selected="true">
                            เพิ่มใหม่
                        </button>
                        <button className="add_tab_btn" disabled>แก้ไข</button>
                    </nav>
                </header>

                {/* MAIN */}
                <main>
                    <form className="add_grid add_cols_2" onSubmit={handleSubmit}>

                        {/* CARD 1 */}
                        <div className="add_card">
                            <h3>ข้อมูลหลัก</h3>

                            <div className="add_grid add_cols_2">
                                <label>
                                    ชื่อ *
                                    <input
                                        className="add_input"
                                        required
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => updateForm("name", e.target.value)}
                                    />
                                </label>

                                <label>
                                    รหัส (Code)
                                    <input
                                        className="add_input"
                                        type="text"
                                        placeholder="ถ้าเว้นว่างจะสร้างอัตโนมัติ"
                                        value={form.code}
                                        onChange={(e) => updateForm("code", e.target.value)}
                                    />
                                </label>
                            </div>

                            <div className="add_grid add_cols_2">
                                <label>
                                    ประเภท *
                                    <select
                                        className="add_select"
                                        value={form.type}
                                        onChange={(e) => updateForm("type", e.target.value)}
                                    >
                                        <option value="product">Product</option>
                                        <option value="service">Service</option>
                                    </select>
                                </label>

                                <label>
                                    สถานะ
                                    <select
                                        className="add_select"
                                        value={form.status}
                                        onChange={(e) => updateForm("status", e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </label>
                            </div>

                            <label>
                                รายละเอียด
                                <textarea
                                    className="add_textarea"
                                    value={form.description}
                                    onChange={(e) => updateForm("description", e.target.value)}
                                ></textarea>
                            </label>
                        </div>

                        {/* CARD 2 */}
                        <div className="add_card">
                            <h3>การจัดหมวดหมู่</h3>

                            <div className="add_grid add_cols_2">
                                <label>
                                    หมวดหมู่
                                    <select
                                        className="add_select"
                                        value={form.category}
                                        onChange={(e) => updateForm("category", e.target.value)}
                                    >
                                        <option value="General">General</option>
                                        <option value="Computer">Computer</option>
                                        <option value="Accessory">Accessory</option>
                                        <option value="Service">Service</option>
                                    </select>
                                </label>

                                <label>
                                    แท็ก
                                    <input
                                        className="add_input"
                                        type="text"
                                        value={form.tags}
                                        placeholder="new, hot"
                                        onChange={(e) => updateForm("tags", e.target.value)}
                                    />
                                </label>
                            </div>

                            <div className="add_grid add_cols_3">
                                <label>
                                    ราคา
                                    <input
                                        className="add_input"
                                        type="number"
                                        value={form.price}
                                        onChange={(e) => updateForm("price", e.target.value)}
                                    />
                                </label>

                                <label>
                                    หน่วย
                                    <input
                                        className="add_input"
                                        type="text"
                                        value={form.unit}
                                        onChange={(e) => updateForm("unit", e.target.value)}
                                    />
                                </label>

                                <label>
                                    ภาษี
                                    <select
                                        className="add_select"
                                        value={form.tax}
                                        onChange={(e) => updateForm("tax", e.target.value)}
                                    >
                                        <option value="none">None</option>
                                        <option value="7%">7%</option>
                                    </select>
                                </label>
                            </div>

                            <div className="add_grid add_cols_3">
                                <label>
                                    ส่วนลด
                                    <input
                                        className="add_input"
                                        type="number"
                                        value={form.discount}
                                        onChange={(e) => updateForm("discount", e.target.value)}
                                    />
                                </label>

                                <label>
                                    แสดงบนหน้าร้าน
                                    <select
                                        className="add_select"
                                        value={form.show}
                                        onChange={(e) => updateForm("show", e.target.value)}
                                    >
                                        <option value="true">Show</option>
                                        <option value="false">Hide</option>
                                    </select>
                                </label>
                            </div>
                        </div>

                        {/* CARD 3 — STOCK */}
                        {form.type === "product" && (
                            <div className="add_card">
                                <h3>สต็อก (เฉพาะสินค้า)</h3>

                                <div className="add_grid add_cols_3">
                                    <label>
                                        จำนวนคงเหลือ
                                        <input
                                            className="add_input"
                                            type="number"
                                            value={form.stock_qty}
                                            onChange={(e) => updateForm("stock_qty", e.target.value)}
                                        />
                                    </label>

                                    <label>
                                        จุดสั่งซื้อ
                                        <input
                                            className="add_input"
                                            type="number"
                                            value={form.reorder_point}
                                            onChange={(e) =>
                                                updateForm("reorder_point", e.target.value)
                                            }
                                        />
                                    </label>

                                    <label>
                                        SKU
                                        <input
                                            className="add_input"
                                            type="text"
                                            value={form.sku}
                                            onChange={(e) => updateForm("sku", e.target.value)}
                                        />
                                    </label>
                                </div>

                                <label>
                                    Barcode
                                    <input
                                        className="add_input"
                                        type="text"
                                        value={form.barcode}
                                        onChange={(e) => updateForm("barcode", e.target.value)}
                                    />
                                </label>
                            </div>
                        )}

                        {/* CARD 4 — IMAGES */}
                        <div className="add_card">
                            <h3>รูปภาพ</h3>
                            <input className="add_input" type="file" multiple accept="image/*" />
                            <div className="add_helper">ต้นแบบ: ไม่ถูกอัปโหลดจริง</div>
                        </div>

                        {/* BUTTON GROUP */}
                        <div className="add_pagebutton">
                            <button className="add_btn add_btn_primary">Save</button>

                            <button
                                type="button"
                                className="add_btn"
                                onClick={saveAndAddAnother}
                            >
                                Save & Add Another
                            </button>

                            <button
                                type="button"
                                className="add_btn add_btn_ghost"
                                onClick={() => navigate("/ProductList")}
                            >
                                Cancel
                            </button>
                        </div>

                    </form>
                </main>
            </div>
        </div>
    );
}
