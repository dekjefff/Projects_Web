import React from 'react';
import './TeamDev.css'; // นำเข้าไฟล์ CSS

const TeamDev = () => {
  // ข้อมูลสมาชิกทีม 
  const teamMembers = [
    {
      id: 1,
      name: 'วีรากร ตรีศิริภพ',
      studentId: '6787076',
      instagram: 'Fong_vrt',
      image: '/src/assets/Fong.jpg',
    },
    {
      id: 2,
      name: 'สุกฤษฎิ์ ชัยวาลย์',
      studentId: '6787083',
      instagram: 'firsst_ss',
      image: '/src/assets/First.jpg',
    },
    {
      id: 3,
      name: 'เจฟฟี่ เอมิก้า ฟิลิปส์',
      studentId: '6787094',
      instagram: 'dekjeff',
      image: '/src/assets/jeff.jpeg',
    },
    {
      id: 4,
      name: 'ภาคิน นาคเจริญ',
      studentId: '6787113',
      instagram: 'pakin_llll',
      image: '/src/assets/ball.jpg',
    },
  ];

  return (
    <div className="teamdev-container">
      <navlogo-component />
      <div class="line"></div>
      <div className="teamdev-content">
        <h1 className="teamdev-title">Team Developer</h1>

        <div className="team-container">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className={`team-card ${index === 0 ? 'selected-member' : ''}`}
            >
              <div className="member-image-wrapper">
                <img src={member.image} alt={member.name} className="member-image" />
              </div>
              <h3 className="member-name">{member.name}</h3>
              <p className="member-id">{member.studentId}</p>
              <p className="member-instagram">
                <span className="instagram-icon">
                  <img src="src\assets\Instragram-logo.png" width='20px' height='20px' alt="ig" />
                </span>
                {member.instagram}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer (เหมือนกับหน้า ProfileCard) */}
          <footer-login-component />
    </div>
  );
};

export default TeamDev;
