import React, { useState } from "react";
import "../User_Login/User_Login.css";
import "./Register.css";
import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";

// const showToast = toast();

const Register_login = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    user_name: "",
    passwd: "",
    phone: "",
    email: "",
    gender: "",
  });

  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3030/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message);
        return;
      }

      setMsg(data.message || "Registered successfully");

      navigate("/login");
    } catch (error) {
      setMsg("Error: " + error.message);
    }
  }

  return (
    <div className="login-page">
      <main className="main-content">
        <div className="login-container">
          <div className="logo-section">
            <img src="/src/assets/Logo.png" alt="Logo" />
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            <label className="input-label">First Name</label>
            <div className="input-group">
              <input
                type="text"
                placeholder="Your first name here"
                required
                className="input-field"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
              />
              <span className="required-star">*</span>
            </div>

            <label className="input-label">Last Name</label>
            <div className="input-group">
              <input
                type="text"
                placeholder="Your last name here"
                required
                className="input-field"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
              <span className="required-star">*</span>
            </div>

            <label className="input-label">User Name</label>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                required
                className="input-field"
                name="user_name"
                value={form.user_name}
                onChange={handleChange}
              />
            </div>

            <label className="input-label">Email</label>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                required
                className="input-field"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              <span className="required-star">*</span>
            </div>

            <label className="input-label">Phone Number</label>
            <div className="input-group">
              <input
                type="number"
                placeholder="Phone"
                required
                className="input-field"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
              <span className="required-star">*</span>
            </div>

            <label className="input-label">Gender</label>
            <div className="input-group">
              <select name="gender" onChange={handleChange} required>
                <option value="-">null</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <span className="required-star">*</span>
            </div>

            <label className="input-label">Password</label>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                required
                className="input-field"
                name="passwd"
                value={form.passwd}
                onChange={handleChange}
              />
              <span className="required-star">*</span>
            </div>

            <button type="submit" className="login-button">
              Register
            </button>
          </form>
          {msg && <p>{msg}</p>}
        </div>
      </main>
      {/* <footer-login-component /> */}
    </div>
  );
};

export default Register_login;
