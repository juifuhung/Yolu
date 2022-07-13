import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Font } from "../styles/styles";
import { useAuth } from "../utils/Firebase";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Map from "../images/homepage_map.png";
import Aurora from "../images/homepage_aurora.png";
import River from "../images/homepage_river.png";
import MapGrey from "../images/map_div.png";
import ArticleGrey from "../images/article_div.png";
import FavoriteGrey from "../images/favorite_div.png";
import Header from "../components/Header";
import Footer from "../components/Footer";

const slideImages = [
  "https://img.onl/vlV7aI",
  "https://img.onl/i40I94",
  "https://img.onl/oJI794",
  "https://img.onl/yToflG",
];

const HomepageHeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
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

  @media (max-width: 1100px) {
    height: 390px;
  }

  @media (max-width: 950px) {
    height: 350px;
  }

  @media (max-width: 770px) {
    height: 320px;
  }

  @media (max-width: 600px) {
    height: 280px;
  }

  @media (max-width: 460px) {
    height: 250px;
  }

  @media (max-width: 360px) {
    height: 200px;
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

  @media (max-width: 550px) {
    margin: 0px 5px;
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

  @media (max-width: 700px) {
    top: -35px;
  }

  @media (max-width: 550px) {
    top: -30px;
  }
`;

const CarouselYolu = styled.h1`
  margin: 0;
  font-size: 6.5rem;
  font-weight: 1200;
  color: white;

  @media (max-width: 1100px) {
    font-size: 6rem;
  }

  @media (max-width: 700px) {
    font-size: 5rem;
  }

  @media (max-width: 550px) {
    font-size: 4rem;
  }

  @media (max-width: 360px) {
    font-size: 3rem;
  }
`;

const CarouselChinese = styled.h2`
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  color: white;

  @media (max-width: 1100px) {
    font-size: 1.8rem;
  }

  @media (max-width: 700px) {
    font-size: 1.6rem;
    font-size: 1.4rem;
  }

  @media (max-width: 550px) {
    font-weight: 600;
  }

  @media (max-width: 460px) {
    font-weight: 400;
    font-size: 1.2rem;
  }

  @media (max-width: 360px) {
    font-weight: 300;
    font-size: 1rem;
  }

  @media (max-width: 340px) {
    font-size: 0.9rem;
  }
`;

const Selection = styled.div`
  margin: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  @media (max-width: 1300px) {
    margin-top: 0px;
  }

  @media (max-width: 800px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Container = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: ${(props) =>
    props.align === "left" ? "flex-start" : "flex-end"};
  align-items: center;
  width: 80%;
  height: 400px;
  position: relative;

  @media (max-width: 1100px) {
    height: 340px;
  }

  @media (max-width: 900px) {
    height: 300px;
  }
`;

const Image = styled(Link)`
  width: 75%;
  height: 90%;
  background-image: url(${(props) => props.img});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  animation-duration: 3s;
  animation-name: ${(props) =>
    props.visible === "true"
      ? props.align === "left"
        ? "image-slide-from-left"
        : "image-slide-from-right"
      : ""};
  @keyframes image-slide-from-left {
    from {
      left: -100px;
    }
    to {
      left: 0;
    }
  }

  @keyframes image-slide-from-right {
    from {
      right: -100px;
    }
    to {
      right: 0;
    }
  }
`;

const GreyColorDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 0;
  height: 100%;
  background-color: rgba(34, 34, 34, 0.7);
  position: absolute;
  transition: 0.5s;
  ${Image}:hover & {
    width: 40%;
  }
  z-index: 2;
  left: ${(props) => (props.align === "left" ? "0" : "")};
  right: ${(props) => (props.align === "right" ? "0" : "")};
`;

const GreyColorWordsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 80%;
  height: 80%;
  background-image: url(${(props) => props.img});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

const CategoryTitle = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 270px;
  height: 100px;
  background-color: rgba(255, 0, 0, 0.8);
  font-size: 2.8rem;
  font-weight: 800;
  text-decoration: none;
  color: white;
  position: absolute;
  bottom: 40px;
  animation-duration: 3s;
  animation-name: ${(props) =>
    props.visible === "true"
      ? props.align === "left"
        ? "title-slide-from-right"
        : "title-slide-from-left"
      : ""};
  right: ${(props) => (props.align === "left" ? "10%" : "")};
  left: ${(props) => (props.align === "right" ? "10%" : "")};
  &:hover {
    transform: scale(1.05, 1.05);
    font-size: 3.08rem;
  }

  @media (max-width: 1200px) {
    right: ${(props) => (props.align === "left" ? "8%" : "")};
    left: ${(props) => (props.align === "right" ? "8%" : "")};

    @keyframes title-slide-from-right {
      from {
        opacity: 0;
        right: -100px;
      }
      to {
        opacity: 1;
        right: 8%;
      }
    }

    @keyframes title-slide-from-left {
      from {
        opacity: 0;
        left: -100px;
      }
      to {
        opacity: 1;
        left: 8%;
      }
    }
  }

  @media (max-width: 1000px) {
    right: ${(props) => (props.align === "left" ? "7%" : "")};
    left: ${(props) => (props.align === "right" ? "7%" : "")};

    @keyframes title-slide-from-right {
      from {
        opacity: 0;
        right: -100px;
      }
      to {
        opacity: 1;
        right: 7%;
      }
    }

    @keyframes title-slide-from-left {
      from {
        opacity: 0;
        left: -100px;
      }
      to {
        opacity: 1;
        left: 7%;
      }
    }
  }

  animation-duration: 3s;
  animation-name: ${(props) =>
    props.visible
      ? props.align === "left"
        ? "title-slide-from-right"
        : "title-slide-from-left"
      : ""};

  @keyframes title-slide-from-right {
    from {
      opacity: 0;
      right: -100px;
    }
    to {
      opacity: 1;
      right: 10%;
    }
  }

  @keyframes title-slide-from-left {
    from {
      opacity: 0;
      left: -100px;
    }
    to {
      opacity: 1;
      left: 10%;
    }
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

  @media (max-width: 770px) {
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

  @media (max-width: 770px) {
    display: none;
  }
`;

let localId;

const Homepage = () => {
  const [index, setIndex] = useState(0);
  const [mapVisible, setMapVisible] = useState("false");
  const [articleVisible, setArticleVisible] = useState("false");
  const [favortiesVisible, setFavoritesVisible] = useState("false");
  const timeoutRef = useRef(null);
  const mapRef = useRef();
  const articleRef = useRef();
  const favoritesRef = useRef();

  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  useEffect(() => {
    window.scroll({ top: 0, behavior: "smooth" });
  }, []);

  const options = {
    root: null,
    rootMargin: "500px",
    threshold: 1,
  };

  useEffect(() => {
    const mapObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setMapVisible("true");
      }
    }, options);

    const favoritesObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setFavoritesVisible("true");
      }
    }, options);

    const articleObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setArticleVisible("true");
      }
    }, options);

    mapObserver.observe(mapRef.current);
    favoritesObserver.observe(favoritesRef.current);
    articleObserver.observe(articleRef.current);
  }, []);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const nextSlide = () => {
    resetTimeout();
    setIndex((prevIndex) =>
      prevIndex === slideImages.length - 1
        ? slideImages.length - 1
        : prevIndex + 1
    );
  };

  const previousSlide = () => {
    resetTimeout();
    clearTimeout(timeoutRef.current);
    setIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          slideImages && prevIndex === slideImages.length - 1
            ? 0
            : prevIndex + 1
        ),
      5000
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  const displayMessage = () => {
    if (!localId) {
      alert("請先登入");
    }
  };

  return (
    <>
      <HomepageHeaderContainer>
        <Header />
      </HomepageHeaderContainer>
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

        <Selection>
          <Container align={"left"} ref={mapRef}>
            <Image to={"/map"} img={Map} align={"left"} visible={mapVisible}>
              <GreyColorDiv align={"left"}>
                <GreyColorWordsContainer img={MapGrey} />
              </GreyColorDiv>
            </Image>
            <CategoryTitle to={"/map"} align={"left"} visible={mapVisible}>
              互動地圖
            </CategoryTitle>
          </Container>
          <Container align={"right"} ref={articleRef}>
            <Image
              to={"/articles"}
              img={Aurora}
              align={"right"}
              visible={articleVisible}
            >
              <GreyColorDiv align={"right"}>
                <GreyColorWordsContainer img={ArticleGrey} />
              </GreyColorDiv>
            </Image>
            <CategoryTitle
              to={"/articles"}
              align={"right"}
              visible={articleVisible}
              onClick={displayMessage}
            >
              遊記專區
            </CategoryTitle>
          </Container>
          <Container align={"left"} ref={favoritesRef}>
            <Image
              to={"/favorites"}
              img={River}
              align={"left"}
              visible={favortiesVisible}
            >
              <GreyColorDiv align={"left"}>
                <GreyColorWordsContainer img={FavoriteGrey} />
              </GreyColorDiv>
            </Image>
            <CategoryTitle
              to={"/favorites"}
              align={"left"}
              visible={favortiesVisible}
            >
              我的最愛
            </CategoryTitle>
          </Container>
        </Selection>
      </Font>
      <Footer />
    </>
  );
};

export default Homepage;
