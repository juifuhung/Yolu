import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ViewAllCategoryButton = styled(Link)`
  width: 300px;
  height: 100px;
  font-size: 1.2rem;
  border: solid red 1px;
  color: black;
`;

const PostComplete = () => {
  return (
    <>
      <Header />
      PostComplete
      <ViewAllCategoryButton to={"/articles"}>
        瀏覽所有文章
      </ViewAllCategoryButton>
      <Footer />
    </>
  );
};

export default PostComplete;
