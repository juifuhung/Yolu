import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../utils/Firebase";
import styled from "styled-components";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, getDoc } from "firebase/firestore";
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

initializeApp(firebaseConfig);
const db = getFirestore();

const FavoritesHeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;
`;

const Tag = styled(Link)`
  width: 250px;
  height: 100px;
  margin: 0 2px;
  border: solid black 1px;
  color: black;
`;

const EditButton = styled(Link)`
  width: 200px;
  height: 100px;
  border: solid blue 2px;
  color: red;
`;

const ViewAllCategoryButton = styled(Link)`
  width: 300px;
  height: 100px;
  font-size: 1.2rem;
  border: solid red 1px;
  color: black;
`;

let localId;

const Article = () => {
  const [article, setArticle] = useState({});
  const params = useParams();

  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  const getArticle = async () => {
    const docRef = doc(db, "Post", `${params.articleId}`);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    setArticle(docSnap.data());
  };

  useEffect(() => {
    getArticle();
  }, []);

  return (
    <>
      <FavoritesHeaderContainer>
        <Header />
      </FavoritesHeaderContainer>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      {article.localId === localId ? (
        <EditButton to={`/edit/${params.articleId}`}>編輯</EditButton>
      ) : null}
      {article.fullTagArray &&
        article.fullTagArray.map((item) => {
          if (item.state === true) {
            return (
              <Tag to={`/articles/${item.title}`} key={item.title}>
                {item.title}
              </Tag>
            );
          }
        })}
      <ViewAllCategoryButton to={"/articles"}>
        瀏覽所有文章
      </ViewAllCategoryButton>
      <Footer />
    </>
  );
};

export default Article;
