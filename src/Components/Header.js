import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import HeaderTimer from "./HeaderTimer";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaHeart } from "react-icons/fa";
import { Font } from "../styles/styles";
import { useAuth, logOut } from "../utils/Firebase";
import headerLogo from "../images/header-yolu.png";
import webMemberIcon from "../images/web-member-icon.png";
import mobileMemberLoginIcon from "../images/mobile-member-login.png";
import mobileLogOutMemberIcon from "../images/mobile-member-logout.png";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

initializeApp(firebaseConfig);
const db = getFirestore();

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  width: 100%;
  height: 120px;

  @media (min-width: 1500px) {
    box-shadow: 0 2px 5px #c4c4c4;
  }

  @media (max-width: 800px) {
    height: 160px;
  }

  @media (max-width: 570px) {
    height: 140px;
  }
`;

const HeaderContainerLeft = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 55%;
  height: 100%;

  @media (max-width: 1500px) {
    width: 100%;
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
    margin-bottom: 5px;
    height: 40%;
  }
`;

const HeartLink = styled(Link)`
  width: 50px;
  height: 50px;
  position: absolute;
  top: 45px;
  left: 10%;

  @media (min-width: 800px) {
    display: none;
  }

  @media (max-width: 550px) {
    width: 40px;
    height: 40px;
  }

  @media (max-width: 400px) {
    width: 35px;
    height: 35px;
  }
`;

const HeartNumber = styled.p`
  position: absolute;
  top: 5px;
  left: 29%;
  width: 20px;
  color: white;
  margin: 0;
  font-size: 1.6rem;
`;

const Heart = styled(FaHeart)`
  transform: rotate(-35deg);
  width: 100%;
  height: 100%;
  color: #ff0000;

  &:hover {
    animation: shake 0.5s;
    animation-iteration-count: infinite;
  }

  @keyframes shake {
    0% {
      transform: rotate(-39deg);
    }
    10% {
      transform: rotate(-31deg);
    }
    20% {
      transform: rotate(-39deg);
    }
    30% {
      transform: rotate(-31deg);
    }
    40% {
      transform: rotate(-39deg);
    }
    50% {
      transform: rotate(-31deg);
    }
    60% {
      transform: rotate(-39deg);
    }
    70% {
      transform: rotate(-31deg);
    }
    80% {
      transform: rotate(-39deg);
    }
    90% {
      transform: rotate(-31deg);
    }
    100% {
      transform: rotate(-39deg);
    }
  }
`;

const WeatherLink = styled(Link)`
  display: flex;
  height: 100%;
  width: 280px;
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
  font-size: 25px;
  height: 52%;
`;

const Temperature = styled.section`
  display: flex;
  align-items: start;
  font-size: 20px;
  height: 48%;
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
  padding-right: 2%;
  align-items: center;
  width: 35%;
  height: 100%;

  @media (max-width: 1500px) {
    display: none;
  }
`;

const WebNavLink = styled(Link)`
  font-size: 1.8rem;
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
  font-size: 1.8rem;
  text-decoration: none;
  color: #000000;

  &:hover {
    color: #7e7e7e;
  }
`;

const LogOut = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
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

  @media (min-width: 1501px) {
    display: none;
  }

  @media (max-width: 1500px) {
    top: 230px;
  }

  @media (max-width: 800px) {
    top: 250px;
  }
`;

let localId;
const weatherApiKey = process.env.REACT_APP_WEATHER_API_KEY;

const Header = () => {
  const [totalFavorites, setTotalFavorites] = useState([]);
  const [temperature, setTemperature] = useState(0);
  const [icon, setIcon] = useState(undefined);
  const [weatherMain, setWeatherMain] = useState(undefined);

  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  useEffect(() => {
    getTotalFavorites(localId);
  }, [localId]);

  const getTotalFavorites = async (localId) => {
    let totalFavorites;
    totalFavorites = query(
      collection(db, "Favorites"),
      where("localId", "==", `${localId}`)
    );

    const querySnapshot = await getDocs(totalFavorites);
    let totalFavoriteArray = [];
    querySnapshot.forEach((doc) => {
      totalFavoriteArray.push({ ...doc.data(), id: doc.id });
    });
    setTotalFavorites(totalFavoriteArray);
  };

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
            <HeartLink to={"/favorites"}>
              <Heart />
              <HeartNumber>{totalFavorites.length}</HeartNumber>
            </HeartLink>
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
            <WebNavLink to="/map">互動地圖</WebNavLink>
            <WebNavLink to="/articles">遊記專區</WebNavLink>
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
                登入
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
