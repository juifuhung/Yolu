import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ArticleItem from "../components/ArticleItem";

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

const FavoritesHeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;
`;

const Spot = () => {
  const [spot, setSpot] = useState([]);
  const params = useParams();

  const getArticles = async () => {
    const querySnapshot = await getDocs(
      query(
        collection(db, "Post"),
        where("tags", "array-contains", `${params.spot}`)
      )
    );
    const spotArray = [];
    querySnapshot.forEach((doc) => {
      spotArray.push({ ...doc.data(), id: doc.id });
    });
    setSpot(spotArray);
  };

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <>
      <FavoritesHeaderContainer>
        <Header />
      </FavoritesHeaderContainer>
      <h1>Spot 123</h1>
      {spot.map((item) => {
        return (
          <ArticleItem
            key={item.title}
            title={item.title}
            content={item.content}
            created_time={item.created_time.seconds}
            id={item.id}
          />
        );
      })}
      <Footer />
    </>
  );
};

export default Spot;
