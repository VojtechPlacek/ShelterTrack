import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Dashboard from "./pages/Dashboard";
import Animals from "./pages/Animals";
import Shelters from "./pages/Shelters";
import AnimalDetail from "./pages/AnimalDetail";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="animals" element={<Animals />} />
          <Route path="shelters" element={<Shelters />} />
          <Route path="animal/:id" element={<AnimalDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
