import React, { useState } from "react";
import "./TaskInputModal.css";

function BoardInputModal({ isOpen, onClose, onAddBoard }) {
  const [newBoardName, setNewBoardName] = useState("");

  const handleBoardNameChange = (event) => {
    setNewBoardName(event.target.value);
  };

  const handleAddBoard = () => {
    if (newBoardName) {
      onAddBoard(newBoardName);
      setNewBoardName("");
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add New Board</h2>
        <input
          type="text"
          placeholder="Board name"
          value={newBoardName}
          onChange={handleBoardNameChange}
        />
        <button onClick={handleAddBoard}>Add Board</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default BoardInputModal;
