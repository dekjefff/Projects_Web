import React, { useState } from 'react';
import '../User_login/User_Login.css';
import './forgot.css';
const Forgot_Pass = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
            setMessage('');
            return;
        }
        console.log('ข้อมูลรีเซ็ตรหัสผ่านที่ส่ง:', { email, password });
        setError('');
        setMessage('ลิงก์รีเซ็ตรหัสผ่านถูกส่งไปยังอีเมลของคุณแล้ว');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };
    const passwordsMatch = password === confirmPassword && password !== '';
    const isInvalid = confirmPassword !== '' && password !== confirmPassword;
    return (
        <div className="login-page">
            <main className="main-content">
                <div className="login-container">
                    <div className="logo-section">
                        <img src="src/assets/Logo.png" alt="Logo" />
                    </div>
                    {error && <p style={{ color: '#e44d26', fontWeight: 'bold' }}>{error}</p>}
                    {message && <p style={{ color: '#66ff99', fontWeight: 'bold' }}>{message}</p>}
                    <form className="login-form" onSubmit={handleSubmit}>
                        <label className="input-label">Email</label>
                        <div className="input-group">
                            <img src="src/assets/user-icon.png" alt="Email Icon" className="input-icon-img" />
                            <input
                                type="email"
                                placeholder="Username@gmail.com"
                                required
                                className="input-field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <span className="required-star">*</span>
                        </div>
                        
                        <label className="input-label">Password</label>
                        <div className="input-group">
                            <img src="src/assets/lock-icon.png" alt="Lock Icon" className="input-icon-img" />
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
                        <label className="input-label">Confirm password</label>
            
                        <div className={`input-group ${isInvalid ? 'is-invalid' : ''} ${passwordsMatch ? 'is-valid' : ''}`}>
                            <img src="src/assets/lock-icon.png" alt="Lock Icon" className="input-icon-img" />
                            <input
                                type="password"
                                placeholder="Confirm password"
                                required
                                className="input-field"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <span className="required-star">*</span>
                        </div>
                        <button type="submit" className="login-button">
                            Login
                        </button>
                    </form>
                </div>
            </main>
            <footer-login-component />
        </div>
    );
};

export default Forgot_Pass;