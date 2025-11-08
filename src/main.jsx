import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 💥 แก้ไข: Import Web Components ทั้งหมดที่นี่
import "./components/footer-Login.js"; 
import "./components/footer-Main.js"; // เพิ่ม Footer Main เผื่อใช้งาน
import "./components/Top-Nav-bar.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)