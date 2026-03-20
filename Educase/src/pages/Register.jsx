import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/profile", { state: { email, name } });
  };

  return (
    <div className="container">
      <h2>Create your<br/>PopX account</h2>

      <form onSubmit={handleRegister}>
        <div className="input-group">
          <label>Full Name<span className="req">*</span></label>
          <input type="text" placeholder="Marry Doe" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Phone number<span className="req">*</span></label>
          <input type="tel" placeholder="Marry Doe" required />
        </div>

        <div className="input-group">
          <label>Email address<span className="req">*</span></label>
          <input type="email" placeholder="Marry Doe" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Password<span className="req">*</span></label>
          <input type="password" placeholder="Marry Doe" required />
        </div>

        <div className="input-group">
          <label>Company name</label>
          <input type="text" placeholder="Marry Doe" />
        </div>

        <span className="radio-group-title">Are you an Agency?<span className="req">*</span></span>
        <div className="radio-inline">
          <label style={{ display: 'inline', fontWeight: 'normal', color: 'black' }}>
            <input type="radio" name="agency" defaultChecked /> Yes
          </label>
        </div>
        <div className="radio-inline">
          <label style={{ display: 'inline', fontWeight: 'normal', color: 'black' }}>
            <input type="radio" name="agency" /> No
          </label>
        </div>

        <br/><br/><br/>
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}