import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Favorites from "./pages/Favorites";
import Map from "./pages/Map";
import Member from "./pages/Member";

function App() {
  const localId = window.localStorage.getItem("localId");

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/favorites"
          element={localId ? <Favorites /> : <Navigate to="/member" />}
        />
        <Route path="/map" element={<Map />} />
        <Route
          path={"/member"}
          element={localId ? <Navigate to="/" /> : <Member />}
        />
      </Routes>
    </div>
  );
}

export default App;
