import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Homepage from "./pages/Homepage";
import Favorites from "./pages/Favorites";
import Map from "./pages/Map";
import Member from "./pages/Member";
import { useAuth } from "./utils/Firebase";
import { Font, UniversalStyle } from "./styles/styles";

let localId;

const App = () => {
  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  return (
    <>
      <Font>
        <UniversalStyle />
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Homepage />} />
          <Route
            path="/favorites"
            element={localId ? <Favorites /> : <Navigate to="/member" />}
          />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/map" element={<Map />} />
          <Route
            path={"/member"}
            element={localId ? <Navigate to="/" /> : <Member />}
          />
        </Routes>
      </Font>
    </>
  );
};

export default App;
