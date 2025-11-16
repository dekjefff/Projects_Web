
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import User_Login from './pages/Login/User_login/User_Login.jsx'; 
import Register_login from './pages/Login/Register/Register.jsx';
import Forgot_Pass from './pages/Login/Forgot/Forgot.jsx'; // 
import Admin_Login from './pages/Login/Admin_login/Admin.jsx';
import ShippingAddress from './pages/Cart/Shipping address/ShippingAddress.jsx';
import TeamDev from './pages/Team/teamprofile.jsx';
import ErosHomePage from './pages/home-page/homepage.jsx';
import SearchResultsPage from './pages/Search/Result.jsx';
import SearchOverlay from './pages/Search/Search.jsx';
function App() {
  return (
    // ต้องห่อหุ้มด้วย <BrowserRouter>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<User_Login />} /> 
        <Route path="/login" element={<User_Login />} /> 
        <Route path="/Register_login" element={<Register_login />} />
        <Route path="/Forgot_Pass" element={<Forgot_Pass />} />
        <Route path="/Admin_Login" element={<Admin_Login/>}/>
        <Route path="/ShippingAddress" element={<ShippingAddress/>}/>
        <Route path="/TeamDev" element={<TeamDev/>}/>
        <Route path="/HomePage" element={<ErosHomePage/>}/>
        <Route path="/SearchResults" element={<SearchResultsPage/>}/>
        <Route path="/SearchOverlay" element={<SearchOverlay/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;