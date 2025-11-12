import React from 'react';
import './User_Login.css';
const User_Login = () => {
  return (
    <div className="login-page">
      <header className="header">
        <span>User</span>
      </header>
      <main className="main-content">
        <div className="login-container">
          <div className="logo-section">
            <img src="src/assets/Logo.png" alt="Logo" />
          </div>
          <form className="login-form">
            <div className="input-group">
              <img src="src/assets/user-icon.png" alt="User Icon" className="input-icon-img" />
              <input
                type="text"
                placeholder="Username"
                required
                className="input-field"
              />
              <span className="required-star">*</span>
            </div>
            <div className="input-group">
              <img src="src/assets/lock-icon.png" alt="Lock Icon" className="input-icon-img" />
              <input
                type="password"
                placeholder="Password"
                required
                className="input-field"
              />
              <span className="required-star">*</span>
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <div className="bottom-links">
            <a href="/Register_login" className="link">Don't have an account?</a>
            <a href="/Forgot_Pass" className="link">Forgot Password?</a>
          </div>
        </div>
      </main>
      <footer-login-component />
    </div>
  );
};
export default User_Login;