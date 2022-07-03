import React from "react";
import styled from "styled-components";
import loadingIcon from "../images/loading.gif";
import { FaHeart } from "react-icons/fa";
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
  width: 90%;
  display: flex;
  justify-content: flex-end;
`;

const FavoriteItem = styled.div`
  background-color: white;
  display: flex;
  align-items: center;
  width: 100%;
  height: 250px;
  border: solid black 4px;
  border-radius: 1rem;
  padding: 1.2rem;
  margin: 10px 0;
  position: relative;
`;

const FavoriteItemLeft = styled.div`
  width: 790px;
  height: 240px;
  background-image: url(${(props) => (props.img ? props.img : loadingIcon)});
  background-size: ${(props) => (props.img ? "cover" : "contain")};
  background-repeat: no-repeat;
  background-position: center;
`;

const FavoriteItemRight = styled.div`
  display: flex;
  flex-direction: column;
  width: 140%;
  height: 240px;
  align-items: start;
  padding: 0 20px 0;
  position: relative;
`;

const FavoriteItemTitle = styled.h2`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
`;

const FavoriteItemSubtitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
`;

const FavoriteItemDescription = styled.p`
  font-size: 1rem;
  font-weight: 500;
`;

const FavoriteItemCategory = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1400ff;
  border-radius: 1rem;
  color: white;
  width: 140px;
  height: 50px;
  font-size: 1.4rem;
  font-weight: 100;
  letter-spacing: 2px;
  box-shadow: 1px 2px 4px black;
  position: absolute;
  left: 20px;
  bottom: -10px;
`;

const FavoriteItemTimestamp = styled.div`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  bottom: 20px;
  right: 20px;
  margin: 0;
  backgorund-color: yellow;
  width: 45%;
  font-weight: 100;
`;

const Heart = styled(FaHeart)`
  color: #ff0000;
  position: absolute;
  height: 50px;
  width: 50px;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

const FavoriteItemDiv = (
  { id, title, subtitle, description, img, category, timestamp, deleteHandler },
  ref
) => {
  return (
    <>
      <FavoriteItemSection>
        <FavoriteItem ref={ref} id={id}>
          <FavoriteItemLeft img={img} alt="image" />
          <FavoriteItemRight>
            <FavoriteItemTitle>{title}</FavoriteItemTitle>
            <FavoriteItemSubtitle>{subtitle}</FavoriteItemSubtitle>
            <FavoriteItemDescription>{description}</FavoriteItemDescription>
            <FavoriteItemCategory>{category}</FavoriteItemCategory>
          </FavoriteItemRight>

          <FavoriteItemTimestamp>{`新增時間：${timestamp.getFullYear()}年 ${
            timestamp.getMonth() + 1 < 10
              ? "0" + timestamp.getMonth().toString()
              : timestamp.getMonth().toString()
          }月 ${
            timestamp.getDate() < 10
              ? "0" + timestamp.getDate().toString()
              : timestamp.getDate().toString()
          }日 ${
            timestamp.getHours() === 0
              ? "00"
              : timestamp.getHours() < 10
              ? "0" + timestamp.getHours().toString()
              : timestamp.getHours().toString()
          }:${
            timestamp.getMinutes() === 0
              ? "00"
              : timestamp.getMinutes() < 10
              ? "0" + timestamp.getMinutes().toString()
              : timestamp.getMinutes().toString()
          }`}</FavoriteItemTimestamp>

          <Heart
            onClick={() => {
              deleteHandler(id, category);
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
