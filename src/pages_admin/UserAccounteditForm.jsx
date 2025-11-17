import React, { useEffect, useState } from "react";
import "./UserAccounteditForm.css";

export default function UserAccountEditForm() {
    const API_BASE = "";

    const [payload, setPayload] = useState({
        id: "",
        gender: "M",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        membership: "VIP"
    });

    useEffect(() => {
        const q = new URLSearchParams(window.location.search);
        const id = q.get("id");

        if (id) {
            setPayload(prev => ({ ...prev, id }));

            fetch(`${API_BASE}/users/${id}`)
                .then(res => res.json())
                .then(data => setPayload(data))
                .catch(() => console.log("Failed to load user"));
        }
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setPayload(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // NEW
        if (!payload.id) {
            await fetch(`${API_BASE}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        }
        // EDIT
        else {
            await fetch(`${API_BASE}/users/${payload.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        }

        window.location.href = "/UserManagement";
    };

    return (
        <div className="edit_bg">
            <div className="edit_shell">
                <section className="edit_header">
                    <h1 className="edit_header_title">Admin Editer Tools</h1>
                    <div className="edit_header_sub">User Account Management</div>
                </section>

                <section className="edit_stage">
                    <form className="edit_card" onSubmit={handleSubmit}>

                        <div className="edit_caps">
                            <span className="edit_caps_label">ID :</span>
                            <input
                                className="edit_pill_inp"
                                id="id"
                                type="text"
                                value={payload.id}
                                readOnly
                            />

                            <span className="edit_caps_label ml8">Gender :</span>

                            <select
                                className="edit_pill_sel"
                                id="gender"
                                value={payload.gender}
                                onChange={handleChange}
                            >
                                <option value="M">M</option>
                                <option value="F">F</option>
                                <option value="O">Other</option>
                            </select>
                        </div>

                        <div className="edit_row">
                            <div className="edit_field">
                                <label>First Name</label>
                                <input
                                    className="edit_inp"
                                    id="firstName"
                                    type="text"
                                    value={payload.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="edit_field">
                                <label>Last Name</label>
                                <input
                                    className="edit_inp"
                                    id="lastName"
                                    type="text"
                                    value={payload.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="edit_row">
                            <div className="edit_field">
                                <label>Email</label>
                                <input
                                    className="edit_inp"
                                    id="email"
                                    type="email"
                                    value={payload.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="edit_field">
                                <label>Phone</label>
                                <input
                                    className="edit_inp"
                                    id="phone"
                                    type="tel"
                                    value={payload.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="edit_field mb10">
                            <label>Shipping Address</label>
                            <textarea
                                className="edit_ta"
                                id="address"
                                value={payload.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="edit_row">
                            <div className="edit_field">
                                <label>Membership status</label>
                                <select
                                    className="edit_sel"
                                    id="membership"
                                    value={payload.membership}
                                    onChange={handleChange}
                                >
                                    <option value="VIP">VIP</option>
                                    <option value="Gold">Gold</option>
                                    <option value="Member">Member</option>
                                </select>
                            </div>
                        </div>

                        <div className="edit_form_actions">
                            <button
                                type="button"
                                className="edit_btn edit_btn_cancel"
                                onClick={() => (window.location.href = "/UserManagement")}
                            >
                                Cancel
                            </button>

                            <button type="submit" className="edit_btn edit_btn_save">
                                Save
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}
