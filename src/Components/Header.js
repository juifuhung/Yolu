import React, { useState, useEffect } from "react";
import HeaderTimer from "./HeaderTimer";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Font } from "../styles/styles";
import headerLogo from "../images/header-yolu.png";

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

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: solid black 1px;
  width: 30%;
  height: 100%;
`;

const WeatherLink = styled(Link)`
  display: flex;
  height: 100%;
  width: 20%;
  background-color: yellow;
  text-decoration: none;
  color: #000000;

  @media (max-width: 1200px) {
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
      </Font>
    </>
  );
};

export default Header;
