import React, {useState} from 'react';
import './User_Login.css';
import { Navigate, useNavigate } from 'react-router-dom';

const User_Login = () => {

    const [form, setForm] = useState({
      user_name: '',
      passwd: '',
    });

    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    
      function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
      }
    
      async function handleSubmit(e) {
        e.preventDefault();
        try {
          const res = await fetch('http://localhost:3030/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
          });

          const data = await res.json();
          
          if (!res.ok){
            setMsg(data.message);
            alert(data.message);
            return;
          } 

        
          
          navigate('/');
          setMsg(data.message || 'Registered successfully');
        } catch (error) {
          setMsg('Error: ' + error.message);
        }
      }

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
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <img src="src/assets/user-icon.png" alt="User Icon" className="input-icon-img" />
              <input
                type="text"
                placeholder="Username"
                required
                className="input-field"
                name="user_name"
                value={form.user_name}
                onChange={handleChange}
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
                name="passwd"
                value={form.passwd}
                onChange={handleChange}
              />
              <span className="required-star">*</span>
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <div className="bottom-links">
            <a href="/Register_login" className="link">Don't have an account?</a>
          </div>
        </div>
      </main>
      <footer-login-component />
    </div>
  );
};
export default User_Login;