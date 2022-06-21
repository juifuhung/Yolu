import React from "react";
import styled from "styled-components";

const FooterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100vw;
  height: 120px;
  border: solid green 1px;
`;

const Footer = () => {
  return (
    <div>
      <FooterContainer>
        <div>footer</div>
      </FooterContainer>
    </div>
  );
};

export default Footer;
