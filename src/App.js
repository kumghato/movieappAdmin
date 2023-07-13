
import "./App.css";
import Movies from "./Components/Movies";
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Login from "./Components/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Movies />} />
        </Routes>
      </BrowserRouter>


    </div>
  );
}

export default App;
