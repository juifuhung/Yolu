import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth, getFirestoreDocuments } from "../utils/Firebase";
import LoadingImage from "../images/loading.gif";
import TopIcon from "../images/top.png";
import AllArticlesItem from "../components/AllArticlesItem";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TopButton = styled.div`
  width: 62px;
  height: 62px;
  background-image: url(${TopIcon});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: fixed;
  bottom: 30px;
  right: 30px;
  cursor: pointer;

  @media (max-width: 1100px) {
    width: 58px;
    height: 58px;
    bottom: 20px;
    right: 20px;
  }

  @media (max-width: 850px) {
    width: 55px;
    height: 55px;
  }

  @media (max-width: 350px) {
    width: 50px;
    height: 50px;
    bottom: 15px;
    right: 15px;
  }

  &:hover {
    animation: shake 0.82s cubic-bezier(0.30, 0.07, 0.19, 0.97) both;
  }

  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1.5px, 0px, 0);
    }
    20%, 80% {
      transform: translate3d(0, 1.5px, 0);
    }
    
    30%, 50%, 70% {
      transform: translate3d(-1.5px, 0, 0);
    }
    40%, 60% {
      transform: translate3d(0, 1.5px, 0);
  }
`;

const BodyContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleContainer = styled.div`
  width: 85%;
  display: flex;
  margin: 2rem 0 1rem;
  justify-content: space-between;
  align-items: end;

  @media (max-width: 1300px) {
    margin: 1.5rem 0;
  }

  @media (max-width: 480px) {
    margin: 1rem 0;
  }

  @media (max-width: 450px) {
    margin: 0.6rem 0;
  }
`;

const Title = styled.div`
  font-size: 1.9rem;
  font-weight: 600;

  @media (max-width: 1300px) {
    font-size: 1.7rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }

  @media (max-width: 370px) {
    font-size: 1.2rem;
  }
`;

const EditSection = styled(Link)`
  display: flex;
  align-items: end;
  height: auto;
  width: auto;
  text-decoration: none;
`;

const EditIcon = styled(FaEdit)`
  width: 30px;
  height: 30px;
  color: #616161;

  @media (max-width: 1300px) {
    width: 25px;
    height: 25px;
  }
  @media (max-width: 450px) {
    width: 22px;
    height: 22px;
  }

  @media (max-width: 360px) {
    width: 20px;
    height: 20px;
  }
`;

const EditWords = styled.h3`
  margin: 0 0 0 0.2rem;
  font-size: 1.3rem;
  color: #616161;

  @media (max-width: 1300px) {
    font-size: 1rem;
  }

  @media (max-width: 650px) {
    display: none;
  }
`;

const CategoryBlock = styled.div`
  width: 85%;
  margin: 0.5rem 0;
`;

const CategoryRedLine = styled.div`
  width: 100%;
  height: 9px;
  margin: 0.7rem 0;
  background-color: #ff0000;

  @media (max-width: 480px) {
    height: 6.5px;
    margin: 0.4rem 0;
  }
`;

const ItemSection = styled.div`
  width: 100%;
  height: 70%;
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 352px) {
    justify-content: center;
  }
`;

const Label = styled.h2`
  color: #333333;
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

let localId;

const scrollToTop = () => {
  window.scroll({ top: 0, behavior: "smooth" });
};

const newPostHandler = () => {
  if (!localId) {
    Swal.fire({
      icon: "error",
      title: "請先登入",
      confirmButtonColor: "#3085d6",
      footer: '<a href="/member">前往登入頁面</a>',
    });
  }
};

const AllArticles = () => {
  const [allSpots, setAllSpots] = useState([]);

  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  const getData = async () => {
    try {
      let allSpotsArray = [];
      const querySnapshot = await getFirestoreDocuments("Spots");
      querySnapshot.forEach((doc) => {
        allSpotsArray.push(doc.data());
      });
      setAllSpots(allSpotsArray);
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "讀取資料時發生錯誤",
        // footer: '<a href="">回報問題</a>',
      }).then(() => {
        window.location = "/";
      });
      console.error("Error getting document: ", e);
    }
  };

  useEffect(() => {
    scrollToTop();
    getData();
  }, []);

  return (
    <>
      <Header />
      <BodyContainer>
        <TitleContainer>
          <Title>所有文章標籤</Title>
          <EditSection
            onClick={newPostHandler}
            to={localId ? "/new-post" : "/articles"}
            title={"發表文章"}
          >
            <EditIcon />
            <EditWords>發表文章</EditWords>
          </EditSection>
        </TitleContainer>
        <CategoryBlock>
          <Label>博物館</Label>
          <CategoryRedLine />
          {!allSpots && <img src={LoadingImage} />}
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
          {!allSpots && <img src={LoadingImage} />}
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
          {!allSpots && <img src={LoadingImage} />}
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
          {!allSpots && <img src={LoadingImage} />}
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
          {!allSpots && <img src={LoadingImage} />}
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
          {!allSpots && <img src={LoadingImage} />}
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
      <TopButton
        onClick={() => {
          scrollToTop();
        }}
      />
      <Footer />
    </>
  );
};

export default AllArticles;
