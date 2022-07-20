import React from "react";
import styled from "styled-components";
import { useAuth } from "../utils/Firebase";

const CategoryButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110px;
  height: 50px;
  margin: 2px;
  font-size: 1.1rem;
  border-radius: 1rem;
  background-color: ${(props) => (props.selected ? "#7f0000" : "#ff0000")};
  cursor: pointer;
  color: white;

  @media (max-width: 510px) {
    border-radius: 0.8rem;
    width: 90px;
    height: 40px;
    margin: 1.5px;
    font-size: 0.9rem;
  }

  @media (max-width: 420px) {
    border-radius: 0.5rem;
    width: 80px;
    height: 30px;
    margin: 1px;
    font-size: 0.8rem;
  }

  &:hover {
    background-color: #7f0000;
  }
`;

let localId;

const FavoritesCategory = ({
  category,
  selected,
  categorySelectionHandler,
  selectionHandler,
  getFavoritesWithPagination,
  getTotalFavorites,
  index,
}) => {
  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  return (
    <>
      <CategoryButton
        selected={selected}
        onClick={() => {
          category ? selectionHandler(index) : categorySelectionHandler();
          getTotalFavorites(localId, `${category}`);
          category
            ? getFavoritesWithPagination(localId, `${category}`)
            : getFavoritesWithPagination(localId);
        }}
      >
        {category ? category : "顯示全部"}
      </CategoryButton>
    </>
  );
};

export default FavoritesCategory;
