import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/profile", { state: { email, name: 'User' } });
  };

  return (
    <div className="container">
      <h2>Signin to your<br/>PopX account</h2>
      <p className="subtitle">Lorem ipsum dolor sit amet,<br/>consectetur adipiscing elit.</p>

      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Email Address</label>
          <input 
            type="email" 
            placeholder="Enter email address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            placeholder="Enter password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}