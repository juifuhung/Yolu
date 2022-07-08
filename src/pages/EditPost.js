import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const BodyContainer = styled.div`
  width: 100%;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainForm = styled.form`
  width: 65%;
  display: flex;
  flex-direction: column;

  @media (max-width: 970px) {
    width: 75%;
  }

  @media (max-width: 750px) {
    width: 80%;
  }
`;

const TitleInput = styled.input`
  width: 100%;
  font-size: 2.5rem;
  font-weight: 600;
  border: none;
  outline: none;
  margin-top: 2rem;

  @media (max-width: 570px) {
    font-size: 2.2rem;
  }

  @media (max-width: 400px) {
    font-size: 2rem;
  }
`;

const NameAndTime = styled.div`
  width: 100%;
  display: flex;
  color: #aaaaaa;

  @media (max-width: 570px) {
    flex-direction: column;
  }
`;

const DisplayNameAndDate = styled.p`
  margin: 0 1rem 0 0;
  font-size: 1rem;

  @media (max-width: 1300px) {
    font-size: 1rem;
  }

  @media (max-width: 570px) {
    font-size: 0.9rem;
    margin: 0.1rem 0;
  }

  @media (max-width: 360px) {
    font-size: 0.7rem;
  }
`;

const Content = styled.textarea`
  margin: 2rem 0;
  width: 100%;
  min-height: 40vh;
  font-size: 1.5rem;
  border: none;
  outline: none;
  resize: none;
  ::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 900px) {
    font-size: 1.2rem;
  }

  @media (max-width: 570px) {
    font-size: 1rem;
  }
`;

const TagTitle = styled.p`
  width: 100%;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1rem 0;
  color: #464646;
`;

const TagContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  height: auto;
`;

const Tag = styled.div`
  margin: 0.5rem 0;
  padding: 0 15px;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 40px;
  margin-right: 15px;

  cursor: pointer;

  &:hover {
    background-color: #949494;
    color: white;
  }

  @media (max-width: 355px) {
    height: 35px;
    font-size: 0.8rem;
  }

  background-color: ${(props) => (props.state ? "#949494" : "#ececec")};
  color: ${(props) => (props.state ? "white" : "black")};
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
`;

const SubmitButton = styled.button`
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
  border: none;
  cursor: pointer;

  @media (max-width: 570px) {
    border-radius: 1.2rem;
    width: 220px;
    height: 60px;
    font-size: 1.5rem;
  }
`;

let localId;

const EditPost = () => {
  const [tagArray, setTagArray] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredContent, setEnteredContent] = useState("");

  const navigate = useNavigate();

  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  const getDisplayName = async (localId) => {
    const docSnap = await getDoc(doc(db, "User", `${localId}`));
    setDisplayName(docSnap.data().name);
  };

  const params = useParams();

  const getArticle = async () => {
    const docSnap = await getDoc(doc(db, "Post", params.articleId));
    setTagArray(docSnap.data().fullTagArray);
    setEnteredTitle(docSnap.data().title);
    setEnteredContent(docSnap.data().content);
    setTimestamp(docSnap.data().created_time.toDate());
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

      navigate(`/article/${params.articleId}`);
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
    getArticle();
  }, []);

  useEffect(() => {
    getDisplayName(localId);
  }, [localId]);

  const chooseTagHandler = (index) => {
    const newTagArray = [...tagArray].map((item, i) => {
      if (i === index) {
        return { ...item, state: !item.state };
      } else {
        return item;
      }
    });
    setTagArray(newTagArray);
  };

  return (
    <>
      <Header />
      <BodyContainer>
        <MainForm onSubmit={handleFormSubmit}>
          <TitleInput
            type="text"
            value={enteredTitle}
            onChange={titleInputChangeHandler}
            maxlength="20"
            required
          />
          <NameAndTime>
            {!displayName && (
              <DisplayNameAndDate>Loading...</DisplayNameAndDate>
            )}
            <DisplayNameAndDate>{displayName}</DisplayNameAndDate>
            {timestamp && (
              <DisplayNameAndDate
                time={true}
              >{`最近更新：${timestamp.getFullYear()}年${
                timestamp.getMonth() + 1 < 10
                  ? "0" + (timestamp.getMonth() + 1).toString()
                  : (timestamp.getMonth() + 1).toString()
              }月${
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
              }`}</DisplayNameAndDate>
            )}
          </NameAndTime>
          <Content
            value={enteredContent}
            onChange={contentInputChangeHandler}
            required
            maxlength="5000"
          ></Content>
          <TagTitle>選擇標籤</TagTitle>
          <TagContainer>
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
          </TagContainer>
          <ButtonContainer>
            <SubmitButton>提交更改</SubmitButton>
          </ButtonContainer>
        </MainForm>
      </BodyContainer>
      <Footer />
    </>
  );
};

export default EditPost;
