import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


import "./components/footer-Login.js"; 
import "./components/footer-Main.js"; 
import "./components/Top-Nav-bar.js";
import "./components/Nav-Logo.js";
import "./components/reviewlist.js";
import "./components/review.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)