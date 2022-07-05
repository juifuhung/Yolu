import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled(Link)`
  width: 500px;
  height: 80px;
  border: solid green 1px;
  background-color: pink;
`;

const Title = styled.div`
  width: 100%;
  height: 30px;
`;

const Content = styled.div`
  width: 100%;
  height: 40px;
`;

const CreatedTime = styled.div`
  width: 100%;
  height: 10px;
`;

const ArticleItem = (item) => {
  console.log(item);
  return (
    <>
      <Container to={`${item.title}`} target="_blank">
        <Title>{item.title}</Title>
        <Content>{item.content}</Content>
        <CreatedTime>{item.created_time}</CreatedTime>
      </Container>
    </>
  );
};

export default ArticleItem;
