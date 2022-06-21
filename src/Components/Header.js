import React from "react";
import Timer from "./Timer";
import { Link } from "react-router-dom";
import styled from "styled-components";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100vw;
  height: 120px;
  border: solid green 1px;
`;

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: solid black 1px;
  width: 60%;
  height: 100%;
`;
const localId = window.localStorage.getItem("localId");

const Header = () => {
  const displayMessage = () => {
    if (!localId) {
      alert("please sign in");
    }
  };

  const logoutHandler = () => {
    const storedItems = ["localId", "displayName"];
    storedItems.forEach((item) => {
      window.localStorage.removeItem(item);
    });
    alert("logged out");
    location.replace("./");
  };

  return (
    <div>
      <HeaderContainer>
        <Link to="/">
          <div>Home</div>
        </Link>
        <Timer />
        <Nav>
          <Link to="/map">
            <div>Map</div>
          </Link>
          <Link to="/favorites">
            <div onClick={displayMessage}>My Favorites</div>
          </Link>
          {localId ? <div onClick={logoutHandler}>Log out</div> : null}
          {!localId ? (
            <Link to="/member">
              <div>sign in</div>
            </Link>
          ) : null}
        </Nav>
      </HeaderContainer>
    </div>
  );
};

export default Header;
