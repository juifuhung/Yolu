import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Map.css";
import { v4 as uuidv4 } from "uuid";
import { FaHeart, FaStar } from "react-icons/fa";
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
import Header from "../Components/Header";
import Footer from "../Components/Footer";

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

const Map = () => {
  const center = useMemo(() => ({ lat: 66.533688, lng: 25.75218 }), []);

  const navigate = useNavigate();

  const localId = window.localStorage.getItem("localId");

  const [array, setArray] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getFavorites();
  }, []);

  const getData = async () => {
    try {
      let array = [];
      const querySnapshot = await getDocs(collection(db, "Spots"));
      querySnapshot.forEach((doc) => {
        array.push(doc.data());
      });
      setArray(array);
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
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const categoryHandler = async (category) => {
    try {
      let categoryArray = [];
      const querySnapshot = await getDocs(
        query(collection(db, "Spots"), where("category", "==", `${category}`))
      );
      querySnapshot.forEach((doc) => {
        categoryArray.push(doc.data());
      });
      setArray(categoryArray);
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
    <div>
      <Header />
      <GoogleMap
        zoom={12}
        center={center}
        mapContainerClassName="map-container"
      >
        {array.map((location) => (
          <Marker
            key={uuidv4()}
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
            <div>
              <h1>{selected.title}</h1>
              <p>{selected.description}</p>
              {localId ? (
                favorites.find(
                  (element) => element.title === selected.title
                ) ? (
                  <FaStar
                    onClick={() => {
                      const favoriteItem = favorites.find(
                        (item) => item.title === selected.title
                      );
                      deleteHandler(favoriteItem.id);
                      getFavorites();
                      alert(`removed ${selected.title} from favorite list`);
                    }}
                  />
                ) : (
                  <FaHeart
                    onClick={() => {
                      addToFavorite({
                        category: selected.category,
                        title: selected.title,
                        description: selected.description,
                        img: selected.image,
                      });
                      getFavorites();
                      alert(`added ${selected.title} to favorite list`);
                    }}
                  />
                )
              ) : (
                <FaHeart
                  onClick={() => {
                    alert("please sign in");
                    navigate("/member");
                  }}
                />
              )}
              <img src={selected.image} alt="" />
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      <p>map</p>
      <button
        onClick={() => {
          categoryHandler("museum");
        }}
      >
        museum
      </button>
      <button
        onClick={() => {
          categoryHandler("nature");
        }}
      >
        nature
      </button>
      <button
        onClick={() => {
          categoryHandler("restaurant");
        }}
      >
        restaurant
      </button>
      <button
        onClick={() => {
          categoryHandler("christmas");
        }}
      >
        christmas
      </button>
      <button
        onClick={() => {
          categoryHandler("shopping");
        }}
      >
        shopping
      </button>
      <button
        onClick={() => {
          categoryHandler("transportation");
        }}
      >
        transportation
      </button>
      <button
        onClick={() => {
          getData();
        }}
      >
        show all
      </button>
      <Footer />
    </div>
  );
};

export default Map;
