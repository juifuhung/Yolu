import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  const localId = window.localStorage.getItem("localId");

  const displayMessage = () => {
    if (!localId) {
      alert("please sign in");
    }
  };

  const logoutHandler = () => {
    window.localStorage.removeItem("localId");
    alert("logged out");
    location.replace("./");
  };

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
      {localId ? <button onClick={logoutHandler}>Log out</button> : null}
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
    </div>
  );
};

export default Homepage;
