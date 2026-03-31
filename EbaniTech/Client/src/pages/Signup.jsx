import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { UserPlus, Mail, Lock, User, Shield, ShieldCheck } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/signup', { name, email, password, role, phone });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Initialization failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-1" style={{background: 'radial-gradient(circle at top left, #1e293b, #0f172a)'}}>
            <div className="glass card modal-content" style={{ maxWidth: '480px', padding: '3rem' }}>
                <div className="text-center mb-1">
                    <div className="flex justify-center mb-1">
                        <UserPlus size={48} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Create Account</h2>
                    <p>Join the EbaniTech ecosystem</p>
                </div>

                {error && (
                    <div className="badge badge-error mb-1 text-center" style={{ width: '100%', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '8px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label>Full Legal Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input 
                                type="text" 
                                placeholder="John Doe" 
                                style={{ paddingLeft: '2.5rem' }}
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Official Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input 
                                type="email" 
                                placeholder="john@ebani.tech" 
                                style={{ paddingLeft: '2.5rem' }}
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Access Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                style={{ paddingLeft: '2.5rem' }}
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <div style={{ position: 'relative' }}>
                            <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input 
                                type="text" 
                                placeholder="+1 234 567 890" 
                                style={{ paddingLeft: '2.5rem' }}
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label>System Role</label>
                        <div style={{ position: 'relative' }}>
                            <Shield size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <select 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                                style={{ paddingLeft: '2.5rem' }}
                            >
                                <option value="user">Standard User</option>
                                <option value="admin">System Admin</option>
                                <option value="super admin">Super Admin</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '50px' }}>
                         Initialize Membership
                    </button>
                </form>
                
                <p className="text-center mt-1" style={{ fontSize: '0.9rem' }}>
                    Already registered? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Access Portal</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
