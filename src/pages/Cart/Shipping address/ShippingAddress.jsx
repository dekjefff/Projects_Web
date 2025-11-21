import React, { useState } from 'react';
import './ShippingAddress.css'; 

// Note: ไม่จำเป็นต้อง Import footer-Main.js และ Nav-Logo.js ในไฟล์นี้ 
// หากไฟล์เหล่านั้นถูกโหลดและกำหนด customElements.define ไว้แล้วใน index.html หรือ index.js หลักของแอปฯ
// แต่เราจะใช้แท็ก HTML ที่กำหนดเองโดยตรงใน JSX

// --- Add New Address Modal Component (เหมือนเดิม) ---
const AddNewAddressModal = ({ onClose, onSave }) => {
  // State และ Functions สำหรับ Modal (เหมือนเดิม)
  const [formData, setFormData] = useState({
    firstName: '',
    phoneNo: '',
    province: '',
    street: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Logic to save data
    onSave(); 
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3 className="modal-title">Add new Address</h3>
        
        <div className="ShippingAddress_input-group">
          <input 
            type="text" 
            name="firstName"
            placeholder="First name" 
            className="input-field"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input 
            type="text" 
            name="phoneNo"
            placeholder="Phone No." 
            className="input-field" 
            value={formData.phoneNo}
            onChange={handleChange}
          />
        </div>
        
        <select 
          name="province"
          className="full-width-input" 
          defaultValue=""
          value={formData.province}
          onChange={handleChange}
        >
          <option value="" disabled>Province, District, Sub-district, Postal Code</option>
          <option value="Bangkok">Bangkok</option>
          {/* ยังคิดไม่ออกเอาไรเพิ่ม */}
        </select>

        <textarea
          name="street"
          placeholder="Street Name, Building, House No."
          className="full-width-input text-area-field"
          value={formData.street}
          onChange={handleChange}
        />

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Shipping Address Component ---
const ShippingAddress = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  
  const handleSaveAddress = () => {
    alert("New address saved! (Simulated)");
    handleCloseModal();
  };

  const existingAddress = {
    name: 'Ballpi',
    phone: '(+66) 0951112222',
    details: 'live on earth ,soi mai tong roo, road tum a rai got dai for leaw'
  };

  return (
    <div className="shipping-container">
      <navlogo-component />
      <div class="line"></div>
      <div className="header-section">
        <h1 className="title">Shipping address</h1>
        <p className="subtitle">Manage and protect your address</p>
        <div className="my-address-section">
        <span className="my-address-text">My address</span>
        <button 
          className="add-button" 
          onClick={handleOpenModal}
        >
          + Add new address
        </button>
      </div>
      {/* Display Existing Address */}
      <div className="address-box">
        <div className="address-line">
          <strong>{existingAddress.name}</strong> | {existingAddress.phone}
        </div>
        <div className="address-line">
          {existingAddress.details}
        </div>
      </div>
      </div>

      {/* The Modal Pop-up */}
      {isModalOpen && (
        <AddNewAddressModal 
          onClose={handleCloseModal} 
          onSave={handleSaveAddress}
        />
      )}
      <footer-main-component />
    </div>
  );
};

export default ShippingAddress;