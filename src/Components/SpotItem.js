import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const SpotItemLink = styled(Link)`
  width: 80%;
  height: 20px;
  border: solid blue 1px;
`;

const SpotItemTitle = styled.h1`
  background-color: yellow;
`;

const SpotItemContent = styled.p`
  background-color: aqua;
`;

const SpotItemCreated_time = styled.p`
  background-color: lightblue;
`;

const SpotItem = ({ title, content, created_time, id }) => {
  return (
    <>
      <SpotItemLink to={`/article/${id}`}>
        <SpotItemTitle>{title}</SpotItemTitle>
        <SpotItemContent>{content}</SpotItemContent>
        <SpotItemCreated_time>{created_time}</SpotItemCreated_time>
      </SpotItemLink>
    </>
  );
};

export default SpotItem;
