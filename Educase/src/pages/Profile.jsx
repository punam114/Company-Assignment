import React from 'react';
import { useLocation } from "react-router-dom";

export default function Profile() {
  const location = useLocation();
  const email = location.state?.email || "Marry@Gmail.Com";
  const name = location.state?.name || "Marry Doe";

  return (
    <div className="container" style={{ padding: 0 }}>
      <div className="profile-wrap">
        <div className="profile-header">Account Settings</div>

        <div className="profile-avatar-box">
          <img src="https://i.pravatar.cc/100" alt="profile" />
        </div>
        
        <div className="profile-info-box">
          <h3>{name}</h3>
          <p>{email}</p>
        </div>

        <div className="dashed-line"></div>

        <p className="profile-desc">
          Lorem Ipsum Dolor Sit Amet, Consetetur Sadipscing Elitr,
          Sed Diam Nonumy Eirmod Tempor Invidunt Ut Labore Et
          Dolore Magna Aliquyam Erat, Sed Diam
        </p>
      </div>
    </div>
  );
}