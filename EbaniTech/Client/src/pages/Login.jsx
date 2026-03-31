import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-1" style={{background: 'radial-gradient(circle at top right, #1e293b, #0f172a)'}}>
            <div className="glass card modal-content" style={{ maxWidth: '440px', padding: '3rem' }}>
                <div className="text-center mb-1">
                    <div className="flex justify-center mb-1">
                        <ShieldCheck size={48} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Welcome Back</h2>
                    <p>Enter your credentials to access EbaniTech</p>
                </div>

                {error && (
                    <div className="badge badge-error mb-1 text-center" style={{ width: '100%', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '8px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input 
                                type="email" 
                                placeholder="name@company.com" 
                                style={{ paddingLeft: '2.5rem' }}
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label>Security Password</label>
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
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '50px' }}>
                        <LogIn size={20} /> Access Portal
                    </button>
                </form>
                
                <p className="text-center mt-1" style={{ fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Initialize Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
