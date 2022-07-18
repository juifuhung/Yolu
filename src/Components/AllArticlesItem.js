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
  width: 140px;
  height: 160px;
  margin: 0.5rem 0.2rem 0.5rem 0;
`;

const ImageContainer = styled.div`
  width: 90%;
  height: 120px;
  border-radius: 1.2rem;
  background-image: url("${(props) => props.image}");
  background-size: 200%;
  background-position: center;
  background-repeat: no-repeat;
  transition: all 0.3s ease-in-out;
  box-shadow: -3px 3px 15px #aaaaaa;

  &:hover {
    background-size: 250%;
  }
`;

const Title = styled.p`
  margin: 0;
  font-size: 0.82rem;
  font-weight: 500;
  width: auto;
  height: 30px;
  text-shadow: -5px 5px 20px #aaaaaa;
`;

const AllArticlesItem = (item) => {
  return (
    <>
      <Container to={`./${item.title}`}>
        <ImageContainer image={item.image} />
        <Title>{item.title}</Title>
      </Container>
    </>
  );
};

export default AllArticlesItem;
