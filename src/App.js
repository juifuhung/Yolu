import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Homepage from "./pages/Homepage";
import { Font, UniversalStyle } from "./styles/styles";
import { useAuth } from "./utils/Firebase";
import Favorites from "./pages/Favorites";
import Map from "./pages/Map";
import Member from "./pages/Member";
import Article from "./pages/Article";
import AllArticles from "./pages/AllArticles";
import Spot from "./pages/Spot";
import NewPost from "./pages/NewPost";
import EditPost from "./pages/EditPost";

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
          <Route path="/map" element={<Map />} />
          <Route
            path={"/member"}
            element={localId ? <Navigate to="/favorites" /> : <Member />}
          />
          <Route path={"/articles"} element={<AllArticles />} />
          <Route path="/articles/:spot/" element={<Spot />} />
          <Route path="/article/:articleId" element={<Article />} />
          <Route
            path="new-post"
            element={localId ? <NewPost /> : <Navigate to="/member" />}
          />
          <Route path="edit/:articleId" element={<EditPost />} />
        </Routes>
      </Font>
    </>
  );
};

export default App;
