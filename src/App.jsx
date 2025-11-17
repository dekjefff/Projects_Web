
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import User_Login from './pages/Login/User_login/User_Login.jsx'; 
import Register_login from './pages/Login/Register/Register.jsx';
import Forgot_Pass from './pages/Login/Forgot/Forgot.jsx'; // 
import Admin_Login from './pages/Login/Admin_login/Admin.jsx';
import ShippingAddress from './pages/Cart/Shipping address/ShippingAddress.jsx';
import TeamDev from './pages/Team/teamprofile.jsx';
import ErosHomePage from './pages/home-page/homepage.jsx';
import Detail from './pages/Datail/Datail.jsx';
import SearchResultsPage from './pages/Search/Result.jsx';
import SearchOverlay from './pages/Search/Search.jsx';
import UserManagement from './pages_admin/UserManagement.jsx';
import UserAccounteditForm from './pages_admin/UserAccounteditForm.jsx';
import ProductList from './pages_admin/ProductList.jsx';
import AddProduct from './pages_admin/AddProduct.jsx';
function App() {
  return (
    // ต้องห่อหุ้มด้วย <BrowserRouter>
    <BrowserRouter>
      <Routes>
        {/* เปลี่ยนpath login เป็น user */}
        <Route path="/login" element={<User_Login />} /> 
        <Route path="/Signin" element={<Register_login />} />
        <Route path="/Forgot_Pass" element={<Forgot_Pass />} />
        <Route path="/Admin_Login" element={<Admin_Login/>}/>
        <Route path="/ShippingAddress" element={<ShippingAddress/>}/>
        <Route path="/TeamDev" element={<TeamDev/>}/>
        <Route path="/" element={<ErosHomePage/>}/>
        <Route path="/detail" element={<Detail/>}/>
        <Route path="/SearchResults" element={<SearchResultsPage/>}/>
        <Route path="/Search" element={<SearchOverlay/>}/>
        <Route path="/UserManagement" element={<UserManagement />} />
        <Route path="/edit-user" element={<UserAccounteditForm />} />
        <Route path="/ProductList" element={<ProductList />} />
        <Route path="/AddProduct" element={<AddProduct />} />

      </Routes>
    </BrowserRouter>
  );
}
export default App;