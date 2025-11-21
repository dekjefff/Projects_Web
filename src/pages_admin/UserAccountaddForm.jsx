import React, { useEffect, useState } from "react";
import "./UserAccounteditForm.css";

export default function UserAccountEditForm() {
    const API_BASE = "http://localhost:3030"; // backend base URL

    const [payload, setPayload] = useState({
        id: "",           // customer_ID
        user_name: "",
        gender: "M",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        membership: "VIP"
    });

    useEffect(() => {
        const q = new URLSearchParams(window.location.search);
        const id = q.get("id");

        if (id) {
            setPayload(prev => ({ ...prev, id }));
            fetch(`${API_BASE}/users/${encodeURIComponent(id)}`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to load user");
                    return res.json();
                })
                .then(data => {
                    setPayload(prev => ({
                        ...prev,
                        user_name: data.user_name || "",
                        gender: data.gender || prev.gender,
                        firstName: data.firstName || "",
                        lastName: data.lastName || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        membership: data.membership_status || prev.membership
                    }));
                })
                .catch(() => console.log("Failed to load user"));
        }
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setPayload(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (payload.id) {
                // Edit user
                const res = await fetch(`${API_BASE}/users/${encodeURIComponent(payload.id)}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                if (!res.ok) throw new Error("Update failed");
            } else {
                // Create new user (optional)
                const res = await fetch(`${API_BASE}/users`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                if (!res.ok) throw new Error("Create failed");
            }

            window.location.href = "/UserManagement";
        } catch (err) {
            console.error(err);
            alert("Operation failed. Check console.");
        }
    };

    return (
        <div className="edit_bg">
            <div className="edit_shell">
                <h2>{payload.id ? "Edit User" : "Add New User"}</h2>
                <form onSubmit={handleSubmit}>
                    <label>User Name</label>
                    <input
                        id="user_name"
                        type="text"
                        value={payload.user_name}
                        onChange={handleChange}
                        required
                    />

                    <label>First Name</label>
                    <input
                        id="firstName"
                        type="text"
                        value={payload.firstName}
                        onChange={handleChange}
                        required
                    />

                    <label>Last Name</label>
                    <input
                        id="lastName"
                        type="text"
                        value={payload.lastName}
                        onChange={handleChange}
                        required
                    />

                    <label>Gender</label>
                    <select id="gender" value={payload.gender} onChange={handleChange}>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </select>

                    <label>Email</label>
                    <input
                        id="email"
                        type="email"
                        value={payload.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Phone</label>
                    <input
                        id="phone"
                        type="text"
                        value={payload.phone}
                        onChange={handleChange}
                    />

                    <label>Membership</label>
                    <select id="membership" value={payload.membership} onChange={handleChange}>
                        <option value="VIP">VIP</option>
                        <option value="Normal">Normal</option>
                    </select>

                    {payload.id && (
                        <>
                            <label>Customer ID</label>
                            <input
                                id="id"
                                type="text"
                                value={payload.id}
                                disabled
                            />
                        </>
                    )}

                    <button type="submit">{payload.id ? "Update User" : "Add User"}</button>
                </form>
            </div>
        </div>
    );
}
