import React from "react";
import "./Main"

function Board({ title, tasks, onAddTask, onDragStart, onDrop }) {
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = () => {
    onDrop();
  };

  return (
    <div
      className="board"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2>{title}</h2>
      <div className="tasks">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="task"
            draggable
            onDragStart={() => onDragStart(task, title)}
          >
            {task}
          </div>
        ))}
      </div>
      <button className="add-task-button" onClick={onAddTask}>
        + Add Task
      </button>
    </div>
  );
}

export default Board;
