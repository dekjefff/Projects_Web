// pages/Cart/Shipping address/ShippingAddress.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- เพิ่ม: นำเข้า useNavigate
import './ShippingAddress.css'; 

// --- Add New Address Modal Component (เหมือนเดิม) ---
const AddNewAddressModal = ({ onClose, onSave }) => {
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
        onSave(); 
    };
    
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3 className="modal-title">Add new Address</h3>
                
                <div className="ShippingAddress_input-group ">
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
    // const navigate = useNavigate(); // สามารถเรียกใช้ได้หากต้องการลิงก์กลับไปหน้า Cart
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