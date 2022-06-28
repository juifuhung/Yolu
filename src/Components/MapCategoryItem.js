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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 80px;
  height: 110px;
  margin: 10px;
  cursor: pointer;

  @media (max-width: 340px) {
    height: 100px;
    margin: 0;
  }
`;

const CategoryWords = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 30px;
  background-color: red;
  color: white;

  @media (max-width: 340px) {
    font-size: 0.9rem;
    width: 70px;
  }
`;

const Icon = styled.div`
  width: 70px;
  height: 70px;
  background-image: url(${(props) => props.icon});
  background-size: 95%;
  background-repeat: no-repeat;
  background-position: center;

  @media (max-width: 340px) {
    width: 60px;
    height: 60px;
  }
`;

const MapCategoryItem = ({
  category,
  favorites,
  categoryHandler,
  getData,
  showFavoriteHandler,
}) => {
  return (
    <>
      <Container
        onClick={() => {
          category
            ? categoryHandler(`${category.title}`)
            : favorites
            ? showFavoriteHandler()
            : getData();
        }}
      >
        <Icon
          icon={
            category
              ? category.icon
              : favorites
              ? "https://img.onl/sa6Si"
              : "https://img.onl/M4U7Oy"
          }
        />
        <CategoryWords>
          {category ? category.title : favorites ? "顯示最愛" : "顯示全部"}
        </CategoryWords>
      </Container>
    </>
  );
};

export default MapCategoryItem;
