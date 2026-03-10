import React from 'react';

const StudentTable = ({ students, onEdit, onDelete }) => (
  <table className="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Age</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {students.length === 0 ? (
        <tr><td colSpan="4" className="empty">No students found</td></tr>
      ) : (
        students.map(student => (
          <tr key={student.id}>
            <td>{student.name}</td>
            <td>{student.email}</td>
            <td>{student.age}</td>
            <td>
              <button onClick={() => onEdit(student)} className="btn-edit">Edit</button>
              <button onClick={() => onDelete(student.id)} className="btn-delete">Delete</button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);

export default StudentTable;
