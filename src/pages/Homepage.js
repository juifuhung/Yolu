import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div>
      <h1>Homepage</h1>
      <div className="carousel">
        <img
          src={`https://api.appworks-school.tw/assets/201807242228/keyvisual.jpg`}
          alt=""
          style={{ width: "100vw", height: "300px" }}
        />
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
        <Link to="./favorites">
          <div
            className="map"
            style={{ width: "500px", height: "500px", backgroundColor: "aqua" }}
          >
            My Favorites
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
