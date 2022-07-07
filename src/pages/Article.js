import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/Firebase";
import styled from "styled-components";
import { FaEdit, FaTrash } from "react-icons/fa";
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
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  font-size: 3rem;
  font-weight: 800;
  margin: 3rem 0 0 0;

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
  font-size: 2rem;
  color: #616161;
  color: red;
  margin-left: 1.5rem;

  @media (max-width: 570px) {
    margin-left: 0.2rem;
  }
`;

const EditIcon = styled(FaEdit)`
  width: 50px;
  height: 50px;
  color: #616161;
  margin-bottom: -2px;

  @media (max-width: 1300px) {
    width: 40px;
    height: 40px;
  }
  @media (max-width: 450px) {
    width: 35px;
    height: 35px;
  }

  @media (max-width: 400px) {
    width: 24px;
    height: 24px;
  }
`;

const DeleteIcon = styled(FaTrash)`
  width: 40px;
  height: 40px;
  color: #616161;

  @media (max-width: 1300px) {
    width: 30px;
    height: 30px;
  }
  @media (max-width: 450px) {
    width: 30px;
    height: 30px;
  }

  @media (max-width: 400px) {
    width: 20px;
    height: 20px;
  }
`;

const EditOrDeleteWords = styled.h3`
  margin: 0 0 0 0.5rem;
  font-size: 1.5rem;
  color: #616161;

  @media (max-width: 1300px) {
    font-size: 1rem;
  }

  @media (max-width: 570px) {
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
  font-size: 1.1rem;
  color: #3a3b3c;
  margin-left: ${(props) => (props.time ? "1.5rem" : "0")};

  @media (max-width: 1300px) {
    font-size: 1rem;
  }

  @media (max-width: 570px) {
    font-size: 0.9rem;
    margin: 0.1rem 0;
  }

  @media (max-width: 360px) {
    font-size: 0.7rem;
    display: ${(props) => (props.time ? "none" : "block")};
  }
`;

const Content = styled.div`
  width: 80%;
  min-height: 50vh;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;

  @media (max-width: 570px) {
    font-size: 1rem;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  margin-bottom: 3rem;

  @media (max-width: 570px) {
    margin-bottom: 2rem;
  }
`;

const Tag = styled(Link)`
  margin: 0.5rem 0;
  text-decoration: none;
  background-color: #ececec;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 40px;
  margin-right: 15px;
  color: black;

  &:hover {
    background-color: #949494;
    color: white;
  }

  @media (max-width: 355px) {
    width: 100px;
    height: 35px;
    font-size: 0.8rem;
  }
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
    getArticle();
  }, []);

  const deleteHandler = async () => {
    await deleteDoc(doc(db, "Post", `${params.articleId}`));
    alert("文章已刪除");
    navigate(`/articles`);
  };

  return (
    <>
      <FavoritesHeaderContainer>
        <Header />
      </FavoritesHeaderContainer>
      <BodyContainer>
        <Title>
          {article.title}
          <EditAndDeleteSection>
            {article.localId === localId ? (
              <EditOrDeleteEditSection to={`/edit/${params.articleId}`}>
                <EditIcon title={"編輯文章"} />
                <EditOrDeleteWords>編輯</EditOrDeleteWords>
              </EditOrDeleteEditSection>
            ) : null}
            {article.localId === localId ? (
              <EditOrDeleteEditSection
                to={`/edit/${params.articleId}`}
                onClick={deleteHandler}
              >
                <DeleteIcon title={"刪除文章"} />
                <EditOrDeleteWords>刪除</EditOrDeleteWords>
              </EditOrDeleteEditSection>
            ) : null}
          </EditAndDeleteSection>
        </Title>
        <SpotItemAuthorAndTime>
          <SpotItemSubtitle>{`作者：${article.displayName}`}</SpotItemSubtitle>
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
        <Content>{article.content}</Content>
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
        <ViewAllCategoryButton to={"/articles"}>
          瀏覽所有文章
        </ViewAllCategoryButton>
      </BodyContainer>
      <Footer />
    </>
  );
};

export default Article;
