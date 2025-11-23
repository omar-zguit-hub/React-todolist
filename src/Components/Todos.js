import {
  Alert,
  AppBar,
  Box,
  Modal,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  Tooltip,
} from "@mui/material";

import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useMemo, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function Todos() {
  const [switchTab, setSwitchTab] = useState(0);
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [IdSelected, setIdSelected] = useState(null);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // -------- LOAD FROM LOCAL STORAGE --------
  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("todos") || "[]");
    if (storage.length > 0) {
      setTodos(storage);
    }
  }, []);

  // -------- CLOSE MODAL --------
  function handleClose() {
    setShowModal(false);
    setShowSnackbar(false);
    setIdSelected(null);
  }

  // -------- ADD & EDIT TASK --------
  function handleAddTask() {
    // EDIT MODE
    if (IdSelected !== null) {
      const EditedTask = todos.map((t) =>
        t.id === IdSelected ? { ...t, title: newTask } : t
      );

      setTodos(EditedTask);
      localStorage.setItem("todos", JSON.stringify(EditedTask));
      setSnackBarMessage("Task Edited");
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 1333);
    }
    // ADD MODE
    else {
      const AddedTask = {
        id: Date.now(),
        title: newTask,
        isCompleted: false,
      };

      const todosAddedTask = [...todos, AddedTask];

      setTodos(todosAddedTask);
      localStorage.setItem("todos", JSON.stringify(todosAddedTask));
      setSnackBarMessage("Task Added");
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 1333);
    }

    setNewTask("");
    setIdSelected(null);
    setSwitchTab(0);
    setShowSnackbar(true);
  }

  // -------- DELETE TASK --------
  function handleDeleteClick() {
    const deletedTask = todos.filter((t) => t.id !== IdSelected);

    setTodos(deletedTask);
    localStorage.setItem("todos", JSON.stringify(deletedTask));

    setShowModal(false);
    setShowSnackbar(true);
    setSnackBarMessage("Task Deleted");
    setIdSelected(null);
    setShowSnackbar(true);
    setTimeout(() => {
      setShowSnackbar(false);
    }, 1333);
  }

  // -------- EDIT TASK --------
  function handleEditClick(id) {
    const Task = todos.find((t) => t.id === id);

    if (Task) {
      setNewTask(Task.title);
      setIdSelected(id);
    }
  }

  // -------- TOGGLE COMPLETE/INCOMPLETE --------
  function handleCheckClick(id) {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    );

    const clicked = updated.find((t) => t.id === id);

    setTodos(updated);
    localStorage.setItem("todos", JSON.stringify(updated));

    setShowSnackbar(true);
    setSnackBarMessage(
      clicked.isCompleted ? "Task Incompleted" : "Task Completed"
    );
    setShowSnackbar(true);
    setTimeout(() => {
      setShowSnackbar(false);
    }, 1333);
  }

  // -------- FILTER --------
  const FilteredTodos = useMemo(() => {
    if (switchTab === 1) return todos.filter((t) => !t.isCompleted);
    if (switchTab === 2) return todos.filter((t) => t.isCompleted);
    return todos;
  }, [switchTab, todos]);

  return (
    <>
      <Container maxWidth="sm" id="container">
        <Box id="boxBody">
          <AppBar position="static" id="appbar">
            <Toolbar variant="dense">
              <IconButton color="inherit">
                <MenuIcon />
              </IconButton>

              <Typography variant="h5">My Todo List</Typography>
            </Toolbar>
          </AppBar>

          <Tabs
            centered
            value={switchTab}
            onChange={(e, newTab) => setSwitchTab(newTab)}
            id="tabs"
          >
            <Tab label="All tasks" />
            <Tab label="Incomplete" />
            <Tab label="Completed" />
          </Tabs>

          <List sx={{ flex: 1, overflowY: "auto", margin: "20px" }}>
            {FilteredTodos.map((task) => (
              <ListItem key={task.id} id="listItem">
                <ListItemText
                  primary={task.title}
                  sx={{
                    textDecoration: task.isCompleted ? "line-through" : "none",
                  }}
                />
                <Tooltip title="Delete Task" arrow>
                  <DeleteIcon
                    id="DeleteIcon"
                    onClick={() => {
                      setIdSelected(task.id);
                      setShowModal(true);
                    }}
                  />
                </Tooltip>
                <Tooltip title="Edit Task" arrow>
                  <EditIcon
                    id="EditIcon"
                    onClick={() => handleEditClick(task.id)}
                  />
                </Tooltip>

                <Tooltip
                  title={
                    task.isCompleted ? "Mark as Incomplete" : "Mark as Complete"
                  }
                  arrow
                >
                  <CheckCircleIcon
                    id="CheckCircleIcon"
                    onClick={() => handleCheckClick(task.id)}
                    sx={{
                      cursor: "pointer",
                      color: task.isCompleted ? "#2dce00be" : "grey",
                      padding: "5px",
                    }}
                  />
                </Tooltip>
              </ListItem>
            ))}
          </List>

          <Box id="boxText">
            <TextField
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              size="small"
              fullWidth
              label="Add new task"
            />

            <Button
              disabled={!newTask.trim()}
              onClick={handleAddTask}
              variant="contained"
            >
              {IdSelected ? "Save" : "Add"}
            </Button>
          </Box>
        </Box>
      </Container>

      {/* SNACKBAR */}
      <Snackbar open={showSnackbar} autoHideDuration={1500}>
        <Alert severity="success" variant="filled" id="SnakBarAlert">
          {snackBarMessage}
        </Alert>
      </Snackbar>

      {/* MODAL */}
      <Modal open={showModal} onClose={handleClose}>
        <Box id="modalNox">
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to delete this task?
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "end" }}>
            <Button
              color="error"
              variant="contained"
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
