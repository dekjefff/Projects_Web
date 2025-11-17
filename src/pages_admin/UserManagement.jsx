import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./usermanagement.css";

export default function UserManagement() {
    const navigate = useNavigate();
    const API_BASE = "";

    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 3;

    const loadPage = async (page) => {
        try {
            const res = await fetch(`${API_BASE}/users?page=${page}&limit=${pageSize}`);
            const data = await res.json();

            setUsers(data.items || []);
            setTotal(data.total || 0);
            setCurrentPage(page);
        } catch (err) {
            console.error("Error loading users:", err);
        }
    };

    useEffect(() => {
        loadPage(1);
    }, []);

    const maxPage = Math.ceil(total / pageSize);

    return (
        <div className="user_shell">

            {/* Header */}
            <section className="user_hero">
                <h1>User Management</h1>
                <div className="user_sub">
                    Comprehensive admin interface for managing your products and services
                </div>
            </section>

            {/* Content */}
            <section className="user_stage">
                <div className="user_stage_inner">

                    {/* Filters */}
                    <div className="user_filters">
                        <input
                            className="user_inp"
                            type="text"
                            placeholder="Search users by name, email or role..."
                        />

                        <select className="user_sel">
                            <option>All Status</option>
                        </select>

                        <select className="user_sel">
                            <option>All Roles</option>
                        </select>

                        <button
                            className="user_btn user_btn_primary"
                            type="button"
                            onClick={() => navigate("/edit-user")}
                        >
                            <span className="plus">+</span> ADD User
                        </button>
                    </div>

                    {/* Table */}
                    <div className="user_table_card">
                        <table className="user_table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Last login</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="empty">
                                            No users to display
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="user_avatar">
                                                    {u.avatarText || "--"}
                                                </div>
                                                {u.name}
                                            </td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className="pill pill-role">{u.role}</span>
                                            </td>
                                            <td>
                                                <span className={`pill pill-${(u.status || "").toLowerCase()}`}>
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td>{u.lastLogin}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="user_footerbar">
                        <div>
                            Showing {users.length} of {total} users
                        </div>

                        <nav className="user_pager">
                            <button
                                className="user_page_btn"
                                disabled={currentPage <= 1}
                                onClick={() => loadPage(currentPage - 1)}
                            >
                                ← Previous
                            </button>

                            {[1, 2, 3].map((p) => (
                                <button
                                    key={p}
                                    className={`user_page_num ${currentPage === p ? "is-current" : ""}`}
                                    disabled={p > maxPage}
                                    onClick={() => loadPage(p)}
                                >
                                    {p}
                                </button>
                            ))}

                            <button className="user_page_num" disabled>
                                …
                            </button>

                            <button
                                className="user_page_num"
                                disabled={10 > maxPage}
                                onClick={() => loadPage(10)}
                            >
                                10
                            </button>

                            <button
                                className="user_page_btn"
                                disabled={currentPage >= maxPage}
                                onClick={() => loadPage(currentPage + 1)}
                            >
                                Next →
                            </button>
                        </nav>
                    </div>

                </div>
            </section>
        </div>
    );
}
