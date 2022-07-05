import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, getDoc } from "firebase/firestore";

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
  const [article, setArticle] = useState({});
  const params = useParams();
  console.log(params);

  const getArticle = async () => {
    const docRef = doc(db, "Post", `${params.articleId}`);
    const docSnap = await getDoc(docRef);
    console.log("Document data:", docSnap.data());
    setArticle(docSnap.data());
  };

  useEffect(() => {
    getArticle();
  }, []);

  return (
    <>
      <h1>Article</h1>
      <p>{article.title}</p>
      <p>{article.content}</p>
      {article.tags.map((item) => {
        return <div>{item.title}</div>;
      })}
      {console.log(params.articleId)}
    </>
  );
};

export default Article;
