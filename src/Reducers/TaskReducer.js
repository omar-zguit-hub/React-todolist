export default function TaskReducer(state, action) {
  switch (action.type) {
    case "EDITED": {
      const EditedTask = state.map((t) =>
        t.id === action.payload.ID
          ? { ...t, title: action.payload.titleNewTask }
          : t
      );
      localStorage.setItem("tasks", JSON.stringify(EditedTask));
      return EditedTask;
    }
    case "ADDED": {
      const AddedTask = {
        id: Date.now(),
        title: action.payload.titleNewTask,
        isCompleted: false,
      };

      const tasksAddedTask = [...state, AddedTask];

      localStorage.setItem("tasks", JSON.stringify(tasksAddedTask));
      return tasksAddedTask;
    }
    case "DELETED": {
      const deletedTask = state.filter((t) => t.id !== action.payload.ID);

      localStorage.setItem("tasks", JSON.stringify(deletedTask));
      return deletedTask;
    }
    case "CHECKED": {
      const updated = state.map((t) =>
        t.id === action.payload.id ? { ...t, isCompleted: !t.isCompleted } : t
      );
      localStorage.setItem("tasks", JSON.stringify(updated));
      return updated;
    }

    case "SET_TASKS": {
      const saved = JSON.parse(localStorage.getItem("tasks") || "[]");
      return saved;
    }

    default: {
      throw Error("Unknown Action" + action.type);
    }
  }
}
