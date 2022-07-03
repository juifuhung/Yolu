import React from "react";
import { initializeApp } from "firebase/app";
import styled from "styled-components";
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

const CategoryButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110px;
  height: 50px;
  margin: 2px;
  font-size: 1.1rem;
  border-radius: 1rem;
  background-color: red;
  cursor: pointer;
  color: white;

  @media (max-width: 510px) {
    border-radius: 0.8rem;
    width: 90px;
    height: 40px;
    margin: 1.5px;
    font-size: 0.9rem;
  }

  @media (max-width: 420px) {
    border-radius: 0.5rem;
    width: 80px;
    height: 30px;
    margin: 1px;
    font-size: 0.8rem;
  }

  &:hover {
    background-color: #c30010;
  }
`;

const localId = window.localStorage.getItem("localId");

const FavoritesCategory = ({
  category,
  getFavoritesWithPagination,
  getTotalFavorites,
}) => {
  return (
    <>
      <CategoryButton
        onClick={() => {
          getTotalFavorites(localId, `${category}`);
          category
            ? getFavoritesWithPagination(localId, `${category}`)
            : getFavoritesWithPagination(localId);
        }}
      >
        {category ? category : "顯示全部"}
      </CategoryButton>
    </>
  );
};

export default FavoritesCategory;
