import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import AllArticlesItem from "../components/AllArticlesItem";
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

const CategoryBlock = styled.div`
  width: 100%;
  height: 200px;
  border: solid black 1rem;
  margin: 2rem 0;
`;

const Label = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const NewPostLink = styled(Link)`
  width: 500px;
  height: 200px;
  background-color: blue;
`;

initializeApp(firebaseConfig);
const db = getFirestore();

const AllArticles = () => {
  const [allSpots, setAllSpots] = useState([]);

  const getData = async () => {
    try {
      let allSpotsArray = [];
      const querySnapshot = await getDocs(collection(db, "Spots"));
      querySnapshot.forEach((doc) => {
        allSpotsArray.push(doc.data());
      });
      setAllSpots(allSpotsArray);
    } catch (e) {
      console.error("Error getting document: ", e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Header />
      AllArticles
      <CategoryBlock>
        <Label>博物館</Label>
        {allSpots
          .filter((item) => item.category === "博物館")
          .map((item) => (
            <AllArticlesItem key={item.title} title={item.title} />
          ))}
      </CategoryBlock>
      <CategoryBlock>
        <Label>自然景觀</Label>
        {allSpots
          .filter((item) => item.category === "自然景觀")
          .map((item) => (
            <AllArticlesItem key={item.title} title={item.title} />
          ))}
      </CategoryBlock>
      <CategoryBlock>
        <Label>餐廳</Label>
        {allSpots
          .filter((item) => item.category === "餐廳")
          .map((item) => (
            <AllArticlesItem key={item.title} title={item.title} />
          ))}
      </CategoryBlock>
      <CategoryBlock>
        <Label>聖誕主題</Label>
        {allSpots
          .filter((item) => item.category === "聖誕主題")
          .map((item) => (
            <AllArticlesItem key={item.title} title={item.title} />
          ))}
      </CategoryBlock>
      <CategoryBlock>
        <Label>購物</Label>
        {allSpots
          .filter((item) => item.category === "購物")
          .map((item) => (
            <AllArticlesItem key={item.title} title={item.title} />
          ))}
      </CategoryBlock>
      <CategoryBlock>
        <Label>交通</Label>
        {allSpots
          .filter((item) => item.category === "交通")
          .map((item) => (
            <AllArticlesItem key={item.title} title={item.title} />
          ))}
      </CategoryBlock>
      <NewPostLink to="/new-post">寫新遊記</NewPostLink>
      <Footer />
    </>
  );
};

export default AllArticles;
