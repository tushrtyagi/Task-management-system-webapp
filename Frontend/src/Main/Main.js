import React, { useState, useEffect } from "react";
import Board from "./Board";
import "./Main.css";
import TaskInputModal from "./TaskInputModal";
import BoardInputModal from "./BoardInputModal";

function MainSection() {
  const [taskLists, setTaskLists] = useState({});
  const [boardNames, setBoardNames] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedBoardForModal, setSelectedBoardForModal] = useState(null);
  const [isBoardModalOpen, setBoardModalOpen] = useState(false);

  // Function to open the modal for a specific board
  const openModalForBoard = (boardName) => {
    setSelectedBoardForModal(boardName);
    setModalOpen(true);
  };

  const openBoardModal = () => {
    setBoardModalOpen(true);
  };

  useEffect(() => {
    fetchDataFromApi()
      .then((data) => {
        const boardNames = Object.keys(data);
        setBoardNames(boardNames);
        setTaskLists(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const fetchDataFromApi = async () => {
    try {
      const query = `
        query {
          boards {
            name
            tasks
          }
        }
      `;

      const response = await fetch("http://localhost:3000/api/graph-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const { data } = await response.json();

      // Extract data and update state
      const boardsData = data.boards;
      const updatedTaskLists = {};

      boardsData.forEach((board) => {
        updatedTaskLists[board.name] = board.tasks;
      });

      return updatedTaskLists;
    } catch (error) {
      throw error;
    }
  };

  const [draggedTask, setDraggedTask] = useState(null);
  const [destinationBoard, setDestinationBoard] = useState(null);

  const handleDeleteBoard = (boardName) => {
    const updatedTaskLists = { ...taskLists };
    delete updatedTaskLists[boardName];
    setTaskLists(updatedTaskLists);
  
    // Remove the board name from the boardNames array
    const updatedBoardNames = boardNames.filter((name) => name !== boardName);
    setBoardNames(updatedBoardNames);
  };

  const handleEditTask = (boardName, oldTask, newTask) => {
    const updatedTasks = taskLists[boardName].map((task) => (task === oldTask ? newTask : task));
    setTaskLists((prevTaskLists) => ({
      ...prevTaskLists,
      [boardName]: updatedTasks,
    }));
  };
  const handleDragStart = (task, boardName) => {
    setDraggedTask(task);
    setDestinationBoard(boardName);
  };

  const handleDrop = (boardName) => {
    if (draggedTask && destinationBoard !== boardName) {
      const newSourceTasks = taskLists[destinationBoard].filter(
        (task) => task !== draggedTask
      );
      const newDestinationTasks = [...taskLists[boardName], draggedTask];

      setTaskLists((prevTaskLists) => ({
        ...prevTaskLists,
        [destinationBoard]: newSourceTasks,
        [boardName]: newDestinationTasks,
      }));

      setDraggedTask(null);
      setDestinationBoard(null);
    }
  };

  const handleAddTask = (boardName, newTask) => {
    if (newTask) {
      setTaskLists((prevTaskLists) => ({
        ...prevTaskLists,
        [boardName]: [...prevTaskLists[boardName], newTask],
      }));
    }
  };

  const handleAddBoard = (newBoardName) => {
    if (newBoardName && !boardNames.includes(newBoardName)) {
      setBoardNames((prevBoardNames) => [...prevBoardNames, newBoardName]);
      setTaskLists((prevTaskLists) => ({
        ...prevTaskLists,
        [newBoardName]: [],
      }));
      setBoardModalOpen(false);
    }
  };

  return (
    <div className="app">
      <div className="board-container">
      {boardNames.map((boardName) => (
  <Board
    key={boardName}
    title={boardName}
    tasks={taskLists[boardName]}
    onAddTask={() => openModalForBoard(boardName)}
    onDragStart={(task) => handleDragStart(task, boardName)}
    onDrop={() => handleDrop(boardName)}
    onDeleteBoard={() => handleDeleteBoard(boardName)} // Pass the delete board function
    onEditTask={(boardName, task) => {
      const newTask = prompt("Edit task:", task);
      if (newTask !== null) {
        handleEditTask(boardName, task, newTask);
      }
    }}
  />
))}
        <button className=" button add-board-button" onClick={() => openBoardModal()}>
          + Add Board
        </button>
      </div>
      <TaskInputModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAddTask={(newTaskTitle) =>
          handleAddTask(selectedBoardForModal, newTaskTitle)
        }
      />
      <BoardInputModal
        isOpen={isBoardModalOpen}
        onClose={() => setBoardModalOpen(false)}
        onAddBoard={(newBoardName) => handleAddBoard(newBoardName)}
      />
    </div>
  );
}

export default MainSection;
