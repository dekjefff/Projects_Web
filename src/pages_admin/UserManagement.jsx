import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./usermanagement.css";

export default function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const pageSize = 3;
  const searchDebounceRef = useRef(null);
  const activeFetchAbort = useRef(null);

  async function fetchUsers({ page = 1, limit = pageSize, q = "" } = {}) {
    if (activeFetchAbort.current) activeFetchAbort.current.abort();
    const controller = new AbortController();
    activeFetchAbort.current = controller;

    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (q) params.append("q", q);

      const url = `http://localhost:3030/users/?${params.toString()}`;
      const headers = { "Content-Type": "application/json" };
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(url, { headers, signal: controller.signal });
      if (!res.ok) {
        console.error("Failed to fetch users", res.status);
        return { items: [], total: 0 };
      }
      return await res.json();
    } catch (err) {
      if (err.name === "AbortError") return { items: [], total: 0, aborted: true };
      console.error("Error fetching users:", err);
      return { items: [], total: 0 };
    } finally {
      if (activeFetchAbort.current === controller) activeFetchAbort.current = null;
    }
  }

  const loadPage = async (page = 1) => {
    setLoading(true);
    try {
      const safePage = Math.max(1, page);
      const data = await fetchUsers({ page: safePage, limit: pageSize, q: search });
      if (data.aborted) return;
      setUsers(data.items || []);
      setTotal(data.total || 0);
      setCurrentPage(safePage);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      loadPage(1);
    }, 400);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [search]);

  useEffect(() => {
    loadPage(1);
    return () => {
      if (activeFetchAbort.current) activeFetchAbort.current.abort();
    };
  }, []);

  const maxPage = Math.max(1, Math.ceil(total / pageSize));

  const goEdit = (customerId) => {
    if (!customerId) {
      console.warn('goEdit: missing customerId', customerId);
      alert('Cannot open editor: missing user id');
      return;
    }
    navigate(`/edit-user?id=${encodeURIComponent(customerId)}`);
  };

  async function handleDelete(customerId) {
    if (!window.confirm("Delete this user?")) return;
    setDeleteId(customerId);

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:3030/users/${encodeURIComponent(customerId)}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Delete failed: ${res.status} ${text}`);
      }

      setUsers(prev => prev.filter(u => u.customer_ID !== customerId));
      setTotal(prev => Math.max(0, prev - 1));
      const newMax = Math.max(1, Math.ceil(Math.max(0, total - 1) / pageSize));
      if (currentPage > newMax) loadPage(newMax);

    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Delete failed. Check console for details.");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="user_shell">
      <section className="user_hero">
        <h1>User Management</h1>
        <div className="user_sub">Comprehensive admin interface for managing your users</div>
      </section>

      <section className="user_stage">
        <div className="user_stage_inner">
          <div className="user_filters">
            <input
              className="user_inp"
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="button"
              className="user_btn user_btn_primary"
              onClick={() => navigate("/edit-user")}
            >
              <span className="plus">+</span> ADD User
            </button>
          </div>

          <div className="user_table_card">
            <table className="user_table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Gender</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="empty">Loading...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty">No users to display</td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const customerId = u.customer_ID || u.id || u.user_ID;
                    return (
                      <tr key={customerId}>
                        <td>{u.user_name || "--"}</td>
                        <td>{u.email || "--"}</td>
                        <td>{u.firstName || "--"}</td>
                        <td>{u.lastName || "--"}</td>
                        <td>{u.gender || "--"}</td>
                        <td>
                          <div className="prod_row_action">
                            <button className="user_btn" onClick={() => goEdit(customerId)}>Edit</button>
                            <button
                              className="user_btn user_btn_danger"
                              onClick={() => handleDelete(customerId)}
                              disabled={deleteId === customerId}
                            >
                              {deleteId === customerId ? "Deleting…" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

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
              {maxPage > 5 && <button className="user_page_num" onClick={() => loadPage(maxPage)}>{maxPage}</button>}
              <button className="user_page_btn" disabled={currentPage >= maxPage} onClick={() => loadPage(currentPage + 1)}>Next →</button>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}
