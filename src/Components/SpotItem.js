import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import striptags from "striptags";

const SpotItemLink = styled(Link)`
  color: black;
  text-decoration: none;
  margin-bottom: 1rem;
  width: 60%;
  min-height: 120px;
  padding: 1.5rem;
  border: solid #000000 2px;
  background-color: white;

  @media (max-width: 360px) {
    padding: 1rem;
  }

  &:hover {
    background-color: #ebecf0;
  }
`;

const SpotItemTitle = styled.h1`
  font-size: 1.6rem;
  margin: 0;

  @media (max-width: 570px) {
    margin-bottom: 1rem;
  }

  @media (max-width: 460px) {
    font-size: 1.3rem;
  }

  @media (max-width: 350px) {
    font-size: 1rem;
  }
`;

const SpotItemAuthorAndTime = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;

  @media (max-width: 570px) {
    flex-direction: column;
  }
`;

const SpotItemSubtitle = styled.p`
  font-size: 0.5rem;
  color: #3a3b3c;
  margin-left: ${(props) => (props.time ? "1.5rem" : "0")};

  @media (max-width: 570px) {
    margin: 0.1rem 0;
  }

  @media (max-width: 360px) {
    font-size: 0.7rem;

    display: ${(props) => (props.time ? "none" : "block")};
  }
`;

const SpotItemContent = styled.p`
  margin-bottom: 0;
  font-size: 0.9rem;

  @media (max-width: 360px) {
    font-size: 0.9rem;
  }
`;

const SpotItem = ({ title, content, displayName, created_time, id }, ref) => {
  return (
    <>
      <SpotItemLink to={`/article/${id}`} ref={ref}>
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
          {content.length <= 100
            ? striptags(`${content}`)
            : striptags(`${content.substring(0, 100)}...`)}
        </SpotItemContent>
      </SpotItemLink>
    </>
  );
};

const spotItem = React.forwardRef(SpotItem);

export default spotItem;
