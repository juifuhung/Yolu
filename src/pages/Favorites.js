import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Div from "../Components/Div";
import FavoritesCategoryDiv from "../Components/FavoritesCategoryDiv";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

initializeApp(firebaseConfig);
const db = getFirestore();

const WelcomeMessage = styled.div`
  display: flex;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  background-color: pink;
  padding: 1rem;
`;

const ButtonArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 150px;
`;

const App = () => {
  const [favorites, setFavorites] = useState([]);

  const localId = window.localStorage.getItem("localId");
  const displayName = window.localStorage.getItem("displayName");

  useEffect(() => {
    getFavorites();
  }, []);

  const deleteHandler = async (id) => {
    try {
      await deleteDoc(doc(db, "Favorites", `${id}`));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const categoryHandler = async (category) => {
    try {
      let categoryArray = [];
      const querySnapshot = await getDocs(
        query(
          collection(db, "Favorites"),
          where("category", "==", `${category}`)
        )
      );
      querySnapshot.forEach((doc) => {
        categoryArray.push(doc.data());
      });
      setFavorites(categoryArray);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  async function getFavorites() {
    try {
      let favoritesArray = [];
      const querySnapshot = await getDocs(
        query(collection(db, "Favorites"), where("localId", "==", localId))
      );
      querySnapshot.forEach((doc) => {
        favoritesArray.push({ ...doc.data(), id: doc.id });
      });
      setFavorites(favoritesArray);
    } catch (e) {
      console.error("Error getting favorite documents: ", e);
    }
  }

  return (
    <div className="App">
      <Header />
      <WelcomeMessage>{`hi ${displayName}`}</WelcomeMessage>
      {favorites &&
        favorites.map((item) => {
          return (
            <Div
              key={uuidv4()}
              id={item.id}
              title={item.title}
              description={item.description}
              img={item.photo}
              deleteHandler={deleteHandler}
              getFavorites={getFavorites}
            />
          );
        })}
      <ButtonArea>
        <FavoritesCategoryDiv
          category={"museum"}
          categoryHandler={categoryHandler}
          getFavorites={getFavorites}
        />
        <FavoritesCategoryDiv
          category={"nature"}
          categoryHandler={categoryHandler}
          getFavorites={getFavorites}
        />
        <FavoritesCategoryDiv
          category={"restaurant"}
          categoryHandler={categoryHandler}
          getFavorites={getFavorites}
        />
        <FavoritesCategoryDiv
          category={"christmas"}
          categoryHandler={categoryHandler}
          getFavorites={getFavorites}
        />
        <FavoritesCategoryDiv
          category={"shopping"}
          categoryHandler={categoryHandler}
          getFavorites={getFavorites}
        />
        <FavoritesCategoryDiv
          category={"transportation"}
          categoryHandler={categoryHandler}
          getFavorites={getFavorites}
        />
        <FavoritesCategoryDiv
          categoryHandler={categoryHandler}
          getFavorites={getFavorites}
        />
      </ButtonArea>
      <Footer />
    </div>
  );
};

export default App;
