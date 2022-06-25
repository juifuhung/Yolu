import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Favorites from "./pages/Favorites";
import Map from "./pages/Map";
import Member from "./pages/Member";
import GlobalCSS from "./styles/styles";

const App = () => {
  const localId = window.localStorage.getItem("localId");

  return (
    <>
      <GlobalCSS />
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
    </>
  );
};

export default App;
