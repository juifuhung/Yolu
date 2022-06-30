import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuroraNotFound from "../images/aurora404.gif";

const NotFoundBackground = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 70vh;
  background-image: url(${AuroraNotFound});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const ErrorMessages = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 6%;
  text-shadow: 2px 2px 4px black;
`;

const ErrorTitle = styled.h1`
  margin: 5px;
  font-size: 6rem;
  font-weight: 800;
  color: white;
`;

const ErrorSubTitle = styled.p`
  margin: 5px;
  font-size: 2rem;
  font-weight: 600;
  color: white;
`;

const HomepageButton = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  height: 60px;
  width: 180px;
  margin-top: 20px;
  background-color: #63452a;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  color: #ecd4b4;
  font-size: 1.5rem;
  box-shadow: 3px 3px 4px black;
`;

const NotFound = () => {
  return (
    <>
      <Header />
      <NotFoundBackground>
        <ErrorMessages>
          <ErrorTitle>404 錯誤</ErrorTitle>
          <ErrorSubTitle>您訪問的頁面不存在</ErrorSubTitle>
          <HomepageButton to="/">回首頁</HomepageButton>
        </ErrorMessages>
      </NotFoundBackground>
      <Footer />
    </>
  );
};

export default NotFound;
