import React, { useState, useEffect } from "react";
import HeaderTimer from "./HeaderTimer";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container } from "../styles/styles";
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

const WeatherSection = styled.div`
  display: flex;
  height: 100%;
  width: 30%;
  background-color: yellow;
`;

const WeatherSectionLeft = styled.section`
  display: flex;
  flex-direction: column;
  align-items: start;
  height: 100%;
  width: 50%;
`;

const WeatherInformationMain = styled.section`
  display: flex;
  justify-content: flex-end;
  font-size: 35px;
  background-color: white;
`;

const WeatherLeftContent = styled.div`
  width: 50%;
  height: 50%;
`;

const WeatherIcon = styled.div`
  width: 50px;
  height: 50px;
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
      <Container>
        <HeaderContainer>
          <HeaderContainerLeft>
            <HomepageLink to="/">
              <img src={headerLogo} />
            </HomepageLink>
            <WeatherSection>
              <WeatherSectionLeft>
                <WeatherInformationMain>{weatherMain}</WeatherInformationMain>
                <WeatherLeftContent>{temperature} °C</WeatherLeftContent>
              </WeatherSectionLeft>
              <WeatherIcon
                icon={`http://openweathermap.org/img/w/${icon}.png`}
              />
            </WeatherSection>
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
      </Container>
    </>
  );
};

export default Header;
