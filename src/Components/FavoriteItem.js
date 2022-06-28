import React from "react";
import styled from "styled-components";
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

const FavoriteItemSection = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const FavoriteItem = styled.div`
  width: 90vw;
  min-height: 320px;
  border: solid black 1px;
  margin-bottom: 25px;
`;

const FavoriteItemTitle = styled.div`
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
`;

const FavoriteItemCategory = styled.div`
  margin-0;
  background-color:aqua;
  width:40%;
  font-weight:600;
`;

const FavoriteItemTimestamp = styled.div`
  margin: 0;
  backgorund-color: yellow;
  width: 45%;
  font-weight: 600;
`;

const FavoriteItemDescription = styled.div`
  font-size: 1.2rem;
`;

const FavoriteItemImage = styled.div`
  width: 780px;
  height: 500px;
  background-image: url(${(props) => props.img});
`;

const FavoriteItemDiv = (
  {
    id,
    title,
    description,
    img,
    category,
    timestamp,
    deleteHandler,
    getFavoritesWithPagination,
  },
  ref
) => {
  return (
    <>
      <FavoriteItemSection>
        <FavoriteItem ref={ref} id={id}>
          <FavoriteItemTitle>{title}</FavoriteItemTitle>
          <FavoriteItemCategory>{category}</FavoriteItemCategory>
          <FavoriteItemTimestamp>{`${timestamp.getFullYear()}年 ${timestamp.getMonth()}月 ${timestamp.getDate()}日 ${timestamp.getHours()}:${
            timestamp.getMinutes() === 0
              ? "00"
              : timestamp.getMinutes() < 10
              ? "0" + timestamp.getMinutes().toString()
              : timestamp.getMinutes().toString()
          }`}</FavoriteItemTimestamp>
          <FavoriteItemDescription>{description}</FavoriteItemDescription>
          <FavoriteItemImage img={img} alt="image" />
          <FaStar
            onClick={() => {
              deleteHandler(id, category);
              getFavoritesWithPagination();
              alert(`已將「${title}」移出最愛清單`);
            }}
          />
        </FavoriteItem>
      </FavoriteItemSection>
    </>
  );
};

const favoriteItemDiv = React.forwardRef(FavoriteItemDiv);

export default favoriteItemDiv;
