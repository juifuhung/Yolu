import React, { useState, useEffect } from "react";
import HeaderTimer from "./HeaderTimer";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Font } from "../styles/styles";
import headerLogo from "../images/header-yolu.png";
import MemberLogo from "../images/web-member-logo.png";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100vw;
  height: 120px;
  border: solid green 1px;
`;

const HeaderContainerLeft = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 50%;
  height: 100%;
  background-color: lightgrey;
`;

const HomepageLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 100%;
  margin: 0 20px 0 20px;
  background-color: yellow;
`;

const WeatherLink = styled(Link)`
  display: flex;
  height: 100%;
  width: 195px;
  background-color: yellow;
  text-decoration: none;
  color: #000000;

  @media (max-width: 1500px) {
    display: none;
  }
`;

const WeatherSectionLeft = styled.section`
  display: flex;
  flex-direction: column;
  align-items: start;
  height: 100%;
  z-index: 2;

  @media (max-width: 1300px) {
    display: none;
  }
`;

const WeatherInformationMain = styled.section`
  display: flex;
  align-items: end;
  font-size: 35px;
  height: 60%;
  background-color: white;
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
  background-color: aqua;
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
  border: solid black 1px;
  width: 40%;
  height: 100%;
`;

const MapLink = styled(Link)`
  font-size: 2rem;
  text-decoration: none;
  color: #000000;
`;

const FavoritesLink = styled(Link)`
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

const LogOutLink = styled(Link)`
  font-size: 2rem;
  text-decoration: none;
  color: #000000;
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
        <HeaderContainer>
          <HeaderContainerLeft>
            <HomepageLink to="/">
              <img src={headerLogo} />
            </HomepageLink>
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
            <HeaderTimer />
          </HeaderContainerLeft>
          <Nav>
            <MapLink to="/map">羅瓦涅米地圖</MapLink>
            <FavoritesLink to="/favorites" onClick={displayMessage}>
              我的最愛
            </FavoritesLink>
            {localId ? (
              <LogOutLink onClick={logoutHandler}>
                登出
                <img src={MemberLogo} />
              </LogOutLink>
            ) : null}
            {!localId ? (
              <SignInLink to="/member">
                會員登入
                <img src={MemberLogo} />
              </SignInLink>
            ) : null}
          </Nav>
        </HeaderContainer>
      </Font>
    </>
  );
};

export default Header;
