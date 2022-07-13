import React, { useState, useEffect } from "react";
import HeaderTimer from "./HeaderTimer";
import { Link } from "react-router-dom";
import styled from "styled-components";
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

  @media (min-width: 1100px) {
    box-shadow: 0 2px 5px #c4c4c4;
  }

  @media (max-width: 1100px) {
    height: 60px;
  }

  @media (max-width: 600px) {
    height: 100px;
  }
`;

const HeaderContainerLeft = styled.div`
  width: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;

  @media (max-width: 1100px) {
    width: 100%;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const HomepageLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  min-width: 60px;
  margin: 0 15px 0 15px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${headerLogo});

  @media (max-width: 1100px) {
    margin-bottom: 5px;
    height: 34px;
  }
`;

const WeatherLink = styled(Link)`
  display: flex;
  height: 100%;
  text-decoration: none;
  color: #000000;
  margin-left: 0.5rem;

  @media (max-width: 1210px) {
    margin-left: 0;
  }

  @media (max-width: 600px) {
    display: none;
  }
`;

const WeatherSectionRight = styled.section`
  display: flex;
  flex-direction: column;
  align-items: start;
  height: 100%;
  z-index: 2;
`;

const WeatherInformationMain = styled.section`
  display: flex;
  align-items: end;
  font-size: 1.1rem;
  height: 52%;
`;

const WeatherIcon = styled.div`
  align-items: center;
  height: 100%;
  width: 58px;
  z-index: 1;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${(props) => props.icon});
`;

const Temperature = styled.section`
  display: flex;
  align-items: start;
  font-size: 0.8rem;
  height: 48%;
`;

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 2%;
  align-items: center;
  width: 460px;
  height: 100%;

  @media (max-width: 1300px) {
    width: 400px;
  }

  @media (max-width: 1100px) {
    display: none;
  }
`;

const WebNavLink = styled(Link)`
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

  @media (min-width: 1101px) {
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
const weatherApiKey = process.env.REACT_APP_WEATHER_API_KEY;

const Header = () => {
  const [temperature, setTemperature] = useState(0);
  const [icon, setIcon] = useState(undefined);
  const [weatherMain, setWeatherMain] = useState(undefined);

  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  const displayMessage = () => {
    if (!localId) {
      alert("請登入");
    }
  };

  const logoutHandler = async () => {
    try {
      alert("已登出");
      await logOut();
      location.replace("./");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    weather();
  }, []);

  const weather = async () => {
    const result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=rovaniemi&appid=${weatherApiKey}`
    );
    const parsedResult = await result.json();
    9 / setTemperature(Math.round((parsedResult.main.temp - 272.15) * 10) / 10);
    setIcon(parsedResult.weather[0].icon);
    setWeatherMain(parsedResult.weather[0].main);
  };

  return (
    <>
      <Font>
        <MobileMember to="/member" onClick={localId && logoutHandler}>
          <img src={localId ? mobileLogOutMemberIcon : mobileMemberLoginIcon} />
        </MobileMember>

        <HeaderContainer>
          <HeaderContainerLeft>
            <HomepageLink to="/" />
            {window.screen.width > 1210 ? (
              <WeatherLink
                to="//weather.com/zh-TW/weather/tenday/l/Rovaniemi+Lappi+Finland?canonicalCityId=f33f0e3d39ae49429748c3ca17e88fccf4acd065e7ca8ae0a1160b4c9ed7970d"
                target="_blank"
              >
                <WeatherIcon
                  icon={`http://openweathermap.org/img/w/${icon}.png`}
                />
                <WeatherSectionRight>
                  <WeatherInformationMain>{weatherMain}</WeatherInformationMain>
                  <Temperature>{temperature} °C</Temperature>
                </WeatherSectionRight>
              </WeatherLink>
            ) : (
              <HeaderTimer />
            )}
            {window.screen.width > 1210 ? (
              <HeaderTimer />
            ) : (
              <WeatherLink
                to="//weather.com/zh-TW/weather/tenday/l/Rovaniemi+Lappi+Finland?canonicalCityId=f33f0e3d39ae49429748c3ca17e88fccf4acd065e7ca8ae0a1160b4c9ed7970d"
                target="_blank"
              >
                <WeatherIcon
                  icon={`http://openweathermap.org/img/w/${icon}.png`}
                />
                <WeatherSectionRight>
                  <WeatherInformationMain>{weatherMain}</WeatherInformationMain>
                  <Temperature>{temperature} °C</Temperature>
                </WeatherSectionRight>
              </WeatherLink>
            )}
          </HeaderContainerLeft>
          <Nav>
            <WebNavLink to="/map">互動地圖</WebNavLink>
            <WebNavLink to="/articles">遊記專區</WebNavLink>
            <WebNavLink to="/favorites" onClick={displayMessage}>
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
          <MobileNavLink to="/favorites" onClick={displayMessage}>
            我的最愛
          </MobileNavLink>
        </MobileNav>
      </Font>
    </>
  );
};

export default Header;
