import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../utils/Firebase";
import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
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

const Tag = styled.div`
  width: 200px;
  height: 40px;
  font-size: 1rem;
  border: solid black 1px;

  background-color: ${(props) => (props.state ? "aqua" : "pink")};
`;

let localId;
let displayName;

const EditPost = () => {
  const [tagArray, setTagArray] = useState([]);
  const [articleData, setArticleData] = useState([]);
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredContent, setEnteredContent] = useState("");

  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  const getDisplayName = async (localId) => {
    console.log("getDisplayName");
    const docSnap = await getDoc(doc(db, "User", `${localId}`));
    displayName = docSnap.data().name;
  };

  const params = useParams();

  const getArticle = async () => {
    console.log("getArticle");
    const docSnap = await getDoc(doc(db, "Post", params.articleId));
    console.log("Document data:", docSnap.data());
    setArticleData(docSnap.data());
    setTagArray(docSnap.data().fullTagArray);
    setEnteredTitle(docSnap.data().title);
    setEnteredContent(docSnap.data().content);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await updateDoc(doc(db, "Post", params.articleId), {
        title: enteredTitle,
        content: enteredContent,
        fullTagArray: tagArray,
        created_time: new Date(),
        localId: localId,
        displayName: displayName,
      });
      setEnteredTitle("");
      setEnteredContent("");
    } catch (e) {
      console.log("error", e);
    }
  };

  const titleInputChangeHandler = (e) => {
    setEnteredTitle(e.target.value);
  };

  const contentInputChangeHandler = (e) => {
    setEnteredContent(e.target.value);
  };

  useEffect(() => {
    console.log("useEffect running");
    getArticle();
  }, []);

  useEffect(() => {
    getDisplayName(localId);
  }, [localId]);

  const chooseTagHandler = (index) => {
    console.log(index);
    const newTagArray = [...tagArray].map((item, i) => {
      if (i === index) {
        return { ...item, state: !item.state };
      } else {
        return item;
      }
    });
    console.log(newTagArray);
    setTagArray(newTagArray);
  };

  return (
    <>
      {console.log(articleData)}
      {console.log(articleData.fullTagArray)}
      <Header />
      <h1>Edit</h1>
      <p>{displayName}</p>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={enteredTitle}
          onChange={titleInputChangeHandler}
        />
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          value={enteredContent}
          onChange={contentInputChangeHandler}
        ></textarea>
        {tagArray.map((item, index) => {
          return (
            <Tag
              key={item.title}
              state={item.state}
              onClick={() => {
                chooseTagHandler(index);
              }}
            >
              {item.title}
            </Tag>
          );
        })}
        <button>更改</button>
      </form>
      <Footer />
    </>
  );
};

export default EditPost;
