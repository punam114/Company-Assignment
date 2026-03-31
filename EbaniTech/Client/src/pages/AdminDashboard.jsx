import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { LogOut, UserPlus, Trash, Edit, User, Mail, Phone, X, Users } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', phone: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch your delegated users');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/user', newUser);
      toast.success('Team member registered successfully!');
      setNewUser({ name: '', email: '', password: '', phone: '' });
      setShowAddModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add user');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/user/${editingUser._id}`, editingUser);
      toast.success('User updated');
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/user/${id}`);
      toast.success('User deleted from your team');
      fetchUsers();
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  return (
    <div className="container" style={{maxWidth: '1100px'}}>
      {/* Header */}
      <header className="flex justify-between items-center mb-1">
        <div>
          <h1 className="flex items-center gap-1">
            <Users size={32} color="var(--primary)" /> 
            Team Management
          </h1>
          <p>Admin Control Panel • {user?.name}</p>
        </div>
        <button className="btn btn-secondary" onClick={logout}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Main Action */}
      <div style={{ marginBottom: '2rem' }}>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <UserPlus size={18} /> Register New Member
        </button>
      </div>

      {/* Users Table */}
      <section>
        <h3 className="mb-1">Your Managed Users</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Profile</th>
                <th>Contact info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="flex items-center gap-1">
                      <div className="glass" style={{padding: '0.5rem', borderRadius: '50%', display: 'flex'}}>
                        <User size={18} color="var(--primary)" />
                      </div>
                      <div style={{fontWeight: 600}}>{u.name}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
                       <div className="flex items-center gap-1"><Mail size={12} /> {u.email}</div>
                       {u.phone && <div className="flex items-center gap-1 mt-1"><Phone size={12} /> {u.phone}</div>}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button 
                        className="btn btn-secondary" 
                        style={{padding: '0.5rem'}}
                        onClick={() => setEditingUser(u)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn btn-error" 
                        style={{padding: '0.5rem'}}
                        onClick={() => handleDeleteUser(u._id)}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="3" style={{textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)'}}>
                    No users under your management yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal: Add User */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="flex justify-between items-center mb-1">
              <h3>Register New Member</h3>
              <button className="btn btn-secondary" style={{padding: '0.5rem'}} onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Initial Password</label>
                <input 
                  type="password" 
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone (Optional)</label>
                <input 
                  type="text" 
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>
                Authorize Member
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit User */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="flex justify-between items-center mb-1">
              <h3>Update Member Details</h3>
              <button className="btn btn-secondary" style={{padding: '0.5rem'}} onClick={() => setEditingUser(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email (Non-Editable)</label>
                <input 
                  type="email" 
                  value={editingUser.email}
                  disabled
                  style={{opacity: 0.6}}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="text" 
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>
                Update Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
