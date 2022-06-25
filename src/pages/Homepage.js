import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Font } from "../styles/styles";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Timer from "../components/Timer";

const slideImages = [
  "https://img.onl/vlV7aI",
  "https://img.onl/i40I94",
  "https://img.onl/oJI794",
  "https://img.onl/yToflG",
];

const SlideShow = styled.div`
  overflow: hidden;
  position: relative;
  zindex: 2;
`;

const SlideshowSlider = styled.div`
  width: 100vw;
  height: 440px;
  white-space: nowrap;
  transform: ${(props) => `translate3d(${-props.index * 100}%, 0, 0)`};
  transition: ease 1000ms;
`;

const Slide = styled.div`
  background-image: url(${(props) => props.img});
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  display: inline-block;
`;

const SlideShowDots = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  position: absolute;
  bottom: 25px;
`;

const Dot = styled.div`
  display: inline-block;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  margin: 0px 7px;
  background-color: ${(props) => (props.active ? "#ff0000" : "#c4c4c4")};

  &:hover {
    cursor: pointer;
  }
`;

const CarouselTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100vw;
  position: absolute;
  top: -40px;
`;

const CarouselYolu = styled.h1`
  margin: 0;
  font-size: 7rem;
  font-weight: 1200;
  color: white;

  @media (max-width: 770px) {
    font-size: 5rem;
  }
`;

const CarouselChinese = styled.h2`
  margin: 0;
  font-size: 2.2rem;
  font-weight: 800;
  color: white;

  @media (max-width: 770px) {
    font-size: 1.8rem;
  }

  @media (max-width: 550px) {
    font-weight: 600;
    font-size: 1.2rem;
  }
`;

const MainTimer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 300px;

  @media (max-width: 850px) {
    height: 250px;
  }

  @media (max-width: 570px) {
    height: 200px;
  }
`;

const MainTimerTitle = styled.h3`
  color: #ff0000;
  font-size: 2.5rem;

  @media (max-width: 1270px) {
    margin-top: -20px;
  }

  @media (max-width: 950px) {
    font-size: 2.2rem;
  }

  @media (max-width: 570px) {
    font-size: 2rem;
  }

  @media (max-width: 490px) {
    font-size: 1.6rem;
  }
`;

const Selection = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
`;

const Map = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
  color: white;
  text-decoration: none;
  border-radius: 50%;
  width: 500px;
  height: 500px;
  background-color: pink;
`;

const MyFavorites = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
  color: white;
  text-decoration: none;
  border-radius: 50%;
  width: 500px;
  height: 500px;
  background-color: aqua;
`;

const localId = window.localStorage.getItem("localId");

const Homepage = () => {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === slideImages.length - 1 ? 0 : prevIndex + 1
        ),
      5000
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  const displayMessage = () => {
    if (!localId) {
      alert("please sign in");
    }
  };

  return (
    <>
      <Header />
      <Font>
        <SlideShow>
          <SlideshowSlider index={index}>
            {slideImages.map((img, index) => (
              <Slide key={index} img={img} />
            ))}
          </SlideshowSlider>

          <SlideShowDots>
            {slideImages.map((_, idx) => (
              <Dot
                key={idx}
                active={index === idx}
                onClick={() => {
                  setIndex(idx);
                }}
              />
            ))}
          </SlideShowDots>

          <CarouselTitle>
            <CarouselYolu>Yolu</CarouselYolu>
            <CarouselChinese>
              最詳細的羅瓦涅米繁體中文旅遊資訊網
            </CarouselChinese>
          </CarouselTitle>
        </SlideShow>
        <MainTimer>
          <MainTimerTitle>距離聖誕節還有</MainTimerTitle>
          <Timer />
        </MainTimer>

        <Selection>
          <Link style={{ textDecoration: "none" }} to="/map">
            <Map>Map</Map>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/favorites">
            <MyFavorites onClick={displayMessage}>My Favorites</MyFavorites>
          </Link>
        </Selection>
      </Font>
      <Footer />
    </>
  );
};

export default Homepage;
