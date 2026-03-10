import { useState } from 'react';
import * as XLSX from 'xlsx';

const initialStudents = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 20 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 22 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 21 }
];

export const useStudents = () => {
  const [students, setStudents] = useState(initialStudents);
  const [form, setForm] = useState({ name: '', email: '', age: '' });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(form.email)) newErrors.email = 'Invalid email format';
    if (!form.age) newErrors.age = 'Age is required';
    else if (+form.age < 1 || +form.age > 150) newErrors.age = 'Age must be between 1 and 150';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const studentData = { ...form, age: +form.age };
      if (editId) {
        setStudents(students.map(s => s.id === editId ? { ...studentData, id: editId } : s));
      } else {
        setStudents([...students, { ...studentData, id: Date.now() }]);
      }
      resetForm();
      setLoading(false);
    }, 500);
  };

  const resetForm = () => {
    setForm({ name: '', email: '', age: '' });
    setEditId(null);
    setErrors({});
    setShowForm(false);
  };

  const handleEdit = (student) => {
    setForm({ name: student.name, email: student.email, age: student.age });
    setEditId(student.id);
    setShowForm(true);
  };

  const handleDelete = () => {
    setLoading(true);
    setTimeout(() => {
      setStudents(students.filter(s => s.id !== deleteId));
      setDeleteId(null);
      setLoading(false);
    }, 500);
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(students.map(({ id, ...rest }) => rest));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'students.xlsx');
  };

  return {
    students,
    form,
    setForm,
    editId,
    errors,
    showForm,
    setShowForm,
    deleteId,
    setDeleteId,
    loading,
    handleSubmit,
    resetForm,
    handleEdit,
    handleDelete,
    downloadExcel
  };
};
