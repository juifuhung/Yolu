import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Font } from "../styles/styles";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Timer from "../components/Timer";

const slideImages = [
  "https://img.onl/vlV7aI",
  "https://img.onl/i40I94",
  "https://img.onl/oJI794",
  "https://img.onl/yToflG",
];

const HomepageContainer = styled.div`
  width: 100%;
`;

const SlideShow = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  z-index: 2;
`;

const SlideshowSlider = styled.div`
  height: 440px;
  white-space: nowrap;
  transform: ${(props) => `translate3d(${-props.index * 100}%, 0, 0)`};
  transition: ease 1000ms;

  @media (max-width: 550px) {
    height: 350px;
  }

  @media (max-width: 460px) {
    height: 300px;
  }
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
  width: 100%;
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

  @media (max-width: 360px) {
    height: 8px;
    width: 8px;
  }
`;

const CarouselTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
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
    font-size: 1.4rem;
  }

  @media (max-width: 460px) {
    font-weight: 400;
    font-size: 1.2rem;
  }

  @media (max-width: 360px) {
    font-weight: 300;
    font-size: 1rem;
  }
`;

const MainTimer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300px;

  @media (max-width: 850px) {
    height: 250px;
  }

  @media (max-width: 570px) {
    height: 200px;
  }

  @media (max-width: 490px) {
    height: 180px;
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
    font-weight: 300;
  }

  @media (max-width: 490px) {
    font-size: 1.6rem;
  }
`;

const Selection = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
  width: 100%;

  @media (max-width: 1300px) {
    margin-top: 0px;
  }

  @media (max-width: 800px) {
    flex-direction: column;
    align-items: center;
  }
`;

const MainCircleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin: 50px;
  width: 38vw;
  height: 38vw;
  overflow: hidden;

  @media (max-width: 820px) {
    margin: 20px;
  }

  @media (max-width: 800px) {
    width: 70vw;
    height: 70vw;
  }
`;

const MainCircle = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease-in-out;
  background-image: url(${(props) => props.img});
  background-size: 150%;
  background-position: center;
  text-decoration: none;
  color: white;

  &:hover {
    background-size: 180%;
  }
`;

const MainCircleTitle = styled.h2`
  margin: 0;
  font-size: 8rem;

  &:hover {
    transform: scale(1);
  }

  @media (max-width: 1600px) {
    font-size: 7rem;
  }

  @media (max-width: 1350px) {
    font-size: 6rem;
  }

  @media (max-width: 1160px) {
    font-size: 5rem;
  }

  @media (max-width: 960px) {
    font-size: 4rem;
  }

  @media (max-width: 820px) {
    font-size: 3rem;
  }

  @media (max-width: 800px) {
    font-size: 6rem;
  }

  @media (max-width: 660px) {
    font-size: 5rem;
  }

  @media (max-width: 550px) {
    font-size: 4rem;
  }

  @media (max-width: 410px) {
    font-size: 3rem;
  }
`;

const Next = styled(FaArrowRight)`
  bottom: 45%;
  right: 0;
  position: absolute;
  cursor: pointer;
  width: 20px;
  height: 20px;
  padding: 10px;
  background-color: black;
  color: white;
  z-index: 3;

  @media (max-width: 800px) {
    display: none;
  }
`;

const Previous = styled(FaArrowLeft)`
  bottom: 45%;
  laef: 0;
  position: absolute;
  cursor: pointer;
  width: 20px;
  height: 20px;
  padding: 10px;
  background-color: black;
  color: white;
  z-index: 3;

  @media (max-width: 800px) {
    display: none;
  }
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

  const nextSlide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setIndex((prevIndex) =>
        prevIndex === slideImages.length - 1
          ? slideImages.length - 1
          : prevIndex + 1
      );
    }
  };

  const previousSlide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
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
      <HomepageContainer>
        <Header />
        <Font>
          <SlideShow>
            <SlideshowSlider index={index}>
              {slideImages.map((img, index) => (
                <Slide key={index} img={img} />
              ))}
            </SlideshowSlider>

            <Next onClick={nextSlide} />
            <Previous onClick={previousSlide} />

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
            <MainCircleContainer>
              <MainCircle img={`https://img.onl/PBCUmN`} to="/map">
                <MainCircleTitle>互動地圖</MainCircleTitle>
              </MainCircle>
            </MainCircleContainer>
            <MainCircleContainer>
              <MainCircle
                img={`https://img.onl/MyS2bP`}
                to="/favorites"
                onClick={displayMessage}
              >
                <MainCircleTitle>我的最愛</MainCircleTitle>
              </MainCircle>
            </MainCircleContainer>
          </Selection>
        </Font>
        <Footer />
      </HomepageContainer>
    </>
  );
};

export default Homepage;
