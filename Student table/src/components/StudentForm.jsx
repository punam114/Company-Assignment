import React from 'react';

const StudentForm = ({ form, setForm, errors, editId, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="form">
    <h2>{editId ? 'Edit Student' : 'Add Student'}</h2>
    <div className="form-group">
      <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={errors.name ? 'error' : ''} />
      {errors.name && <span className="error-text">{errors.name}</span>}
    </div>
    <div className="form-group">
      <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={errors.email ? 'error' : ''} />
      {errors.email && <span className="error-text">{errors.email}</span>}
    </div>
    <div className="form-group">
      <input type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className={errors.age ? 'error' : ''} />
      {errors.age && <span className="error-text">{errors.age}</span>}
    </div>
    <div className="form-actions">
      <button type="submit" className="btn-primary">{editId ? 'Update' : 'Add'}</button>
      <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
    </div>
  </form>
);

export default StudentForm;
