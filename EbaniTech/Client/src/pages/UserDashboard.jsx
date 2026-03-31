import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { LogOut, Plus, Trash, Edit, BookOpen, Clock, X, Save } from 'lucide-react';

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/user/notes');
      setNotes(response.data);
    } catch (error) {
      toast.error('Failed to load your notes');
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      await api.post('/user/note', newNote);
      toast.success('New note added to your collection');
      setNewNote({ title: '', content: '' });
      setShowAddModal(false);
      fetchNotes();
    } catch (error) {
      toast.error('Failed to save note');
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/user/note/${editingNote._id}`, editingNote);
      toast.success('Note updated');
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Delete this note permanent?')) return;
    try {
      await api.delete(`/user/note/${id}`);
      toast.success('Note removed');
      fetchNotes();
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  return (
    <div className="container" style={{maxWidth: '1000px'}}>
      {/* Header */}
      <header className="flex justify-between items-center mb-1">
        <div>
          <h1 className="flex items-center gap-1">
            <BookOpen size={32} color="var(--primary)" /> 
            My Workspace
          </h1>
          <p>Personal Notes • Welcome back, {user?.name}</p>
        </div>
        <button className="btn btn-secondary" onClick={logout}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Action Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Create New Note
        </button>
      </div>

      {/* Notes Grid */}
      <section className="dashboard-grid">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div key={note._id} className="glass card flex flex-column h-full">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-1" style={{color: 'var(--primary)'}}>
                  <Clock size={14} />
                  <span style={{fontSize: '0.75rem', fontWeight: 500}}>
                    {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button 
                    className="btn btn-secondary" 
                    style={{padding: '0.4rem'}} 
                    onClick={() => setEditingNote(note)}
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    className="btn btn-error" 
                    style={{padding: '0.4rem'}} 
                    onClick={() => handleDeleteNote(note._id)}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
              <h3 className="mb-1" style={{fontSize: '1.25rem'}}>{note.title}</h3>
              <p style={{flex: 1, whiteSpace: 'pre-wrap', marginBottom: '1rem'}}>{note.content}</p>
            </div>
          ))
        ) : (
          <div className="glass card text-center" style={{gridColumn: '1/-1', padding: '4rem'}}>
            <BookOpen size={48} style={{margin: '0 auto 1rem', opacity: 0.2}} />
            <h3>Your collection is empty</h3>
            <p>Start your journey by creating your first note.</p>
          </div>
        )}
      </section>

      {/* Modal: Add Note */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="flex justify-between items-center mb-1">
              <h3>Compose Note</h3>
              <button className="btn btn-secondary" style={{padding: '0.5rem'}} onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateNote}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  placeholder="What's on your mind?"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea 
                  rows="6"
                  placeholder="Start writing..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>
                <Save size={18} /> Save Note
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Note */}
      {editingNote && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="flex justify-between items-center mb-1">
              <h3>Edit Note</h3>
              <button className="btn btn-secondary" style={{padding: '0.5rem'}} onClick={() => setEditingNote(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateNote}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea 
                  rows="8"
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>
                <Save size={18} /> Update Note
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
