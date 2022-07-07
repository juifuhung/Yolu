import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaEdit } from "react-icons/fa";
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

const BodyContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: solid red 0.5px;
`;

const TitleContainer = styled.div`
  height: 100px;
  width: 85%;
  background-color: pink;
  display: flex;
  margin: 2rem 0;
  justify-content: space-between;
  align-items: end;
  border: solid blue 1px;
`;

const Title = styled.div`
  width: 80%;
  border: solid green 1px;
  font-size: 3.5rem;
  font-weight: 800;
`;

const EditSection = styled(Link)`
  display: flex;
  align-items: end;
  border: solid 1px brown;
  height: auto;
  width: auto;
  text-decoration: none;
`;

const EditIcon = styled(FaEdit)`
  width: 50px;
  height: 50px;
  color: #616161;
`;

const EditWords = styled.h3`
  margin: 0 0 0 0.5rem;
  font-size: 2rem;
  color: #616161;
`;

const CategoryBlock = styled.div`
  width: 85%;
  height: 350px;
  border: solid black 1px;
  margin: 1rem;
`;

const CategoryRedLine = styled.div`
  width: 100%;
  height: 18px;
  margin: 0.7rem 0;
  background-color: #ff0000;
`;

const ItemSection = styled.div`
  width: 100%;
  height: 70%;
  display: flex;
  border: solid green 1px;
`;

const Label = styled.h2`
  margin: 0;
  font-size: 2rem;
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
      <BodyContainer>
        <TitleContainer>
          <Title>所有文章</Title>
          <EditSection to={"/new-post"}>
            <EditIcon />
            <EditWords>發表文章</EditWords>
          </EditSection>
        </TitleContainer>
        <CategoryBlock>
          <Label>博物館</Label>
          <CategoryRedLine />
          <ItemSection>
            {allSpots
              .filter((item) => item.category === "博物館")
              .map((item) => (
                <AllArticlesItem
                  key={item.title}
                  title={item.title}
                  image={item.image}
                />
              ))}
          </ItemSection>
        </CategoryBlock>
        <CategoryBlock>
          <Label>自然景觀</Label>
          <CategoryRedLine />
          <ItemSection>
            {allSpots
              .filter((item) => item.category === "自然景觀")
              .map((item) => (
                <AllArticlesItem
                  key={item.title}
                  title={item.title}
                  image={item.image}
                />
              ))}
          </ItemSection>
        </CategoryBlock>
        <CategoryBlock>
          <Label>餐廳</Label>
          <CategoryRedLine />
          <ItemSection>
            {allSpots
              .filter((item) => item.category === "餐廳")
              .map((item) => (
                <AllArticlesItem
                  key={item.title}
                  title={item.title}
                  image={item.image}
                />
              ))}
          </ItemSection>
        </CategoryBlock>
        <CategoryBlock>
          <Label>聖誕主題</Label>
          <CategoryRedLine />
          <ItemSection>
            {allSpots
              .filter((item) => item.category === "聖誕主題")
              .map((item) => (
                <AllArticlesItem
                  key={item.title}
                  title={item.title}
                  image={item.image}
                />
              ))}
          </ItemSection>
        </CategoryBlock>
        <CategoryBlock>
          <Label>購物</Label>
          <CategoryRedLine />
          <ItemSection>
            {allSpots
              .filter((item) => item.category === "購物")
              .map((item) => (
                <AllArticlesItem
                  key={item.title}
                  title={item.title}
                  image={item.image}
                />
              ))}
          </ItemSection>
        </CategoryBlock>
        <CategoryBlock>
          <Label>交通</Label>
          <CategoryRedLine />
          <ItemSection>
            {allSpots
              .filter((item) => item.category === "交通")
              .map((item) => (
                <AllArticlesItem
                  key={item.title}
                  title={item.title}
                  image={item.image}
                />
              ))}
          </ItemSection>
        </CategoryBlock>
      </BodyContainer>
      <Footer />
    </>
  );
};

export default AllArticles;
