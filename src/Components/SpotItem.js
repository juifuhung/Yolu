import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const SpotItemLink = styled(Link)`
  color: black;
  text-decoration: none;
  margin-bottom: 2rem;
  width: 60%;
  height: 200px;
  padding: 2rem;
  border: solid #000000 3px;
`;

const SpotItemTitle = styled.h1`
  margin: 0;
`;

const SpotItemAuthorAndTime = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
`;

const SpotItemSubtitle = styled.p`
  font-size: 0.8rem;
  color: #3a3b3c;
  margin-left: ${(props) => (props.time ? "1.5rem" : "0")};
`;

const SpotItemContent = styled.p`
  font-size: 1rem;
`;

const SpotItem = ({ title, content, displayName, created_time, id }) => {
  return (
    <>
      <SpotItemLink to={`/article/${id}`}>
        <SpotItemTitle>{title}</SpotItemTitle>
        <SpotItemAuthorAndTime>
          <SpotItemSubtitle>{`作者：${displayName}`}</SpotItemSubtitle>
          <SpotItemSubtitle
            time={true}
          >{`最近更新：${created_time.getFullYear()}年${
            created_time.getMonth() + 1 < 10
              ? "0" + (created_time.getMonth() + 1).toString()
              : (created_time.getMonth() + 1).toString()
          }月${
            created_time.getDate() < 10
              ? "0" + created_time.getDate().toString()
              : created_time.getDate().toString()
          }日 ${
            created_time.getHours() === 0
              ? "00"
              : created_time.getHours() < 10
              ? "0" + created_time.getHours().toString()
              : created_time.getHours().toString()
          }:${
            created_time.getMinutes() === 0
              ? "00"
              : created_time.getMinutes() < 10
              ? "0" + created_time.getMinutes().toString()
              : created_time.getMinutes().toString()
          }`}</SpotItemSubtitle>
        </SpotItemAuthorAndTime>
        <SpotItemContent>
          {content.length <= 200 ? content : `${content.substring(0, 200)}...`}
        </SpotItemContent>
      </SpotItemLink>
    </>
  );
};

export default SpotItem;
