import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth } from "../utils/Firebase";
import TopIcon from "../images/top.png";
import CategorySection from "../components/CategorySection";
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

const categoryArray = [
  "博物館",
  "自然景觀",
  "餐廳",
  "聖誕主題",
  "購物",
  "交通",
];

const AllArticles = () => {
  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  useEffect(() => {
    scrollToTop();
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
        {categoryArray.map((item) => (
          <CategorySection label={item} key={item} />
        ))}
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
