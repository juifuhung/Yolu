import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import mediumIcon from "../images/footer-medium.png";
import instagramIcon from "../images/footer-instagram.png";
import linkedinIcon from "../images/footer-linkedin.png";

const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 315px;
  background-color: #c4c4c4;

  @media (max-width: 660px) {
    height: 250px;
  }
`;

const FooterTitle = styled.h4`
  margin: 2px 0;
  font-size: 4.5rem;
  font-weight: 1000;
  color: #484848;
  text-shadow: 2px 2px #000000;

  @media (max-width: 1030px) {
    font-size: 4rem;
  }

  @media (max-width: 850px) {
    font-size: 3rem;
  }

  @media (max-width: 660px) {
    font-size: 2.5rem;
    text-shadow: 0.5px 0.5px #000000;
  }

  @media (max-width: 560px) {
    font-size: 2.2rem;
  }

  @media (max-width: 470px) {
    font-weight: 580;
    font-size: 1.8rem;
  }

  @media (max-width: 380px) {
    font-size: 1.6rem;
  }

  @media (max-width: 360px) {
    font-size: 1.4rem;
  }
`;

const FooterSubTitle = styled.h5`
  margin: 2px 0;
  font-size: 2.5rem;
  font-weight: 400;
  color: #484848;

  @media (max-width: 1030px) {
    font-size: 2rem;
  }

  @media (max-width: 850px) {
    font-size: 1.5rem;
  }

  @media (max-width: 660px) {
    font-size: 1.2rem;
  }

  @media (max-width: 360px) {
    font-size: 1rem;
  }
`;

const FooterLinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0 5px;
  width: 250px;

  @media (max-width: 560px) {
    width: 160px;
  }
`;

const FooterLink = styled(Link)`
  display: flex;
  justify-content: center;
  margin: 0 5px;
  width: 60px;

  @media (max-width: 560px) {
    margin: 0 1px;
    width: 40px;
  }

  @media (max-width: 470px) {
    margin: 0 2px;
  }
`;

const FooterIcon = styled.img`
  height: 100%;
  width: 100%;
  object-fit: contain;

  @media (max-width: 560px) {
    width: 100%;
    height: 40px;
  }
`;

const Footer = () => {
  return (
    <>
      <FooterContainer>
        <FooterTitle>北國老虎 | Ralph 拉爾夫 🐯</FooterTitle>
        <FooterSubTitle>極圈導遊 x 英語導覽 x 軟體工程</FooterSubTitle>
        <FooterLinkContainer>
          <FooterLink target="_blank" to="//ralphhong5465.medium.com/">
            <FooterIcon src={mediumIcon} />
          </FooterLink>
          <FooterLink target="_blank" to="//www.instagram.com/ralphhong5465/">
            <FooterIcon src={instagramIcon} />
          </FooterLink>
          <FooterLink target="_blank" to="//www.linkedin.com/in/ralph-hung/">
            <FooterIcon src={linkedinIcon} />
          </FooterLink>
        </FooterLinkContainer>
      </FooterContainer>
    </>
  );
};

export default Footer;
