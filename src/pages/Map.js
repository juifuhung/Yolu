import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaHeart, FaRegHeart, FaRedoAlt } from "react-icons/fa";
import Swal from "sweetalert2";
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
import { useAuth } from "../utils/Firebase";
import Loading from "../images/loading.gif";
import MapCategoryItem from "../components/MapCategoryItem";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

const RotateScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;

  @media (min-width: 391px) {
    display: none;
  }
`;

const RotateIcon = styled(FaRedoAlt)`
  width: 48vw;
  height: 48vw;
  color: #404040;
`;

const RotateWords = styled.h1`
  font-size: 2.2rem;
  color: #404040;
`;

const MapHeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;

  @media (max-width: 391px) {
    display: none;
  }
`;

const LoadingDiv = styled.div`
  top: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  width: 100vw;
  height: 100vh;
`;

const LoadingIcon = styled.div`
  width: 100px;
  height: 100px;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(${Loading});
`;

const MapContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 79vh;

  @media (max-width: 390px) {
    display: none;
  }
`;

const InfoWindowDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: auto;
  position: relative;

  @media (max-width: 850px) {
    width: 350px;
  }

  @media (max-width: 700px) {
    width: 300px;
  }

  @media (max-width: 650px) {
    width: 250px;
  }

  @media (max-width: 600px) {
    width: 200px;
  }

  @media (max-width: 550px) {
    width: 180px;
  }

  @media (max-width: 500px) {
    width: 160px;
  }
`;

const FillHeart = styled(FaHeart)`
  color: #ff0000;
  position: absolute;
  height: 30px;
  width: 30px;
  top: 20px;
  right: 20px;
  cursor: pointer;

  &:hover {
    color: #ff6863;
  }

  @media (max-width: 700px) {
    top: 12px;
    right: 12px;
  }

  @media (max-width: 600px) {
    top: 5px;
    right: 5px;
    height: 15px;
    width: 15px;
  }

  @media (max-width: 500px) {
    height: 10px;
    width: 10px;
  }
`;

const EmptyHeart = styled(FaRegHeart)`
  color: #ff0000;
  position: absolute;
  height: 30px;
  width: 30px;
  top: 20px;
  right: 20px;
  cursor: pointer;

  &:hover {
    color: #ff6863;
  }

  @media (max-width: 700px) {
    top: 12px;
    right: 12px;
  }

  @media (max-width: 600px) {
    top: 5px;
    right: 5px;
    height: 15px;
    width: 15px;
  }

  @media (max-width: 500px) {
    height: 10px;
    width: 10px;
  }
`;

const InfoWindowTitle = styled(Link)`
  color: black;
  text-decoration: none;
  margin: 12px 0 0;
  font-size: 1.4rem;

  @media (max-width: 700px) {
    margin: 6px 0 0;
    font-size: 1.2rem;
  }

  @media (max-width: 600px) {
    margin: 0;
    font-weight: 500;
    font-size: 1rem;
  }
`;

const InfoWindowSubTitle = styled(Link)`
  color: black;
  text-decoration: none;
  margin: 0 0 2px;
  font-size: 0.8rem;
  font-weight: 100;

  @media (max-width: 700px) {
    font-size: 0.6rem;
  }

  @media (max-width: 500px) {
    font-size: 0.5rem;
  }

  @media (max-width: 410px) {
    font-size: 0.4rem;
  }

  @media (max-width: 360px) {
    font-size: 0.2rem;
  }
`;

const InfoWindowDescription = styled(Link)`
  color: black;
  text-decoration: none;
  margin: 5px 0 15px 0;
  font-size: 0.6rem;

  @media (max-width: 850px) {
    margin: 4px 0;
    font-size: 0.5rem;
  }

  @media (max-width: 600px) {
    font-size: 0.3rem;
  }

  @media (max-width: 410px) {
    font-size: 0.2rem;
  }
`;

const InfoWindowImage = styled(Link)`
  width: 100%;
  height: 200px;
  background-image: url(${(props) => props.img});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  @media (max-width: 700px) {
    height: 150px;
  }

  @media (max-width: 620px) {
    height: 120px;
  }

  @media (max-width: 530px) {
    height: 90px;
  }

  @media (max-width: 410px) {
    height: 80px;
  }

  @media (max-width: 380px) {
    height: 70px;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 20px 0 -10px 0;

  @media (max-width: 390px) {
    display: none;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const FooterContainer = styled.div`
  @media (max-width: 390px) {
    display: none;
  }
