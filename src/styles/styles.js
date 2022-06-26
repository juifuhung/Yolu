import styled, { createGlobalStyle } from "styled-components";

export const UniversalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0px;
    box-sizing:border-box;
  }
`;

export const Font = styled.div`
  @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap");

  * {
    font-family: "Noto Sans TC", sans-serif;
  }
`;
