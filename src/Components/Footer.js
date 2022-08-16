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
  height: 85px;
  background-color: #c4c4c4;

  @media (max-width: 660px) {
    height: 80px;
  }
`;

const FooterTitle = styled.h4`
  margin: 2px 0;
  font-size: 1.3rem;
  font-weight: 500;
  color: #484848;
  text-shadow: 0.8px 0.8px #000000;

  @media (max-width: 1030px) {
    font-size: 1.2rem;
  }

  @media (max-width: 380px) {
    font-size: 1rem;
    text-shadow: 0.4px 0.4px #000000;
  }
`;

const FooterLinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  width: 90px;

  @media (max-width: 470px) {
    width: 60px;
  }
`;

const FooterLink = styled(Link)`
  display: flex;
  justify-content: center;
  margin: 0 5px;
  width: 20px;

  @media (max-width: 470px) {
    margin: 0 2px;
  }
`;

const FooterIcon = styled.img`
  height: 100%;
  width: 100%;
  object-fit: contain;
`;

const Footer = () => {
  return (
    <>
      <FooterContainer>
        <FooterTitle>北國老虎 | Ralph 拉爾夫 🐯</FooterTitle>
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
