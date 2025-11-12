import React from 'react';
import './ProfileCard.css'; // นำเข้าไฟล์ CSS

const ProfileCard = ({ user }) => {
  // สร้างข้อมูลจำลอง (mock data) ถ้า user prop ไม่ได้ถูกส่งมา
  const defaultUser = {
    firstName: "Ballpi",
    lastName: "Kayeeeajai",
    email: "Ba********@gmail.com",
    phoneNumber: "**********22",
    gender: "Male",
    shippingAddress: "live on earth soi mai tong roo road tum a rai got dai tor leaw",
  };

  const userData = user || defaultUser;

  return (
    <div className="profile-container">
        <navlogo-component />

      <div className="profile-content">
        {/* ส่วน My profile */}
        <h2 className="profile-title">My profile</h2>
        <p className="profile-subtitle">Manage and protect your account</p>
        
        {/* รายละเอียดโปรไฟล์ */}
        <div className="profile-details">
          {/* แถวข้อมูล */}
          <div className="detail-row">
            <label className="detail-label">First name</label>
            <span className="detail-value">{userData.firstName}</span>
          </div>
          <div className="detail-row">
            <label className="detail-label">Last name</label>
            <span className="detail-value">{userData.lastName}</span>
          </div>
          <div className="detail-row">
            <label className="detail-label">Email</label>
            <span className="detail-value email-value">{userData.email}</span>
          </div>
          <div className="detail-row">
            <label className="detail-label">Phone Number</label>
            <span className="detail-value">{userData.phoneNumber}</span>
          </div>
          
          {/* ส่วน Gender */}
          <div className="detail-row gender-row">
            <label className="detail-label">Gender</label>
            <div className="gender-options">
              {['Male', 'Female', 'Other'].map((option) => (
                <label key={option} className="radio-option">
                  <input 
                    type="radio" 
                    name="gender" 
                    value={option} 
                    checked={userData.gender === option}
                    readOnly 
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* ส่วน Shipping address */}
          <div className="detail-row">
            <label className="detail-label">Shipping address</label>
            <span className="detail-value address-value">{userData.shippingAddress}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
        <footer-main-component />
    </div>
  );
};

export default ProfileCard;