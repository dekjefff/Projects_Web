import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./usermanagement.css";

export default function UserManagement() {
    const navigate = useNavigate();
    const API_BASE = "http://localhost:3030/accountInfo";

    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    const pageSize = 3;

    async function fetchUsers({ page = 1, limit = pageSize, q = "", status = "", role = "" } = {}) {
        try {
            const params = new URLSearchParams();
            params.append("page", page);
            params.append("limit", limit);
            if (q) params.append("q", q);
            if (status) params.append("status", status);
            if (role) params.append("role", role);

            const res = await fetch(`${API_BASE}/users?${params.toString()}`);
            return await res.json();
        } catch (err) {
            console.error("Error fetching users:", err);
            return { items: [], total: 0 };
        }
    }

    const loadPage = async (page = 1) => {
        setLoading(true);
        let mounted = true;
        try {
            const data = await fetchUsers({ page, limit: pageSize, q: search, status: statusFilter, role: roleFilter });
            if (!mounted) return;
            setUsers(data.items || []);
            setTotal(data.total || 0);
            setCurrentPage(page);
        } catch (err) {
            console.error("Error loading users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;
        // load first page when filters change
        if (mounted) loadPage(1);
        return () => (mounted = false);
    }, [search, statusFilter, roleFilter]);

    const maxPage = Math.max(1, Math.ceil(total / pageSize));

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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select className="user_sel" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <select className="user_sel" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
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
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="empty">Loading...</td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="empty">No users to display</td>
                                    </tr>
                                ) : (
                                    users.map((u, index) => (
                                        <tr key={u.id || u.user_ID || index}>
                                            <td>
                                                <div className="user_avatar">{u.avatarText || "--"}</div>
                                                {u.name}
                                            </td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className="pill pill-role">{u.role}</span>
                                            </td>
                                            <td>
                                                <span className={`pill pill-${(u.status || "").toLowerCase()}`}>{u.status}</span>
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
                        <div>Showing {users.length} of {total} users</div>

                        <nav className="user_pager">
                            <button className="user_page_btn" disabled={currentPage <= 1} onClick={() => loadPage(currentPage - 1)}>← Previous</button>

                            {Array.from({ length: Math.min(maxPage, 5) }).map((_, i) => {
                                const p = i + 1;
                                return (
                                    <button
                                        key={p}
                                        className={`user_page_num ${currentPage === p ? "is-current" : ""}`}
                                        onClick={() => loadPage(p)}
                                        disabled={p > maxPage}
                                    >
                                        {p}
                                    </button>
                                );
                            })}

                            {maxPage > 5 && <button className="user_page_num" disabled>…</button>}

                            {maxPage > 5 && (
                                <button className="user_page_num" onClick={() => loadPage(maxPage)}>{maxPage}</button>
                            )}

                            <button className="user_page_btn" disabled={currentPage >= maxPage} onClick={() => loadPage(currentPage + 1)}>Next →</button>
                        </nav>
                    </div>

                </div>
            </section>
        </div>
    );
}
