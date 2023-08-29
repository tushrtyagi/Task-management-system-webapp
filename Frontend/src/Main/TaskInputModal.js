import React, { useState } from "react";
import "./TaskInputModal.css";
function TaskInputModal({ isOpen, onClose, onAddTask }) {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleTaskTitleChange = (event) => {
    setNewTaskTitle(event.target.value);
  };

  const handleAddTask = () => {
    onAddTask(newTaskTitle);
    setNewTaskTitle("");
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add New Task</h2>
        <input
          type="text"
          placeholder="Task title"
          value={newTaskTitle}
          onChange={handleTaskTitleChange}
        />
        <button onClick={handleAddTask}>Add Task</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default TaskInputModal;
