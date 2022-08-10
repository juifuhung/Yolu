import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import { Font } from "../styles/styles";
import { useAuth, logOut } from "../utils/Firebase";
import headerLogo from "../images/header-yolu.png";
import webMemberIcon from "../images/web-member-icon.png";
import mobileMemberLoginIcon from "../images/mobile-member-login.png";
import mobileLogOutMemberIcon from "../images/mobile-member-logout.png";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  width: 100%;
  height: 60px;

  @media (min-width: 611px) {
    box-shadow: 0 2px 5px #c4c4c4;
    height: 60px;
  }
`;

const HeaderContainerLeft = styled.div`
  width: auto;
  display: flex;
  justify-content: start;
  align-items: center;
  height: 100%;

  @media (max-width: 610px) {
    width: 100%;
    justify-content: center;
  }
`;

const HomepageLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  min-width: 60px;
  margin-left: 30px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${headerLogo});

  @media (max-width: 1100px) {
    margin-bottom: 5px;
    height: 34px;
  }

  @media (max-width: 770px) {
    margin-left: 20px;
  }

  @media (max-width: 610px) {
    margin-left: 0;
  }
`;

const Nav = styled.div`
  min-width: 420px;
  display: flex;
  justify-content: space-between;
  padding-right: 2%;
  align-items: center;
  height: 100%;

  @media (max-width: 610px) {
    display: none;
  }
`;

const WebNavLink = styled(Link)`
  margin-right: 15px;
  font-size: 1.2rem;
  text-decoration: none;
  color: #000000;

  &:hover {
    color: #7e7e7e;
  }
`;

const SignInLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #000000;

  &:hover {
    color: #7e7e7e;
  }
`;

const MemberWord = styled.p`
  font-size: 1.2rem;
  margin: 0;
`;

const WebMemberIcon = styled.div`
  width: 32px;
  height: 32px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${webMemberIcon});
`;

const LogOut = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  text-decoration: none;
  color: #000000;
  cursor: pointer;

  &:hover {
    color: #7e7e7e;
  }
`;

const MobileNav = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #403939;
  width: 100%;
  height: 40px;

  @media (min-width: 611px) {
    display: none;
  }

  @media (max-width: 480px) {
    height: 35px;
  }
`;

const MobileNavLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  margin: 0;
  font-size: 1rem;
  color: white;
  text-decoration: none;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }

  :hover {
    color: #c4c4c4;
  }
`;

const MobileNavCenterLine = styled.div`
  background-color: #9a9a9a;
  width: 2px;
  height: 60%;
`;

const MobileMember = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  background-color: #353030;
  cursor: pointer;
  position: fixed;
  top: 150px;
  right: 0;
  z-index: 10;

  @media (min-width: 1101px) {
    display: none;
  }

  @media (max-width: 1100px) {
    top: 120px;
  }

  @media (max-width: 600px) {
    top: 150px;
  }
`;

let localId;

const displaySignInMessage = () => {
  if (!localId) {
    Swal.fire({
      icon: "error",
      title: "請先登入",
      confirmButtonColor: "#3085d6",
      footer: '<a href="/member">前往登入頁面</a>',
    });
  }
};

const logoutHandler = async () => {
  Swal.fire({
    title: "確定登出？",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "是",
    cancelButtonText: "否",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("已登出");
      try {
        logOut();
        location.replace("/");
      } catch {
        Swal.fire({
          icon: "error",
          title: "登出時發生錯誤",
          confirmButtonColor: "#3085d6",
          // footer: '<a href="">回報問題</a>',
        });
      }
    }
  });
};

const Header = () => {
  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  return (
    <>
      <Font>
        <MobileMember to="/member" onClick={localId && logoutHandler}>
          <img src={localId ? mobileLogOutMemberIcon : mobileMemberLoginIcon} />
        </MobileMember>

        <HeaderContainer>
          <HeaderContainerLeft>
            <HomepageLink to="/" />
          </HeaderContainerLeft>
          <Nav>
            <WebNavLink to="/map">互動地圖</WebNavLink>
            <WebNavLink to="/articles">遊記專區</WebNavLink>
            <WebNavLink
              to={localId ? "/favorites" : ""}
              onClick={displaySignInMessage}
            >
              我的最愛
            </WebNavLink>
            {localId ? (
              <LogOut onClick={logoutHandler}>
                <MemberWord>登出</MemberWord>
                <WebMemberIcon />
              </LogOut>
            ) : null}
            {!localId ? (
              <SignInLink to="/member">
                <MemberWord>登入/註冊</MemberWord>
                <WebMemberIcon />
              </SignInLink>
            ) : null}
          </Nav>
        </HeaderContainer>
        <MobileNav>
          <MobileNavLink to="/map">互動地圖</MobileNavLink>
          <MobileNavCenterLine />
          <MobileNavLink to="/articles">遊記專區</MobileNavLink>
        </MobileNav>
      </Font>
    </>
  );
};

export default Header;
