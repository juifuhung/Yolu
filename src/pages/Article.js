import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
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

const Article = () => {
  const [article, setArticle] = useState([]);
  const params = useParams();
  console.log(params.articleId);
  console.log(typeof params.articleId);

  console.log(article);

  const getArticles = async () => {
    const querySnapshot = await getDocs(
      query(
        collection(db, "Post"),
        where("tags", "array-contains", {
          state: true,
          title: `${params.articleId}`,
        })
      )
    );
    const articleArray = [];
    querySnapshot.forEach((doc) => {
      articleArray.push({ ...doc.data(), id: doc.id });
    });
    setArticle(articleArray);
  };

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <>
      <h1>Article</h1>
      {article.map((item) => {
        return (
          <ArticleItem
            key={item.title}
            title={item.title}
            content={item.content}
            created_time={item.created_time.seconds}
          />
        );
      })}
    </>
  );
};

export default Article;
