import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Favorites from "./pages/Favorites";
import Map from "./pages/Map";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </div>
  );
}

export default App;
