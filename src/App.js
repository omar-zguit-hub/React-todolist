import "./App.css";
import Todos from "./Components/Todos";
import { ProviderReducer } from "./Contexts/ContextReducer";
function App() {
  return (
    <div className="App">
      <ProviderReducer>
        <Todos />
      </ProviderReducer>
    </div>
  );
}

export default App;
