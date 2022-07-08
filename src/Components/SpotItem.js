import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const SpotItemLink = styled(Link)`
  color: black;
  text-decoration: none;
  margin-bottom: 2rem;
  width: 60%;
  min-height: 160px;
  padding: 2rem;
  border: solid #000000 3px;

  @media (max-width: 360px) {
    padding: 1.5rem;
  }
`;

const SpotItemTitle = styled.h1`
  margin: 0;

  @media (max-width: 570px) {
    margin-bottom: 1rem;
  }

  @media (max-width: 460px) {
    font-size: 1.5rem;
  }

  @media (max-width: 350px) {
    font-size: 1.2rem;
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
  font-size: 0.8rem;
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
  font-size: 1rem;

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
          {content.length <= 100 ? content : `${content.substring(0, 100)}...`}
        </SpotItemContent>
      </SpotItemLink>
    </>
  );
};

const spotItem = React.forwardRef(SpotItem);

export default spotItem;
