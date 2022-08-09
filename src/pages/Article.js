import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import parse from "html-react-parser";
import {
  useAuth,
  getFirestoreDocument,
  deleteFireStoreDocument,
} from "../utils/Firebase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/yesOrNo.css";

const FavoritesHeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;
`;

const BodyContainer = styled.div`
  min-height: 87vh;
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

const EditSection = styled(Link)`
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

const DeleteSection = styled.div`
  display: flex;
  align-items: end;
  text-decoration: none;
  color: #616161;
  color: red;
  margin-left: 0.8rem;
  cursor: pointer;

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
    max-height: 800px;
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
  margin-bottom: 2rem;
  width: 180px;
  height: 50px;
  border: none;
  cursor: pointer;

  @media (max-width: 570px) {
    border-radius: 0.8rem;
    width: 150px;
    height: 45px;
    font-size: 1rem;
  }
`;

let localId;

const scrollToTop = () => {
  window.scroll({ top: 0, behavior: "smooth" });
};

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
    try {
      const docSnap = await getFirestoreDocument("Post", `${params.articleId}`);
      setArticle(docSnap.data());
      setTimestamp(docSnap.data().created_time.toDate());
    } catch {
      Swal.fire({
        icon: "error",
        title: "讀取文章時發生錯誤",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "回遊記專區",
        // footer: '<a href="">回報問題</a>',
      }).then(() => {
        window.location = "/articles";
      });
    }
  };

  useEffect(() => {
    scrollToTop();
    getArticle();
  }, []);

  const deleteHandler = () => {
    Swal.fire({
      title: "確定刪除遊記？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "是，請刪除",
      cancelButtonText: "否",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFireStoreDocument("Post", `${params.articleId}`);
        Swal.fire({
          title: "遊記已刪除",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        navigate(`/articles`);
      }
    });
  };

  return (
    <>
      <FavoritesHeaderContainer>
        <Header />
      </FavoritesHeaderContainer>
      <BodyContainer>
        <TitleSection>
          {article.title ? (
            <Title>{article.title}</Title>
          ) : (
            <Title>Loading...</Title>
          )}

          <EditAndDeleteSection>
            {article.localId === localId ? (
              <EditSection to={`/edit/${params.articleId}`} title={"編輯遊記"}>
                <EditIcon />
                <EditOrDeleteWords>編輯</EditOrDeleteWords>
              </EditSection>
            ) : null}
            {article.localId === localId ? (
              <DeleteSection onClick={deleteHandler} title={"刪除遊記"}>
                <DeleteIcon />
                <EditOrDeleteWords>刪除</EditOrDeleteWords>
              </DeleteSection>
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
