import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import loadingIcon from "../images/loading.gif";
import { FaTrash } from "react-icons/fa";
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
  justify-content: flex-start;
`;

const FavoriteItem = styled.div`
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  width: 92%;
  height: 250px;
  color: black;
  border-radius: 1rem;
  padding: 1.2rem;
  margin: 10px 0;
  position: relative;

  &:hover {
    margin-top: 9px;
    margin-left: -5px;
    box-shadow: 3px 3px 4px #333333;
  }

  @media (max-width: 880px) {
    padding: 1.8rem 1.2rem;
    margin: 6px 0;
    height: 220px;
  }

  @media (max-width: 600px) {
    flex-direction: column-reverse;
    justify-content: start;
    align-items: flex-start;
  }
`;

const FavoriteItemLeft = styled(Link)`
  width: 790px;
  height: 240px;
  background-image: url(${(props) => (props.img ? props.img : loadingIcon)});
  background-size: ${(props) => (props.img ? "cover" : "contain")};
  background-repeat: no-repeat;
  background-position: center;
  position: relative;

  @media (max-width: 880px) {
    width: 711px;
    height: 216px;
  }

  @media (max-width: 600px) {
    margin-top: 15px;
    width: 240px;
    height: 140px;
  }
`;

const FavoriteItemRight = styled(Link)`
  display: flex;
  flex-direction: column;
  width: 140%;
  height: 240px;
  align-items: start;
  text-decoration: none;
  color: black;
  padding: 0 20px 0;

  @media (max-width: 600px) {
    padding: 0;
    width: 100%;
    height: 60px;
  }
`;

const FavoriteItemTitle = styled.h2`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;

  @media (max-width: 370px) {
    font-size: 1.4rem;
  }
`;

const FavoriteItemSubtitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 400;

  @media (max-width: 370px) {
    font-size: 0.9rem;
  }
`;

const FavoriteItemDescription = styled.p`
  font-size: 1rem;
  font-weight: 500;

  @media (max-width: 1100px) {
    font-size: 0.9rem;
  }

  @media (max-width: 950px) {
    font-size: 0.8rem;
  }

  @media (max-width: 600px) {
    display: none;
  }
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
  right: -160px;
  bottom: -10px;

  @media (max-width: 880px) {
    bottom: -16px;
  }

  @media (max-width: 510px) {
    right: -100px;
  }

  @media (max-width: 430px) {
    right: -70px;
  }

  @media (max-width: 410px) {
    right: -50px;
  }

  @media (max-width: 370px) {
    right: -30px;
  }

  @media (max-width: 350px) {
    right: -10px;
  }
`;

const FavoriteItemTimestamp = styled(Link)`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  bottom: 20px;
  right: 20px;
  margin: 0;
  backgorund-color: yellow;
  text-decoration: none;
  color: black;
  width: 45%;
  font-weight: 100;

  @media (max-width: 1100px) {
    display: none;
  }
`;

const Trash = styled(FaTrash)`
  color: #8e8e8e;
  position: absolute;
  height: 32px;
  width: 32px;
  top: 20px;
  right: 20px;
  cursor: pointer;

  &hover: {
    cursor: pointer;
  }

  @media (max-width: 900px) {
    height: 30px;
    width: 30px;
  }

  @media (max-width: 600px) {
    height: 25px;
    width: 25px;
    top: 32px;
    right: 22px;
  }

  @media (max-width: 410px) {
    height: 20px;
    width: 20px;
  }
`;

const FavoriteItemDiv = (
  { id, title, subtitle, description, img, category, timestamp, deleteHandler },
  ref
) => {
  return (
    <>
      <FavoriteItemSection>
        <FavoriteItem ref={ref} id={id} title={`查看「${title}」遊記頁面`}>
          <FavoriteItemLeft
            img={img}
            alt="Loading..."
            to={`/articles/${title}`}
          >
            <FavoriteItemCategory>{category}</FavoriteItemCategory>
          </FavoriteItemLeft>
          <FavoriteItemRight to={`/articles/${title}`}>
            <FavoriteItemTitle>{title}</FavoriteItemTitle>
            <FavoriteItemSubtitle>{subtitle}</FavoriteItemSubtitle>
            <FavoriteItemDescription>
              {description.length <= 100
                ? description
                : `${description.substring(0, 100)}...`}
            </FavoriteItemDescription>
          </FavoriteItemRight>

          <FavoriteItemTimestamp
            to={`/articles/${title}`}
          >{`新增時間：${timestamp.getFullYear()}年 ${
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

          <Trash
            title={"移出最愛清單"}
            onClick={() => {
              deleteHandler(id, category);
            }}
          />
        </FavoriteItem>
      </FavoriteItemSection>
    </>
  );
};

const favoriteItemDiv = React.forwardRef(FavoriteItemDiv);

export default favoriteItemDiv;
