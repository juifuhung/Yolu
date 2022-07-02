import React from "react";
import styled from "styled-components";

const Container = styled.div`
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

const ArticleItem = (title) => {
  console.log(title);
  return (
    <>
      <Container>
        <Title>{title.title}</Title>
        <Content>{title.content}</Content>
        <CreatedTime>{title.created_time}</CreatedTime>
      </Container>
    </>
  );
};

export default ArticleItem;
