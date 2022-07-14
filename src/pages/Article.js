import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/Firebase";
import styled from "styled-components";
import { FaEdit, FaTrash } from "react-icons/fa";
import parse from "html-react-parser";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, getDoc, deleteDoc } from "firebase/firestore";
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

const BodyContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  font-size: 3rem;
  font-weight: 800;
  margin: 3rem 0 0 0;
`;

const Title = styled.div`
  max-width: 75%;
  font-size: 2.5rem;
  font-weight: 600;

  @media (max-width: 1110px) {
    max-width: 85%;
  }

  @media (max-width: 570px) {
    font-size: 2.5rem;
  }

  @media (max-width: 400px) {
    font-size: 2.2rem;
  }
`;

const EditAndDeleteSection = styled.div`
  display: flex;
`;

const EditOrDeleteEditSection = styled(Link)`
  display: flex;
  align-items: end;
  text-decoration: none;
  color: #616161;
  color: red;
  margin-left: 0.8rem;

  @media (max-width: 1110px) {
    margin-left: 0.3rem;
  }
`;

const EditIcon = styled(FaEdit)`
  width: 34px;
  height: 34px;
  color: #616161;
  margin-bottom: -2px;

  @media (max-width: 1300px) {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 720px) {
    width: 26px;
    height: 26px;
  }

  @media (max-width: 450px) {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 400px) {
    width: 22px;
    height: 22px;
  }
`;

const DeleteIcon = styled(FaTrash)`
  width: 26px;
  height: 26px;
  color: #616161;

  @media (max-width: 1300px) {
    width: 22px;
    height: 22px;
  }

  @media (max-width: 450px) {
    width: 18px;
    height: 18px;
  }
`;

const EditOrDeleteWords = styled.h3`
  margin: 0 0 0 0.2rem;
  font-size: 1.3rem;
  color: #616161;

  @media (max-width: 1300px) {
    font-size: 1rem;
  }

  @media (max-width: 1110px) {
    display: none;
  }
`;

const SpotItemAuthorAndTime = styled.div`
  width: 80%;
  display: flex;
  justify-content: start;
  margin-bottom: 1rem;

  @media (max-width: 570px) {
    flex-direction: column;
  }
`;

const SpotItemSubtitle = styled.p`
  font-size: 1rem;
  color: #3a3b3c;
  margin-left: ${(props) => (props.time ? "1.5rem" : "0")};

  @media (max-width: 1300px) {
    font-size: 0.9rem;
  }

  @media (max-width: 570px) {
    font-size: 0.6rem;
    margin: 0.1rem 0;
  }

  @media (max-width: 360px) {
    font-size: 0.4rem;
  }
`;

const Content = styled.div`
  width: 80%;
  min-height: 50vh;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  white-space: pre-line;

  @media (max-width: 570px) {
    font-size: 1rem;
  }

  img {
    max-width: 100%;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  margin-bottom: 2rem;

  @media (max-width: 570px) {
    margin-bottom: 1rem;
  }
`;

const Tag = styled(Link)`
  background-color: #ececec;
  color: black;
  font-size: 0.8rem;
  margin: 0.3rem 0;
  padding: 0 10px;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 35px;
  margin-right: 15px;
  cursor: pointer;

  &:hover {
    background-color: #949494;
    color: white;
  }

  @media (max-width: 355px) {
    height: 32px;
    font-size: 0.7rem;
  }
`;

const ViewAllCategoriesButton = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: 1.3rem;
  background-color: #ff0000;
  color: white;
  border-radius: 1rem;
  width: 180px;
  height: 55px;
  border: none;
  margin-bottom: 2rem;
  cursor: pointer;

  @media (max-width: 570px) {
    border-radius: 0.8rem;
    width: 120px;
    height: 45px;
    font-size: 1rem;
  }
`;

let localId;

const Article = () => {
  const [article, setArticle] = useState({});
  const [timestamp, setTimestamp] = useState();
  const params = useParams();
  const navigate = useNavigate();

  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  const getArticle = async () => {
    const docRef = doc(db, "Post", `${params.articleId}`);
    const docSnap = await getDoc(docRef);
    setArticle(docSnap.data());
    setTimestamp(docSnap.data().created_time.toDate());
  };

  useEffect(() => {
    window.scroll({ top: 0, behavior: "smooth" });
    getArticle();
  }, []);

  const deleteHandler = async () => {
    await deleteDoc(doc(db, "Post", `${params.articleId}`));
    alert("遊記已刪除");
    navigate(`/articles`);
  };

  return (
    <>
      <FavoritesHeaderContainer>
        <Header />
      </FavoritesHeaderContainer>
      <BodyContainer>
        {console.log(article.content)}
        <TitleSection>
          {article.title ? (
            <Title>{article.title}</Title>
          ) : (
            <Title>Loading...</Title>
          )}

          <EditAndDeleteSection>
            {article.localId === localId ? (
              <EditOrDeleteEditSection
                to={`/edit/${params.articleId}`}
                title={"編輯遊記"}
              >
                <EditIcon />
                <EditOrDeleteWords>編輯</EditOrDeleteWords>
              </EditOrDeleteEditSection>
            ) : null}
            {article.localId === localId ? (
              <EditOrDeleteEditSection
                to={`/edit/${params.articleId}`}
                onClick={deleteHandler}
                title={"刪除遊記"}
              >
                <DeleteIcon />
                <EditOrDeleteWords>刪除</EditOrDeleteWords>
              </EditOrDeleteEditSection>
            ) : null}
          </EditAndDeleteSection>
        </TitleSection>
        <SpotItemAuthorAndTime>
          {article.displayName ? (
            <SpotItemSubtitle>{`作者：${article.displayName}`}</SpotItemSubtitle>
          ) : (
            <SpotItemSubtitle>Loading...</SpotItemSubtitle>
          )}
          {}

          {timestamp && (
            <SpotItemSubtitle
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
            }`}</SpotItemSubtitle>
          )}
        </SpotItemAuthorAndTime>
        {!article.content && <Content>Loading...</Content>}
        <Content>{parse(`${article.content}`)}</Content>
        <TagContainer>
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
        </TagContainer>
        <ViewAllCategoriesButton to={"/articles"}>
          瀏覽所有遊記
        </ViewAllCategoriesButton>
      </BodyContainer>
      <Footer />
    </>
  );
};

export default Article;
