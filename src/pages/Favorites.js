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
      favoritesArray.push(doc.data());
    });
    setFavorites(favoritesArray);
  }

  return (
    <div className="App">
      <p>paragraph</p>
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
    </div>
  );
};

export default App;
