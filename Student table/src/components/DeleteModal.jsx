import React from 'react';

const DeleteModal = ({ onConfirm, onCancel }) => (
  <div className="modal">
    <div className="modal-content">
      <h3>Confirm Delete</h3>
      <p>Are you sure you want to delete this student?</p>
      <div className="modal-actions">
        <button onClick={onConfirm} className="btn-delete">Delete</button>
        <button onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </div>
  </div>
);

export default DeleteModal;
