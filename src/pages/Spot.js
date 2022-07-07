import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SpotItem from "../components/SpotItem";

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

const BodyContainer = styled.div`
  width: 100%;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SpotsCover = styled.div`
  width: 100%;
  height: 250px;
  margin-bottom: 2rem;
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: top;
  position: relative;

  @media (max-width: 880px) {
    height: 200px;
  }

  @media (max-width: 420px) {
    height: 160px;
  }
`;

const SpotsCoverTitle = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SpotsCoverTitleWords = styled.h1`
  margin: 0;
  color: white;
  text-shadow: 5px 5px 4px black;
  font-weight: 800;
  font-size: 4.5rem;

  @media (max-width: 880px) {
    font-size: 3.5rem;
  }

  @media (max-width: 460px) {
    font-size: 2.5rem;
  }

  @media (max-width: 360px) {
    font-size: 2rem;
  }
`;

const ArticleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ViewAllCategoryButton = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: 2rem;
  background-color: #ff0000;
  color: white;
  border-radius: 2rem;
  width: 300px;
  height: 80px;
  margin-bottom: 2rem;
  box-shadow: 5px 5px 10px #808080;

  @media (max-width: 570px) {
    border-radius: 1.2rem;
    width: 220px;
    height: 60px;
    font-size: 1.5rem;
  }

  &:hover {
    box-shadow: 8px 8px 10px #808080;
  }
`;

const NoArticle = styled.div`
  margin-bottom: 2rem;
  font-size: 4rem;
  font-weight: 800;
`;

const Spot = () => {
  const [spot, setSpot] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState("");
  const params = useParams();

  const getArticles = async () => {
    const querySnapshot = await getDocs(
      query(
        collection(db, "Post"),
        where("fullTagArray", "array-contains", {
          state: true,
          title: `${params.spot}`,
        })
      )
    );
    const spotArray = [];
    querySnapshot.forEach((doc) => {
      spotArray.push({ ...doc.data(), id: doc.id });
    });
    setSpot(spotArray);
  };

  const getCoverPhoto = async () => {
    const docSnap = await getDoc(doc(db, "SpotsCoverPhoto", `${params.spot}`));
    setCoverPhoto(docSnap.data().image);
  };

  useEffect(() => {
    getArticles();
    getCoverPhoto();
  }, []);

  return (
    <>
      <FavoritesHeaderContainer>
        <Header />
      </FavoritesHeaderContainer>
      <BodyContainer>
        <SpotsCover image={coverPhoto}>
          <SpotsCoverTitle>
            <SpotsCoverTitleWords>{params.spot}</SpotsCoverTitleWords>
          </SpotsCoverTitle>
        </SpotsCover>
        <ArticleContainer>
          {spot.length === 0 ? (
            <NoArticle>無文章</NoArticle>
          ) : (
            spot.map((item) => {
              return (
                <SpotItem
                  key={item.title}
                  title={item.title}
                  content={item.content}
                  displayName={item.displayName}
                  created_time={item.created_time.toDate()}
                  id={item.id}
                />
              );
            })
          )}
        </ArticleContainer>
        <ViewAllCategoryButton to={"/articles"}>
          瀏覽所有文章
        </ViewAllCategoryButton>
      </BodyContainer>
      <Footer />
    </>
  );
};

export default Spot;
