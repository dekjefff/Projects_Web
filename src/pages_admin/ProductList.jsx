import React, { useEffect, useState } from "react";
import "./listProduct.css";
import { useNavigate } from "react-router-dom";

export default function ProductList() {
    const navigate = useNavigate();
    const BASE_URL = "http://localhost:3030";

    const [items, setItems] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");

    const [deleteItem, setDeleteItem] = useState(null);
    const [deleteMode, setDeleteMode] = useState("archive");
    const [confirmDeleteText, setConfirmDeleteText] = useState("");

    const loadItemsAPI = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/SearchProduct`);
            const data = await res.json();

            // รองรับทั้งแบบ array และ object ตาม backend
            const list = Array.isArray(data)
                ? data
                : data.data || data.result || data.products || [];

            const mapped = list.map((p) => ({
                id: p.product_ID,
                code: p.product_ID,
                name: p.product_name,
                thumbnail: p.image_url,
                type: "product",
                category: p.size,
                price: p.price,
                status: "active",
                updatedAt: new Date().toISOString(),
            }));

            setItems(mapped);
            setFiltered(mapped);

        } catch (err) {
            console.error("Load API Error:", err);
        }
    };

    useEffect(() => {
        loadItemsAPI();
    }, []);

    useEffect(() => {
        let f = items;

        if (search !== "") {
            f = f.filter(
                (it) =>
                    it.name.toLowerCase().includes(search.toLowerCase()) ||
                    it.code.toString().includes(search)
            );
        }

        if (type !== "") f = f.filter((it) => it.type === type);
        if (status !== "") f = f.filter((it) => it.status === status);

        setFiltered(f);
    }, [search, type, status, items]);

    const goEdit = (id) => {
        navigate("/edit-product?id=" + id);
    };

    return (
        <div className="prod_shell">
            <div className="prod_app">

                {/* Header */}
                <header className="prod_header">
                    <div>
                        <h1 className="prod_title">Product / Service Management</h1>
                        <div className="prod_tag">Admin • CRUD (Create / Read / Update / Delete)</div>
                    </div>

                    <nav className="prod_tabs">
                        <button
                            className="prod_tab_btn" aria-selected="true"
                            onClick={() => {
                                if (window.location.pathname !== "/ProductList") {
                                    navigate("/ProductList");
                                }
                            }}
                        >
                            รายการ
                        </button>
                        <button className="prod_tab_btn" onClick={() => navigate("/AddProduct")}>เพิ่มใหม่</button>
                        <button className="prod_tab_btn" disabled>แก้ไข</button>
                    </nav>
                </header>

                {/* Main */}
                <main className="prod_main">

                    {/* Toolbar row */}
                    <div className="prod_toolbar">

                        {/* Add New (ซ้าย) */}
                        <button
                            className="prod_btn prod_btn_primary"
                            onClick={() => navigate("/AddProduct")}
                        >
                            + Add New
                        </button>

                        {/* ดันช่องค้นหาไปขวา */}
                        <div className="prod_spacer"></div>

                        {/* Search (ขวา) */}
                        <input
                            className="prod_input prod_search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="ค้นหาด้วยชื่อ/รหัส"
                        />
                    </div>

                    {/* Dropdown Filters */}
                    <select
                        className="prod_select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={{ marginBottom: "10px" }}
                    >
                        <option value="">Type: All</option>
                        <option value="product">Product</option>
                        <option value="service">Service</option>
                    </select>

                    <select
                        className="prod_select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{ marginBottom: "20px" }}
                    >
                        <option value="">Status: All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="archived">Archived</option>
                    </select>

                    {/* TABLE */}
                    <div className="prod_card">
                        <table className="prod_table">

                            <thead>
                                <tr>
                                    <th>THUMBNAIL</th>
                                    <th>CODE</th>
                                    <th>NAME</th>
                                    <th>TYPE</th>
                                    <th>CATEGORY</th>
                                    <th>PRICE</th>
                                    <th>STATUS</th>
                                    <th>UPDATED</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filtered.map((it) => (
                                    <tr key={it.id}>
                                        <td>
                                            <img className="prod_thumb" src={it.thumbnail} alt="" />
                                        </td>

                                        <td>{it.code}</td>
                                        <td>{it.name}</td>
                                        <td>{it.type}</td>
                                        <td>{it.category}</td>
                                        <td>{it.price}</td>

                                        <td>
                                            <span className={`prod_status ${it.status}`}>
                                                {it.status}
                                            </span>
                                        </td>

                                        <td>{it.updatedAt}</td>

                                        <td>
                                            <div className="prod_row_action">
                                                <button className="prod_btn" onClick={() => goEdit(it.id)}>
                                                    Edit
                                                </button>
                                                <button
                                                    className="prod_btn prod_btn_danger"
                                                    onClick={() => setDeleteItem(it)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </main>

                {/* Modal */}
                {deleteItem && (
                    <div className="prod_modal_backdrop show">
                        <div className="prod_modal">
                            <header>
                                <h3>ลบหรือเก็บถาวร?</h3>
                            </header>

                            <p>ต้องการจัดการรายการ <strong>{deleteItem.name}</strong> ?</p>

                            <div className="prod_card" style={{ margin: "10px 0" }}>
                                <label>
                                    <input
                                        type="radio"
                                        value="archive"
                                        checked={deleteMode === "archive"}
                                        onChange={() => setDeleteMode("archive")}
                                    /> เก็บถาวร (Archive)
                                </label>

                                <br />

                                <label>
                                    <input
                                        type="radio"
                                        value="delete"
                                        checked={deleteMode === "delete"}
                                        onChange={() => setDeleteMode("delete")}
                                    /> ลบถาวร (Delete Permanently)
                                </label>

                                {deleteMode === "delete" && (
                                    <div style={{ marginTop: "10px" }}>
                                        <div>พิมพ์คำว่า <b>DELETE</b> เพื่อยืนยัน</div>
                                        <input
                                            className="prod_input"
                                            value={confirmDeleteText}
                                            onChange={(e) => setConfirmDeleteText(e.target.value)}
                                            placeholder="DELETE"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="prod_actions">
                                <button className="prod_btn" onClick={() => setDeleteItem(null)}>Cancel</button>
                                <button className="prod_btn prod_btn_danger">Confirm</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
