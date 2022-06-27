import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
      <h1>Homepage</h1>
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
      </SlideShow>

      <Selection>
        <Link style={{ textDecoration: "none" }} to="/map">
          <Map>Map</Map>
        </Link>
        <Link style={{ textDecoration: "none" }} to="/favorites">
          <MyFavorites onClick={displayMessage}>My Favorites</MyFavorites>
        </Link>
      </Selection>
      <Footer />
    </>
  );
};

export default Homepage;
