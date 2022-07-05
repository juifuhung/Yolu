import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const SpotItemLink = styled(Link)`
  width: 80%;
  height: 20px;
  border: solid blue 1px;
`;

const SpotItem = ({ id, title }) => {
  return (
    <>
      <SpotItemLink to={`./${id}`}>{title}</SpotItemLink>
    </>
  );
};

export default SpotItem;
