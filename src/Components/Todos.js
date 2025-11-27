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
import { useEffect, useMemo, useReducer, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import TaskReducer from "../Reducers/TaskReducer";
export default function Todos() {

  // useReducer
  const [tasks, dispatch] = useReducer(TaskReducer, []);

  const [switchTab, setSwitchTab] = useState(0);
  const [newTask, setNewTask] = useState("");
  const [IdSelected, setIdSelected] = useState(null);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // -------- LOAD FROM LOCAL STORAGE --------
  useEffect(() => {
    dispatch({
      type: "SET_TASKS",
    });
  }, []);

  // ------ // Toggle Snackbar visibility with delay --------
  function handleShowAndCloseSnackBar() {
    setShowSnackbar(true);
    setTimeout(() => {
      setShowSnackbar(false);
    }, 1333);
  }

  // -------- CLOSE MODAL --------
  function handleClose() {
    setShowModal(false);
    setIdSelected(null);
  }

  // -------- ADD & EDIT TASK --------
  function handleAddTask() {
    // EDIT MODE
    if (IdSelected !== null) {
      dispatch({
        type: "EDITED",
        payload: {
          ID: IdSelected,
          titleNewTask: newTask,
        },
      });

      setSnackBarMessage("Task Edited");
      handleShowAndCloseSnackBar();
    }
    // ADD MODE
    else {
      dispatch({
        type: "ADDED",
        payload: {
          titleNewTask: newTask,
        },
      });
      setSnackBarMessage("Task Added");
      handleShowAndCloseSnackBar();
    }
    setNewTask("");
    setIdSelected(null);
    setSwitchTab(0);
  }

  // -------- DELETE TASK --------
  function handleDeleteClick() {
    dispatch({
      type: "DELETED",
      payload: {
        ID: IdSelected,
      },
    });
    setShowModal(false);
    setSnackBarMessage("Task Deleted");
    setIdSelected(null);
    handleShowAndCloseSnackBar();
  }

  // -------- EDIT TASK --------
  function handleEditClick(id) {
    const Task = tasks.find((t) => t.id === id);

    if (Task) {
      setNewTask(Task.title);
      setIdSelected(id);
    }
  }

  // -------- TOGGLE COMPLETE/INCOMPLETE --------
  function handleCheckClick(id) {
    dispatch({
      type: "CHECKED",
      payload: { id: id },
    });
    const clicked = tasks.find((t) => t.id === id);
    setSnackBarMessage(
      clicked.isCompleted ? "Task Incompleted" : "Task Completed"
    );
    handleShowAndCloseSnackBar();
  }

  // -------- FILTER --------
  const Filteredtasks = useMemo(() => {
    if (switchTab === 1) return tasks.filter((t) => !t.isCompleted);
    if (switchTab === 2) return tasks.filter((t) => t.isCompleted);
    return tasks;
  }, [switchTab, tasks]);

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
            {Filteredtasks.map((task) => (
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
