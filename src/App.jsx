// app.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import User_Login from './pages/Login/User_login/User_Login.jsx';
import Register_login from './pages/Login/Register/Register.jsx';
import Forgot_Pass from './pages/Login/Forgot/Forgot.jsx';
import Admin_Login from './pages/Login/Admin_login/Admin.jsx';
import ShippingAddress from './pages/Cart/Shipping address/ShippingAddress.jsx';
import TeamDev from './pages/Team/teamprofile.jsx';
import HomePage from './pages/home-page/homepage.jsx';
import DetailMore from './pages/Datail/detailMore.jsx'
import ProductDetailresult from './pages/Search/Result.jsx';
import UserManagement from './pages_admin/UserManagement.jsx';
import UserAccounteditForm from './pages_admin/UserAccounteditForm.jsx';
import ProductList from './pages_admin/ProductList.jsx';
import AddProduct from './pages_admin/AddProduct.jsx';
import AddUser from './pages_admin/UserAccountaddForm.jsx';
import { CartProvider } from './pages/Cart/CartContext.jsx';
import CartPage from './pages/Cart/cart.jsx';
import ProductDetail from './pages/Datail/Datail.jsx';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* ---------------------------------------------------------------------- */}
          {/* *** ส่วนที่ 1: เส้นทางหลัก (ใช้ HomePage โดยตรง) *** */}
          {/* 🚨 แก้ไข: โหลด HomePage โดยตรง เพื่อให้ useEffect ภายใน HomePage ทำงาน */}
          <Route path="/" element={<HomePage />} />

          {/* ---------------------------------------------------------------------- */}
          {/* *** ส่วนที่ 2: เส้นทางผลลัพธ์ (ปลายทางจากการค้นหา) *** */}
          <Route path="/resultDetailsearch" element={<ProductDetailresult />} />

          {/* ---------------------------------------------------------------------- */}
          {/* *** ส่วนที่ 3: เส้นทางอื่นๆ (Detail, Cart, Login, Admin) *** */}
          <Route path="/login" element={<User_Login />} />
          <Route path="/signin" element={<Register_login />} />
          <Route path="/Forgot_Pass" element={<Forgot_Pass />} />
          <Route path="/Admin_Login" element={<Admin_Login />} />
          <Route path="/ShippingAddress" element={<ShippingAddress />} />
          <Route path="/TeamDev" element={<TeamDev />} />
          <Route path="/detail" element={<ProductDetail productId="123" />} />
          <Route path="/cartpage" element={<CartPage />} />
          <Route path="/detailMore" element={<DetailMore />} />

          {/* เส้นทาง Admin */}
          <Route path="/UserManagement" element={<UserManagement />} />
          <Route path="/edit-user" element={<UserAccounteditForm />} />
          <Route path="/ProductList" element={<ProductList />} />
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/adduser" element={<AddUser />} />

        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;