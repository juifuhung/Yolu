import React, { useState, useEffect } from "react";
import HeaderTimer from "./HeaderTimer";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Font } from "../styles/styles";
import headerLogo from "../images/header-yolu.png";
import webMemberIcon from "../images/web-member-icon.png";
import mobileMemberLoginIcon from "../images/mobile-member-login.png";
import mobileLogOutMemberIcon from "../images/mobile-member-logout.png";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100vw;
  height: 120px;

  @media (max-width: 800px) {
    height: 160px;
  }
`;

const HeaderContainerLeft = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 50%;
  height: 100%;

  @media (max-width: 1500px) {
    width: 100vw;
  }

  @media (max-width: 800px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const HomepageLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 100%;
  margin: 0 20px 0 20px;

  @media (max-width: 800px) {
    height: 40%;
  }
`;

const WeatherLink = styled(Link)`
  display: flex;
  height: 100%;
  width: 195px;
  text-decoration: none;
  color: #000000;

  @media (max-width: 800px) {
    display: none;
  }
`;

const WeatherSectionLeft = styled.section`
  display: flex;
  flex-direction: column;
  align-items: start;
  height: 100%;
  z-index: 2;
`;

const WeatherInformationMain = styled.section`
  display: flex;
  align-items: end;
  font-size: 35px;
  height: 60%;
`;

const Temperature = styled.section`
  display: flex;
  align-items: start;
  font-size: 20px;
  height: 40%;
`;

const WeatherIcon = styled.div`
  align-items: center;
  height: 100%;
  width: 50%;
  z-index: 1;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${(props) => props.icon});
`;

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 2%;
  align-items: center;
  width: 35%;
  height: 100%;

  @media (max-width: 1500px) {
    display: none;
  }
`;

const WebNavLink = styled(Link)`
  font-size: 2rem;
  text-decoration: none;
  color: #000000;
`;

const SignInLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  text-decoration: none;
  color: #000000;
`;

const LogOut = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  text-decoration: none;
  color: #000000;
  cursor: pointer;
`;

const MobileNav = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #403939;
  width: 100%;
  height: 70px;

  @media (min-width: 1501px) {
    display: none;
  }

  @media (max-width: 480px) {
    height: 60px;
  }
`;

const MobileNavLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  margin: 0;
  font-size: 2rem;
  color: white;
  text-decoration: none;

  @media (max-width: 480px) {
    font-size: 1.5rem;
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

  @media (max-width: 1500px) {
    top: 230px;
  }

  @media (max-width: 800px) {
    top: 250px;
  }
`;

const localId = window.localStorage.getItem("localId");
const weatherApiKey = process.env.REACT_APP_WEATHER_API_KEY;

const Header = () => {
  const [temperature, setTemperature] = useState(0);
  const [icon, setIcon] = useState(undefined);
  const [weatherMain, setWeatherMain] = useState(undefined);

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
            <HomepageLink to="/">
              <img src={headerLogo} />
            </HomepageLink>
            {window.screen.width > 1500 ? (
              <WeatherLink
                to="//weather.com/zh-TW/weather/tenday/l/Rovaniemi+Lappi+Finland?canonicalCityId=f33f0e3d39ae49429748c3ca17e88fccf4acd065e7ca8ae0a1160b4c9ed7970d"
                target="_blank"
              >
                <WeatherSectionLeft>
                  <WeatherInformationMain>{weatherMain}</WeatherInformationMain>
                  <Temperature>{temperature} °C</Temperature>
                </WeatherSectionLeft>
                <WeatherIcon
                  icon={`http://openweathermap.org/img/w/${icon}.png`}
                />
              </WeatherLink>
            ) : (
              <HeaderTimer />
            )}
            {window.screen.width > 1500 ? (
              <HeaderTimer />
            ) : (
              <WeatherLink
                to="//weather.com/zh-TW/weather/tenday/l/Rovaniemi+Lappi+Finland?canonicalCityId=f33f0e3d39ae49429748c3ca17e88fccf4acd065e7ca8ae0a1160b4c9ed7970d"
                target="_blank"
              >
                <WeatherSectionLeft>
                  <WeatherInformationMain>{weatherMain}</WeatherInformationMain>
                  <Temperature>{temperature} °C</Temperature>
                </WeatherSectionLeft>
                <WeatherIcon
                  icon={`http://openweathermap.org/img/w/${icon}.png`}
                />
              </WeatherLink>
            )}
          </HeaderContainerLeft>
          <Nav>
            <WebNavLink to="/map">羅瓦涅米地圖</WebNavLink>
            <WebNavLink to="/favorites" onClick={displayMessage}>
              我的最愛
            </WebNavLink>
            {localId ? (
              <LogOut onClick={logoutHandler}>
                登出
                <img src={webMemberIcon} />
              </LogOut>
            ) : null}
            {!localId ? (
              <SignInLink to="/member">
                會員登入
                <img src={webMemberIcon} />
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
