// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Import Component ทั้ง 3 หน้าจอ
// (สมมติว่าคุณจัดโครงสร้างไฟล์ตามที่แนะนำ: /pages/Login/Component_Folder/Component.jsx)
import User_Login from './pages/Login/User_login/User_Login.jsx'; 
import Register_login from './pages/Login/Register/Register.jsx';
import Forgot_Pass from './pages/Login/Forgot/Forgot.jsx'; // ตรวจสอบชื่อไฟล์ในโฟลเดอร์ Forgot ของคุณ
import Admin_Login from './pages/Login/Admin_login/Admin.jsx';
import ShippingAddress from './pages/Cart/Shipping address/ShippingAddress.jsx';
import TeamDev from './pages/Team/teamprofile.jsx';
import ErosHomePage from './pages/home-page/homepage.jsx';
function App() {
  return (
    // ต้องห่อหุ้มด้วย <BrowserRouter>
    <BrowserRouter>
      <Routes>
        {/* เปลี่ยนpath login เป็น user */}
        <Route path="/login/user" element={<User_Login />} /> 
        <Route path="/login" element={<User_Login />} /> 
        <Route path="/Register_login" element={<Register_login />} />
        <Route path="/Forgot_Pass" element={<Forgot_Pass />} />
        <Route path="/Admin_Login" element={<Admin_Login/>}/>
        <Route path="/ShippingAddress" element={<ShippingAddress/>}/>
        <Route path="/TeamDev" element={<TeamDev/>}/>
        <Route path="/HomePage" element={<ErosHomePage/>}/>

        <Route path="/" element={<UserManagement />} />
        <Route path="/UserManagement" element={<UserManagement />} />
        <Route path="/edit-user" element={<UserAccounteditForm />} />
        <Route path="/ProductList" element={<ProductList />} />
        <Route path="/AddProduct" element={<AddProduct />} />
           
      </Routes>
    </BrowserRouter>
  );
}
export default App;