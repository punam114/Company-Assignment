import React from 'react';
import { useStudents } from './hooks/useStudents';
import StudentForm from './components/StudentForm.jsx';
import StudentTable from './components/StudentTable.jsx';
import DeleteModal from './components/DeleteModal.jsx';
import Loading from './components/Loading.jsx';
import './App.css';

function App() {
  const { students, form, setForm, editId, errors, showForm, setShowForm, deleteId, setDeleteId, loading, handleSubmit, resetForm, handleEdit, handleDelete, downloadExcel } = useStudents();

  return (
    <div className="app">
      {loading && <Loading />}
      <div className="container">
        <h1>Students Table</h1>
        <div className="actions">
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">{showForm ? 'Cancel' : 'Add Student'}</button>
          <button onClick={downloadExcel} className="btn-secondary" disabled={!students.length}>Download Excel</button>
        </div>
        {showForm && <StudentForm form={form} setForm={setForm} errors={errors} editId={editId} onSubmit={handleSubmit} onCancel={resetForm} />}
        <StudentTable students={students} onEdit={handleEdit} onDelete={setDeleteId} />
      </div>
      {deleteId && <DeleteModal onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}

export default App;
