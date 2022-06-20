import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Favorites from "./pages/Favorites";
import Map from "./pages/Map";
import Member from "./pages/Member";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/map" element={<Map />} />
        <Route
          path={"/member"}
          element={token ? <Navigate to="/" /> : <Member />}
        />
      </Routes>
    </div>
  );
}

export default App;
