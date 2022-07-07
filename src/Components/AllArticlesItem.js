import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: black;
  width: 170px;
  height: 212px;
  margin: 0.5rem 1.5rem 0.5rem 0;
  border: solid red 1px;
`;

const ImageContainer = styled.div`
  border: solid yellow 1px;
  width: 100%;
  height: 170px;
  border-radius: 2rem;
  background-image: url("${(props) => props.image}");
  background-size: 200%;
  background-position: center;
  background-repeat: no-repeat;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-size: 250%;
  }
`;

const Title = styled.p`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  border: solid blue 1px;
  width: auto;
  height: 30px;
`;

const AllArticlesItem = (item) => {
  console.log(item.image);
  return (
    <>
      <Container to={`./${item.title}`} target="_blank">
        <ImageContainer image={item.image} />
        <Title>{item.title}</Title>
      </Container>
    </>
  );
};

export default AllArticlesItem;
