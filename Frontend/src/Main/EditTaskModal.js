import React, { useState } from "react";
import "./TaskInputModal.css";

function EditTaskModal({ isOpen, onClose, onEditTask }) {
  const [editedTitle, setEditedTitle] = useState("");

  const handleSaveEdit = () => {
    if (editedTitle) {
      onEditTask(editedTitle); // Call the update function
      setEditedTitle("");
      onClose();
    }
  };

  const handleTitleChange = (event) => {
    setEditedTitle(event.target.value);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Task</h2>
        <input
          type="text"
          placeholder="Edited task title"
          value={editedTitle}
          onChange={handleTitleChange}
        />
        <button onClick={handleSaveEdit}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default EditTaskModal;
