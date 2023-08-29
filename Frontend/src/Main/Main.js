import React, { useState, useEffect } from "react";
import Board from "./Board";
import './Main.css';
import TaskInputModal from "./TaskInputModal";
import BoardInputModal from "./BoardInputModal";

function MainSection() {
  const [taskLists, setTaskLists] = useState({});
  const [boardNames, setBoardNames] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedBoardForModal, setSelectedBoardForModal] = useState(null);
  const [isBoardModalOpen, setBoardModalOpen] = useState(false);

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
      const response = await fetch("http://localhost:3000/tasklist");
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const [draggedTask, setDraggedTask] = useState(null);
  const [destinationBoard, setDestinationBoard] = useState(null);

  const handleDragStart = (task, boardName) => {
    setDraggedTask(task);
    setDestinationBoard(boardName);
  };

  const handleDrop = (boardName) => {
    if (draggedTask && destinationBoard !== boardName) {
      const newSourceTasks = taskLists[destinationBoard].filter(task => task !== draggedTask);
      const newDestinationTasks = [...taskLists[boardName], draggedTask];

      setTaskLists(prevTaskLists => ({
        ...prevTaskLists,
        [destinationBoard]: newSourceTasks,
        [boardName]: newDestinationTasks
      }));

      setDraggedTask(null);
      setDestinationBoard(null);
    }
  };

  const handleAddTask = (boardName, newTask) => {
    if (newTask) {
      setTaskLists(prevTaskLists => ({
        ...prevTaskLists,
        [boardName]: [...prevTaskLists[boardName], newTask]
      }));
    }
  };

  const handleAddBoard = (newBoardName) => {
    if (newBoardName && !boardNames.includes(newBoardName)) {
      setBoardNames(prevBoardNames => [...prevBoardNames, newBoardName]);
      setTaskLists(prevTaskLists => ({
        ...prevTaskLists,
        [newBoardName]: []
      }));
    }
  };

  

  // const openModalForBoard (boardName) => {
  //   setSelectedBoardForModal(boardName);
  //   setModalOpen(true);
  // };
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
          />
        ))}
        <button className="add-board-button" onClick={() => openBoardModal()}>
          CLICK HERE +
        </button>
      </div>
      <TaskInputModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAddTask={(newTaskTitle) => handleAddTask(selectedBoardForModal, newTaskTitle)}
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
