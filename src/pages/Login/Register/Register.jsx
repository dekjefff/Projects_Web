import React, { useState } from 'react';
import '../User_Login/User_Login.css';
import './Register.css';
const Register_login = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Registration Data:', { firstName, lastName, email, password });
    };
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
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
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
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <span className="required-star">*</span>
                        </div>
                        <label className="input-label">Email</label>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Username@gmail.com"
                                required
                                className="input-field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <label className="input-label">Password</label>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span className="required-star">*</span>
                        </div>
                        <button type="submit" className="login-button">
                            Register
                        </button>
                    </form>
                </div>
            </main>
            <footer-login-component />
        </div>
    );
};
export default Register_login;