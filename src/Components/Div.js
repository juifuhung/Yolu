import React from "react";
import { FaStar } from "react-icons/fa";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
getFirestore();

const Div = ({ id, title, description, img, deleteHandler, getFavorites }) => {
  return (
    <div>
      <div
        style={{ width: "400px", height: "200px", backgroundColor: "aqua" }}
        id={id}
      >
        <h1 style={{ margin: "0" }}>{title}</h1>
        <p>{description}</p>
        <img
          src={img}
          alt="image"
          style={{ width: "200px", height: "100px" }}
        />
        <FaStar
          onClick={() => {
            deleteHandler(id);
            getFavorites();
            alert(`removed ${title} from favorite list`);
          }}
        />
      </div>
    </div>
  );
};

export default Div;
