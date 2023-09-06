import React from "react";
import "./Main.css"; // Corrected the import path

function Board({ title, tasks, onAddTask, onDragStart, onDrop, onDeleteBoard, onEditTask, editedTaskTitle }) {
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = () => {
    onDrop();
  };

  // Ensure tasks is an array or provide a default empty array
  const taskItems = Array.isArray(tasks) ? tasks : [];

  return (
    <div className="board" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="board-header">
       {/* <h2>{title}</h2> */}
        <h2>
          {editedTaskTitle !== null && editedTaskTitle !== undefined
            ? editedTaskTitle // Use the edited title if available
            : title // Use the original title
          }
        </h2>
        <button className="button delete-board-button" onClick={() => onDeleteBoard(title)}>
          Delete
        </button>
      </div>
      <div className="tasks">
        {taskItems.map((task, index) => (
          <div key={index} className="task" draggable onDragStart={() => onDragStart(task, title)}>
            {task}
            <button className="button edit-task-button" onClick={() => onEditTask(title, task)}>
              Edit
            </button>
          </div>
        ))}
      </div>
      <button className="button add-task-button" onClick={onAddTask}>
        + Add Task
      </button>
    </div>
  );

}

export default Board;
