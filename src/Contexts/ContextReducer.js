import { useReducer, createContext, useContext } from "react";
import TaskReducer from "../Reducers/TaskReducer";

const ReducerContext = createContext([]);

export const ProviderReducer = ({ children }) => {
  const [tasks, dispatch] = useReducer(TaskReducer, []);
  return (
    <ReducerContext.Provider value={{tasks, dispatch}}>
      {children}
    </ReducerContext.Provider>
  );
};

export const useTasks = () => {
  return useContext(ReducerContext);
};
