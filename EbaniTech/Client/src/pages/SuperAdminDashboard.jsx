import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { LogOut, Trash, Edit, Plus, User, Shield, ShieldCheck, Mail, Phone, X, UserPlus, Users } from 'lucide-react';

const SuperAdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [admins, setAdmins] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  
  // Create Admin State
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', phone: '' });
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  // Create User State
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', phone: '', adminId: '' });
  const [showAddUser, setShowAddUser] = useState(false);

  // Edit State
  const [editingItem, setEditingItem] = useState(null); 

  useEffect(() => {
    fetchAdmins();
    fetchAllUsers();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await api.get('/superadmin/admins');
      setAdmins(response.data);
    } catch (error) {
      toast.error('Failed to fetch admins');
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await api.get('/superadmin/users');
      setAllUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch general users');
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await api.post('/superadmin/admin', newAdmin);
      toast.success('New Admin delegated successfully!');
      setNewAdmin({ name: '', email: '', password: '', phone: '' });
      setShowAddAdmin(false);
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.adminId) {
      toast.error('Please assign a Managing Admin to this user');
      return;
    }
    try {
      await api.post('/superadmin/user', newUser);
      toast.success('System User registered successfully!');
      setNewUser({ name: '', email: '', password: '', phone: '', adminId: '' });
      setShowAddUser(false);
      fetchAllUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/superadmin/user/${editingItem._id}`, editingItem);
      toast.success('Member details updated');
      setEditingItem(null);
      fetchAdmins();
      fetchAllUsers();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id, isUser) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      const endpoint = isUser ? `/superadmin/user/${id}` : `/superadmin/admin/${id}`;
      await api.delete(endpoint);
      toast.success('Member removed from system');
      fetchAdmins();
      fetchAllUsers();
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  return (
    <div className="container" style={{maxWidth: '1200px'}}>
      {/* Header */}
      <header className="flex justify-between items-center mb-1">
        <div>
          <h1 className="flex items-center gap-1">
            <ShieldCheck size={32} color="var(--primary)" /> 
            System Governance
          </h1>
          <p>Super Admin Portal • Welcome, {user?.name}</p>
        </div>
        <button className="btn btn-secondary" onClick={logout}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Stats / Quick Actions */}
      <div className="flex gap-1" style={{ marginBottom: '2rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddAdmin(true)}
        >
          <Shield size={18} /> Delegate New Admin
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={() => setShowAddUser(true)}
          style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}
        >
          <UserPlus size={18} /> Register New User
        </button>
      </div>

      {/* Admins Table */}
      <section className="mb-1">
        <h3 className="mb-1 flex items-center gap-1">
          <Shield size={20} color="var(--primary)" /> 
          Managed Administrators ({admins.length})
        </h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact info</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id}>
                  <td>
                    <div style={{fontWeight: 600}}>{admin.name}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1" style={{color: 'var(--text-secondary)'}}>
                      <Mail size={14} /> {admin.email}
                    </div>
                  </td>
                  <td>{admin.phone || 'N/A'}</td>
                  <td>
                    <div className="flex gap-1">
                      <button 
                        className="btn btn-secondary" 
                        style={{padding: '0.5rem'}}
                        onClick={() => setEditingItem(admin)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn btn-error" 
                        style={{padding: '0.5rem'}}
                        onClick={() => handleDelete(admin._id, false)}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)'}}>
                    No administrators found. Create one to manage users.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Users Table */}
      <section>
        <h3 className="mt-1 mb-1 flex items-center gap-1">
          <Users size={20} color="var(--text-secondary)" /> 
          Platform Users ({allUsers.length})
        </h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User Detail</th>
                <th>Managed By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u) => {
                const managingAdmin = admins.find(a => a._id === u.createdBy);
                return (
                  <tr key={u._id}>
                    <td>
                      <div style={{fontWeight: 600}}>{u.name}</div>
                      <div className="flex flex-column gap-1 mt-1" style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
                        <div className="flex items-center gap-1"><Mail size={12} /> {u.email}</div>
                        {u.phone && <div className="flex items-center gap-1"><Phone size={12} /> {u.phone}</div>}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary" style={{fontSize: '0.75rem'}}>
                         Admin: {managingAdmin ? managingAdmin.name : 'Unknown/Unassigned'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button 
                          className="btn btn-secondary" 
                          style={{padding: '0.5rem'}}
                          onClick={() => setEditingItem(u)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn btn-error" 
                          style={{padding: '0.5rem'}}
                          onClick={() => handleDelete(u._id, true)}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {allUsers.length === 0 && (
                <tr>
                  <td colSpan="3" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)'}}>
                    No system users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal: Add Admin */}
      {showAddAdmin && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="flex justify-between items-center mb-1">
              <h3 className="flex items-center gap-1"><Shield size={20} color="var(--primary)" /> Delegate Admin</h3>
              <button className="btn btn-secondary" style={{padding: '0.5rem'}} onClick={() => setShowAddAdmin(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateAdmin}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>System Password</label>
                <input 
                  type="password" 
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  value={newAdmin.phone}
                  onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>
                Authorize Administrator
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add User */}
      {showAddUser && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="flex justify-between items-center mb-1">
              <h3 className="flex items-center gap-1"><UserPlus size={20} color="var(--primary)" /> Register New User</h3>
              <button className="btn btn-secondary" style={{padding: '0.5rem'}} onClick={() => setShowAddUser(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>User Name</label>
                <input 
                  type="text" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Assign Managing Admin</label>
                <select 
                  value={newUser.adminId} 
                  onChange={(e) => setNewUser({ ...newUser, adminId: e.target.value })}
                  required
                >
                  <option value="">Select an Administrator</option>
                  {admins.map(a => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>
                Register System User
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Member */}
      {editingItem && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="flex justify-between items-center mb-1">
              <h3>Edit {editingItem.role === 'admin' ? 'Admin' : 'User'} Details</h3>
              <button className="btn btn-secondary" style={{padding: '0.5rem'}} onClick={() => setEditingItem(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={editingItem.email}
                  onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  value={editingItem.phone || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>
                Save Platform Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
