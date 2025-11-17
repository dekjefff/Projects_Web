import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./editProduct.css";

export default function EditProduct() {
    const navigate = useNavigate();
    const BASE_URL = "http://localhost:3030";

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [deleteMode, setDeleteMode] = useState("archive");
    const [confirmDeleteText, setConfirmDeleteText] = useState("");

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    const loadItem = async () => {
        try {
            const res = await fetch(`${BASE_URL}/SearchProduct`);
            const data = await res.json();

            const found = data.data.find(
                (p) => String(p.product_ID) === String(productId)
            );

            if (!found) {
                setItem(null);
                setLoading(false);
                return;
            }

            setItem({
                id: found.product_ID,
                code: found.product_ID,
                name: found.product_name,
                type: "product",
                status: "active",
                description: found._description,
                category: found.size,
                tags: [],
                price: found.price,
                unit: "ชิ้น",
                tax: "none",
                discount: 0,
                show: true,
                stock_qty: found.stock_quantity,
                reorder_point: 0,
                sku: "",
                barcode: "",
                updatedAt: new Date().toISOString()
            });

            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItem();
    }, []);

    const updateField = (key, value) => {
        setItem((prev) => ({ ...prev, [key]: value }));
    };

    const submitForm = async (e) => {
        e.preventDefault();
        if (!item) return;

        const payload = {
            product: {
                product_ID: item.id,
                product_name: item.name,
                _description: item.description,
                price: item.price,
                image_url: item.thumbnail || "",
                stock_quantity: item.stock_qty,
                size: item.category,
                scent_description: "updated",
                brand_ID: null,
                supplier_ID: null
            }
        };

        await fetch(`${BASE_URL}/admin/UpdateProduct`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        alert("บันทึกสำเร็จ!");
        navigate("/products");
    };

    const confirmDelete = async () => {
        if (deleteMode === "delete" && confirmDeleteText !== "DELETE") {
            alert("พิมพ์ DELETE ให้ถูกต้องก่อน");
            return;
        }

        await fetch(`${BASE_URL}/admin/DeleteProduct/${item.id}`, {
            method: "DELETE"
        });

        alert("ลบเสร็จแล้ว");
        navigate("/products");
    };

    const duplicateItem = () => {
        alert("ระบบ Duplicate ยังไม่เชื่อม API แต่เพิ่มให้ได้");
    };

    if (loading) return <div style={{ padding: 30 }}>กำลังโหลด...</div>;

    if (!item)
        return (
            <div className="edit_shell">
                <div className="edit_card" style={{ marginTop: 20 }}>
                    <h3>ไม่พบข้อมูลสินค้านี้</h3>
                    <button className="edit_btn" onClick={() => navigate("/products")}>
                        กลับหน้ารายการ
                    </button>
                </div>
            </div>
        );

    return (
        <div className="edit_shell edit_app">

            {/* HEADER */}
            <header className="edit_header">
                <div>
                    <h1 className="edit_title">Product / Service Management</h1>
                    <div className="edit_tag">Admin • CRUD</div>
                </div>

                <nav className="edit_tabs">
                    <button className="edit_tab_btn" onClick={() => navigate("/products")}>
                        รายการ
                    </button>
                    <button className="edit_tab_btn" onClick={() => navigate("/add-product")}>
                        เพิ่มใหม่
                    </button>
                    <button className="edit_tab_btn" aria-selected="true">
                        แก้ไข
                    </button>
                </nav>
            </header>

            <main className="edit_main">
                <form className="edit_grid edit_cols_2" onSubmit={submitForm}>

                    {/* CARD 1 */}
                    <div className="edit_card">
                        <h3>
                            แก้ไขรายการ <span className="edit_pill">{item.code}</span>
                        </h3>

                        <div className="edit_grid edit_cols_2">
                            <label>
                                ชื่อ *
                                <input
                                    required
                                    value={item.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                />
                            </label>

                            <label>
                                รหัส (Code)
                                <input
                                    value={item.code}
                                    onChange={(e) => updateField("code", e.target.value)}
                                />
                            </label>
                        </div>

                        <div className="edit_grid edit_cols_2">
                            <label>
                                ประเภท *
                                <select
                                    value={item.type}
                                    onChange={(e) => updateField("type", e.target.value)}
                                >
                                    <option value="product">Product</option>
                                    <option value="service">Service</option>
                                </select>
                            </label>

                            <label>
                                สถานะ
                                <select
                                    value={item.status}
                                    onChange={(e) => updateField("status", e.target.value)}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </label>
                        </div>

                        <label>
                            รายละเอียด
                            <textarea
                                value={item.description}
                                onChange={(e) => updateField("description", e.target.value)}
                            ></textarea>
                        </label>
                    </div>

                    {/* CARD 2 */}
                    <div className="edit_card">
                        <h3>การจัดหมวดหมู่</h3>

                        <div className="edit_grid edit_cols_2">
                            <label>
                                หมวดหมู่
                                <select
                                    value={item.category}
                                    onChange={(e) => updateField("category", e.target.value)}
                                >
                                    <option>General</option>
                                    <option>Computer</option>
                                    <option>Accessory</option>
                                    <option>Service</option>
                                </select>
                            </label>

                            <label>
                                แท็ก
                                <input
                                    value={item.tags.join(", ")}
                                    onChange={(e) =>
                                        updateField("tags", e.target.value.split(","))
                                    }
                                />
                            </label>
                        </div>

                        <div className="edit_grid edit_cols_3">
                            <label>
                                ราคา
                                <input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => updateField("price", Number(e.target.value))}
                                />
                            </label>

                            <label>
                                หน่วย
                                <input
                                    value={item.unit}
                                    onChange={(e) => updateField("unit", e.target.value)}
                                />
                            </label>

                            <label>
                                ภาษี (VAT)
                                <select
                                    value={item.tax}
                                    onChange={(e) => updateField("tax", e.target.value)}
                                >
                                    <option value="none">None</option>
                                    <option value="7%">7%</option>
                                </select>
                            </label>
                        </div>

                        <div className="edit_grid edit_cols_3">
                            <label>
                                ส่วนลด
                                <input
                                    type="number"
                                    value={item.discount}
                                    onChange={(e) =>
                                        updateField("discount", Number(e.target.value))
                                    }
                                />
                            </label>

                            <label>
                                แสดงบนหน้าร้าน
                                <select
                                    value={item.show}
                                    onChange={(e) => updateField("show", e.target.value)}
                                >
                                    <option value={true}>Show</option>
                                    <option value={false}>Hide</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    {/* CARD 3 */}
                    {item.type === "product" && (
                        <div className="edit_card">
                            <h3>สต็อก (เฉพาะสินค้า)</h3>

                            <div className="edit_grid edit_cols_3">
                                <label>
                                    จำนวนคงเหลือ
                                    <input
                                        type="number"
                                        value={item.stock_qty}
                                        onChange={(e) =>
                                            updateField("stock_qty", Number(e.target.value))
                                        }
                                    />
                                </label>

                                <label>
                                    จุดสั่งซื้อ
                                    <input
                                        type="number"
                                        value={item.reorder_point}
                                        onChange={(e) =>
                                            updateField("reorder_point", Number(e.target.value))
                                        }
                                    />
                                </label>

                                <label>
                                    SKU
                                    <input
                                        value={item.sku}
                                        onChange={(e) => updateField("sku", e.target.value)}
                                    />
                                </label>
                            </div>

                            <label>
                                Barcode
                                <input
                                    value={item.barcode}
                                    onChange={(e) => updateField("barcode", e.target.value)}
                                />
                            </label>
                        </div>
                    )}

                    {/* CARD 4 */}
                    <div className="edit_card">
                        <h3>รูปภาพ</h3>
                        <input type="file" multiple />
                        <div className="edit_helper">ไฟล์ยังไม่ถูกอัปโหลดจริง</div>
                    </div>

                    {/* BUTTON GROUP */}
                    <div className="edit_pagebutton">
                        <button className="edit_btn edit_btn_primary">Save Changes</button>

                        <button
                            className="edit_btn edit_btn_ghost"
                            type="button"
                            onClick={() => navigate("/")}
                        >
                            Back
                        </button>

                        <button className="edit_btn" type="button" onClick={duplicateItem}>
                            Duplicate
                        </button>

                        <button
                            className="edit_btn edit_btn_danger"
                            type="button"
                            onClick={() => setShowModal(true)}
                        >
                            Delete
                        </button>
                    </div>
                </form>
            </main>

            {/* MODAL */}
            {showModal && (
                <div className="edit_modal_backdrop show">
                    <div className="edit_modal">
                        <header>
                            <h3>ลบหรือเก็บถาวร?</h3>
                        </header>

                        <p>
                            คุณต้องการจัดการรายการ{" "}
                            <strong>{item.name}</strong> หรือไม่
                        </p>

                        <div className="edit_card" style={{ margin: "10px 0" }}>
                            <label>
                                <input
                                    type="radio"
                                    checked={deleteMode === "archive"}
                                    onChange={() => setDeleteMode("archive")}
                                />
                                เก็บถาวร (Archive)
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    checked={deleteMode === "delete"}
                                    onChange={() => setDeleteMode("delete")}
                                />
                                ลบถาวร (Delete Permanently)
                            </label>

                            {deleteMode === "delete" && (
                                <div className="edit_grid edit_cols_2" style={{ marginTop: 10 }}>
                                    <div className="edit_helper">พิมพ์ DELETE เพื่อยืนยัน</div>
                                    <input
                                        value={confirmDeleteText}
                                        onChange={(e) => setConfirmDeleteText(e.target.value)}
                                        placeholder="DELETE"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="edit_actions">
                            <button className="edit_btn" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button className="edit_btn edit_btn_danger" onClick={confirmDelete}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
