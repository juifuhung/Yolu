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

const ItemQuantity = styled.div`
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100px;
  font-size: 1.5rem;
`;

const SortButtonArea = styled.div`
  display: flex;
  justify-content: center;
  height: 100px;
  width: 100vw;
`;

const SortButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
  margin-top: 0;
  margin-bottom: 0;
  width: 100px;
  height: 100px;
  font-size: 1rem;
  color: white;
  background-color: black;
  cursor: pointer;
  border-radius: 20%;
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

  const SortFromOldToNew = () => {
    const oldToNewArray = [...favorites].sort((a, b) => {
      return a.created_time.seconds - b.created_time.seconds;
    });
    setFavorites(oldToNewArray);
  };

  const SortFromNewToOld = () => {
    const newToOldArray = [...favorites].sort((a, b) => {
      return b.created_time.seconds - a.created_time.seconds;
    });
    setFavorites(newToOldArray);
  };

  const categoryArray = [
    "museum",
    "nature",
    "restaurant",
    "christmas",
    "shopping",
    "transportation",
  ];

  return (
    <div className="App">
      <Header />
      <WelcomeMessage>{`hi ${displayName}`}</WelcomeMessage>
      {favorites.length === 1 ? (
        <ItemQuantity>{`${favorites.length} item on the list`}</ItemQuantity>
      ) : favorites.length > 1 ? (
        <ItemQuantity>{`${favorites.length} items on the list`}</ItemQuantity>
      ) : (
        <ItemQuantity>No Item Found</ItemQuantity>
      )}
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
        {categoryArray.map((category) => (
          <FavoritesCategoryDiv
            key={category}
            category={category}
            categoryHandler={categoryHandler}
            getFavorites={getFavorites}
          />
        ))}
        <FavoritesCategoryDiv
          categoryHandler={categoryHandler}
          getFavorites={getFavorites}
        />
      </ButtonArea>
      <SortButtonArea>
        <SortButton onClick={SortFromOldToNew}>Sort from old to new</SortButton>
        <SortButton onClick={SortFromNewToOld}>Sort from new to old</SortButton>
      </SortButtonArea>
      <Footer />
    </div>
  );
};

export default App;
