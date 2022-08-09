import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 60px;
  height: 70px;
  margin: 5px;
  cursor: pointer;

  @media (max-width: 450px) {
    margin: 5px 2px;
  }

  @media (max-width: 340px) {
    height: 65px;
  }
`;

const CategoryWords = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.6rem;
  width: 60px;
  height: 20px;
  background-color: red;
  color: white;

  @media (max-width: 450px) {
    font-size: 0.2rem;
    width: 55px;
  }
`;

const Icon = styled.div`
  width: 45px;
  height: 45px;
  background-image: url(${(props) => props.icon});
  background-size: 95%;
  background-repeat: no-repeat;
  background-position: center;

  @media (max-width: 340px) {
    width: 40px;
    height: 40px;
  }
`;

const MapCategoryItem = ({
  category,
  favorites,
  categoryHandler,
  getData,
  showFavoriteHandler,
  setShowFavorites,
}) => {
  return (
    <>
      <Container
        onClick={() => {
          category
            ? (categoryHandler(`${category.title}`), setShowFavorites(false))
            : favorites
            ? showFavoriteHandler()
            : (setShowFavorites(false), getData());
        }}
      >
        <Icon
          icon={
            category
              ? category.icon
              : favorites
              ? "https://img.onl/sa6Si"
              : "https://img.onl/M4U7Oy"
          }
        />
        <CategoryWords>
          {category ? category.title : favorites ? "顯示最愛" : "顯示全部"}
        </CategoryWords>
      </Container>
    </>
  );
};

export default MapCategoryItem;
