import React, { useState, useRef, useEffect } from "react";
import "../CSS/Slide.css";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const slideImages = [
  "https://img.onl/PfqLdd",
  "https://img.onl/IMyMaF",
  "https://img.onl/hzTpbc",
  "https://img.onl/XMlwLx",
  "https://img.onl/vorfwC",
  "https://img.onl/JXDyKX",
];

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

  const localId = window.localStorage.getItem("localId");

  const displayMessage = () => {
    if (!localId) {
      alert("please sign in");
    }
  };

  return (
    <div>
      <Header />
      <h1>Homepage</h1>
      <div
        className="slideShow"
        style={{ overflow: "hidden", position: "relative", zIndex: "2" }}
      >
        <div
          className="slideshowSlider"
          style={{
            width: "100vw",
            height: "850px",
            whiteSpace: "nowrap",
            transform: `translate3d(${-index * 100}%, 0, 0)`,
            transition: "ease 1000ms",
          }}
        >
          {slideImages.map((img, index) => (
            <div
              className="slide"
              key={index}
              style={{
                backgroundImage: `url(${img})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                width: "100%",
                height: "100%",
                display: "inline-block",
              }}
            />
          ))}
        </div>

        <div
          className="slideshowDots"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            position: "absolute",
            bottom: "25px",
          }}
        >
          {slideImages.map((_, idx) => (
            <div
              key={idx}
              className={`slideshowDot${index === idx ? " active" : ""}`}
              style={{
                display: "inline-block",
                height: "20px",
                width: "20px",
                borderRadius: "50%",
                cursor: "pointer",
                margin: "0px 7px 0px",
              }}
              onClick={() => {
                setIndex(idx);
                console.log("hi");
              }}
            ></div>
          ))}
        </div>
      </div>

      <div
        className="selection"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Link to="/map">
          <div
            className="map"
            style={{ width: "500px", height: "500px", backgroundColor: "pink" }}
          >
            Map
          </div>
        </Link>
        <Link to="/favorites">
          <div
            className="favorites"
            style={{ width: "500px", height: "500px", backgroundColor: "aqua" }}
            onClick={displayMessage}
          >
            My Favorites
          </div>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Homepage;
