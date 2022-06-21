import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  getFirestore,
  where,
  query,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import Div from "./Div";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

  const deleteHandler = async (id) => {
    await deleteDoc(doc(db, "Favorites", `${id}`));
  };

  useEffect(() => {
    getFavorites();
  }, []);

  async function getFavorites() {
    let favoritesArray = [];
    const querySnapshot = await getDocs(
      query(collection(db, "Favorites"), where("localId", "==", localId))
    );
    querySnapshot.forEach((doc) => {
      favoritesArray.push({ ...doc.data(), id: doc.id });
    });
    setFavorites(favoritesArray);
  }

  const categoryHandler = async (category) => {
    let categoryArray = [];
    const querySnapshot = await getDocs(
      query(collection(db, "Favorites"), where("category", "==", `${category}`))
    );
    querySnapshot.forEach((doc) => {
      categoryArray.push(doc.data());
    });
    setFavorites(categoryArray);
  };

  return (
    <div className="App">
      <Header />
      <p>{`hi ${displayName}`}</p>
      {console.log(
        favorites.forEach((item) => {
          console.log(item.created_time.seconds);
        })
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
