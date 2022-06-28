import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import styled from "styled-components";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDocs,
  collection,
  doc,
  addDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MapCategoryItem from "../components/MapCategoryItem";

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

const InfoWindowDiv = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  height: auto;
  position: relative;
`;

const FillHeart = styled(FaHeart)`
  color: #ff0000;
  position: absolute;
  height: 30px;
  width: 30px;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

const EmptyHeart = styled(FaRegHeart)`
  color: #ff0000;
  position: absolute;
  height: 30px;
  width: 30px;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

const InfoWindowTitle = styled.h5`
  margin: 12px 0 0;
  font-size: 1.8rem;
`;

const InfoWindowSubTitle = styled.h6`
  margin: 0 0 2px;
  font-size: 0.8rem;
  font-weight: 100;
`;

const InfoWindowDescription = styled.p`
  margin: 5px 0 15px 0;
  font-size: 1rem;
`;

const InfoWindowImage = styled.div`
  width: 590px;
  height: 300px;
  background-image: url(${(props) => props.img});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 17px 0;
`;

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 100%;

  @media (max-width: 340px) {
    height: 234px;
  }
`;

const categoryArray = [
  { title: "博物館", icon: "https://img.onl/on0zJn" },
  { title: "自然", icon: "https://img.onl/djbguI" },
  { title: "餐廳", icon: "https://img.onl/Dw7xbi" },
  { title: "聖誕主題", icon: "https://img.onl/t3NmW1" },
  { title: "購物", icon: "https://img.onl/FKDkN6" },
  { title: "交通", icon: "https://img.onl/0S0gd6" },
];

const localId = window.localStorage.getItem("localId");

const Map = () => {
  const [allSpots, setAllSpots] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selected, setSelected] = useState(null);

  const center = { lat: 66.533688, lng: 25.75218 };

  const navigate = useNavigate();

  useEffect(() => {
    getData();
    getFavorites();
  }, []);

  const showFavoriteHandler = () => {
    setShowFavorites(true);
  };

  const getData = async () => {
    setShowFavorites(false);
    try {
      let allSpotsArray = [];
      const querySnapshot = await getDocs(collection(db, "Spots"));
      querySnapshot.forEach((doc) => {
        allSpotsArray.push(doc.data());
      });
      setAllSpots(allSpotsArray);
    } catch (e) {
      console.error("Error getting document: ", e);
    }
  };

  const getFavorites = async () => {
    try {
      let favoritesArray = [];
      const querySnapshot = await getDocs(
        query(collection(db, "Favorites"), where("localId", "==", localId))
      );
      querySnapshot.forEach((doc) => {
        favoritesArray.push({ ...doc.data(), id: doc.id });
      });
      setFavorites(favoritesArray);
    } catch (e) {
      console.error("Error getting favorite documents: ", e);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await deleteDoc(doc(db, "Favorites", `${id}`));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const addToFavorite = async (obj) => {
    try {
      await addDoc(collection(db, "Favorites"), {
        title: obj.title,
        category: obj.category,
        description: obj.description,
        photo: obj.img,
        created_time: new Date(),
        localId: localId,
        lng: obj.lng,
        lat: obj.lat,
        icon: obj.icon,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const categoryHandler = async (category) => {
    setShowFavorites(false);
    try {
      let categoryArray = [];
      const querySnapshot = await getDocs(
        query(collection(db, "Spots"), where("category", "==", `${category}`))
      );
      querySnapshot.forEach((doc) => {
        categoryArray.push(doc.data());
      });
      setAllSpots(categoryArray);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <GoogleMap
        zoom={12}
        center={center}
        mapContainerStyle={{ width: "100vw", height: "90vh" }}
      >
        {!showFavorites &&
          allSpots.map((location) => (
            <Marker
              key={location.title}
              icon={location.icon}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => {
                setSelected(location);
              }}
            />
          ))}
        {showFavorites &&
          favorites.map((location) => (
            <Marker
              key={location.title}
              icon={location.icon}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => {
                setSelected(location);
              }}
            />
          ))}
        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
          >
            <InfoWindowDiv>
              <InfoWindowTitle>{selected.title}</InfoWindowTitle>
              {selected.subtitle && (
                <InfoWindowSubTitle>{selected.subtitle}</InfoWindowSubTitle>
              )}
              <InfoWindowDescription>
                {selected.description}
              </InfoWindowDescription>
              {localId ? (
                favorites.find(
                  (element) => element.title === selected.title
                ) ? (
                  <FillHeart
                    onClick={() => {
                      const favoriteItem = favorites.find(
                        (item) => item.title === selected.title
                      );
                      deleteHandler(favoriteItem.id);
                      getFavorites();
                      alert(`已將「${selected.title}」移出最愛清單`);
                    }}
                  />
                ) : (
                  <EmptyHeart
                    onClick={() => {
                      addToFavorite({
                        category: selected.category,
                        title: selected.title,
                        description: selected.description,
                        img: selected.image,
                        lng: selected.lng,
                        lat: selected.lat,
                        icon: selected.icon,
                      });
                      getFavorites();
                      alert(`已將「${selected.title}」加入最愛清單`);
                    }}
                  />
                )
              ) : (
                <FillHeart
                  onClick={() => {
                    alert("請先登入");
                    navigate("/member");
                  }}
                />
              )}
              <InfoWindowImage img={selected.image} />
            </InfoWindowDiv>
          </InfoWindow>
        )}
      </GoogleMap>
      <ButtonSection>
        <Buttons>
          {categoryArray.map((category) => (
            <MapCategoryItem
              key={category.title}
              category={category}
              categoryHandler={categoryHandler}
            />
          ))}

          <MapCategoryItem getData={getData} />
          {localId && (
            <MapCategoryItem
              favorites={favorites}
              showFavoriteHandler={showFavoriteHandler}
            />
          )}
        </Buttons>
      </ButtonSection>
      <Footer />
    </>
  );
};

export default Map;