`;

const categoryArray = [
  { title: "博物館", icon: "https://img.onl/on0zJn" },
  { title: "購物", icon: "https://img.onl/FKDkN6" },
  { title: "餐廳", icon: "https://img.onl/Dw7xbi" },
  { title: "聖誕主題", icon: "https://img.onl/t3NmW1" },
  { title: "自然景觀", icon: "https://img.onl/djbguI" },
  { title: "交通", icon: "https://img.onl/0S0gd6" },
];

let localId;

const Map = () => {
  const [allSpots, setAllSpots] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selected, setSelected] = useState(null);

  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  const center = { lat: 66.536772, lng: 25.779681 };

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
      if (localId) {
        let favoritesArray = [];
        const querySnapshot = await getDocs(
          query(collection(db, "Favorites"), where("localId", "==", localId))
        );
        querySnapshot.forEach((doc) => {
          favoritesArray.push({ ...doc.data(), id: doc.id });
        });
        setFavorites(favoritesArray);
      }
    } catch (e) {
      console.error("Error getting favorite documents: ", e);
    }
  };

  useEffect(() => {
    getData();
    getFavorites();
  }, [localId]);

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
        subtitle: obj.subtitle,
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
    return (
      <LoadingDiv>
        <p>Loading...</p>
        <LoadingIcon />
      </LoadingDiv>
    );
  }

  return (
    <>
      <MapHeaderContainer>
        <Header />
      </MapHeaderContainer>
      <RotateScreenContainer>
        <RotateIcon />
        <RotateWords>請旋轉螢幕</RotateWords>
      </RotateScreenContainer>
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
      <MapContainer>
        <GoogleMap
          zoom={10.4}
          center={center}
          mapContainerStyle={{ width: "85%", height: "90%" }}
        >
          {!showFavorites &&
            allSpots.map((location) => (
              <Marker
                title={location.title}
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
                <InfoWindowTitle
                  to={`/articles/${selected.title}`}
                  title={`查看「${selected.title}」遊記頁面`}
                >
                  {selected.title}
                </InfoWindowTitle>
                {selected.subtitle && (
                  <InfoWindowSubTitle
                    to={`/articles/${selected.title}`}
                    title={`查看「${selected.title}」遊記頁面`}
                  >
                    {selected.subtitle}
                  </InfoWindowSubTitle>
                )}
                <InfoWindowDescription
                  to={`/articles/${selected.title}`}
                  title={`查看「${selected.title}」遊記頁面`}
                >
                  {selected.description}
                </InfoWindowDescription>
                {localId ? (
                  favorites.find(
                    (element) => element.title === selected.title
                  ) ? (
                    <FillHeart
                      title={"移出最愛清單"}
                      onClick={() => {
                        const favoriteItem = favorites.find(
                          (item) => item.title === selected.title
                        );
                        deleteHandler(favoriteItem.id);
                        getFavorites();
                        Swal.fire({
                          confirmButtonColor: "#3085d6",
                          title: `已將「${selected.title}」移出最愛清單`,
                        });
                      }}
                    />
                  ) : (
                    <EmptyHeart
                      title={"加入最愛清單"}
                      onClick={() => {
                        addToFavorite({
                          category: selected.category,
                          title: selected.title,
                          subtitle: selected.subtitle,
                          description: selected.description,
                          img: selected.image,
                          lng: selected.lng,
                          lat: selected.lat,
                          icon: selected.icon,
                        });
                        getFavorites();
                        Swal.fire({
                          icon: "success",
                          confirmButtonColor: "#3085d6",
                          title: `已將「${selected.title}」加入最愛清單`,
                        });
                      }}
                    />
                  )
                ) : (
                  <EmptyHeart
                    title={"加入最愛清單"}
                    onClick={() => {
                      Swal.fire({
                        icon: "error",
                        title: "請先登入",
                        confirmButtonColor: "#3085d6",
                        footer: '<a href="/member">前往登入頁面</a>',
                      });
                    }}
                  />
                )}
                <InfoWindowImage
                  img={selected.image ? selected.image : Loading}
                  to={`/articles/${selected.title}`}
                  title={`查看「${selected.title}」遊記頁面`}
                />
              </InfoWindowDiv>
            </InfoWindow>
          )}
        </GoogleMap>
      </MapContainer>
      <FooterContainer>
        <Footer />
      </FooterContainer>
    </>
  );
};

export default Map;
