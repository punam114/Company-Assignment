import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SuperAdminDashboard from './SuperAdminDashboard';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      if (!localStorage.getItem('token')) {
        navigate('/login');
      }
    }
  }, [user, navigate]);

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  // Switch based on role
  if (user.role === 'super admin') {
    return <SuperAdminDashboard />;
  } else if (user.role === 'admin') {
    return <AdminDashboard />;
  } else if (user.role === 'user') {
    return <UserDashboard />;
  } else {
    return (
      <div className="container glass card mt-1 text-center">
        <h2>Unauthorized Role: {user.role}</h2>
        <p>Please contact system administrator.</p>
        <button className="btn btn-primary mt-1" onClick={() => navigate('/login')}>Back to Login</button>
      </div>
    );
  }
};

export default Dashboard;
