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
import Div from "../Components/Div";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

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
      <p>paragraph</p>
      <p>{`hi ${displayName}`}</p>
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
      <button
        onClick={() => {
          categoryHandler("museum");
        }}
      >
        museum
      </button>
      <button
        onClick={() => {
          categoryHandler("nature");
        }}
      >
        nature
      </button>
      <button
        onClick={() => {
          categoryHandler("restaurant");
        }}
      >
        restaurant
      </button>
      <button
        onClick={() => {
          categoryHandler("christmas");
        }}
      >
        christmas
      </button>
      <button
        onClick={() => {
          categoryHandler("shopping");
        }}
      >
        shopping
      </button>
      <button
        onClick={() => {
          categoryHandler("transportation");
        }}
      >
        transportation
      </button>
      <button
        onClick={() => {
          getFavorites();
        }}
      >
        show all
      </button>
      <Footer />
    </div>
  );
};

export default App;
