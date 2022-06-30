import React, { useState, useEffect, useRef, useCallback } from "react";
import { initializeApp } from "firebase/app";
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FavoriteItem from "../components/FavoriteItem";
import FavoritesCategory from "../components/FavoritesCategory";

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

const WelcomeMessage = styled.div`
  display: flex;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  background-color: pink;
  padding: 1rem;
`;

const ButtonArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 150px;
`;

const ItemQuantity = styled.div`
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100px;
  font-size: 1.5rem;
`;

const SortButtonArea = styled.div`
  display: flex;
  justify-content: center;
  height: 100px;
  width: 100vw;
`;

const SortButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px 0 0;
  width: 100px;
  height: 100px;
  font-size: 1rem;
  color: white;
  background-color: black;
  cursor: pointer;
  border-radius: 20%;
`;

const categoryArray = [
  "博物館",
  "自然景觀",
  "餐廳",
  "聖誕主題",
  "購物",
  "交通",
];

const localId = window.localStorage.getItem("localId");
const displayName = window.localStorage.getItem("displayName");

let previousDocumentSnapshots;
let categorySelected;

const Favorites = () => {
  const [totalFavorites, setTotalFavorites] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const observer = useRef();
  const lastFavoriteItem = useCallback((node) => {
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (previousDocumentSnapshots) {
          if (categorySelected) {
            loadMoreItems(categorySelected);
          } else {
            loadMoreItems();
          }
        }

        return;
      }
    });
    if (node) {
      observer.current.observe(node);
    }
  }, []);

  useEffect(() => {
    getTotalFavorites(localId);
    getFavoritesWithPagination(localId);
  }, []);

  const getTotalFavorites = async (localId, category) => {
    let totalFavorites;
    if (!category || category === "undefined") {
      totalFavorites = query(
        collection(db, "Favorites"),
        where("localId", "==", localId)
      );
    } else {
      totalFavorites = query(
        collection(db, "Favorites"),
        where("localId", "==", localId),
        where("category", "==", `${category}`)
      );
    }

    const querySnapshot = await getDocs(totalFavorites);
    let totalFavoriteArray = [];
    querySnapshot.forEach((doc) => {
      totalFavoriteArray.push({ ...doc.data(), id: doc.id });
    });
    setTotalFavorites(totalFavoriteArray);
  };

  const getFavoritesWithPagination = async (localId, category) => {
    try {
      let first;
      if (category) {
        first = query(
          collection(db, "Favorites"),
          where("localId", "==", localId),
          where("category", "==", `${category}`),
          orderBy("created_time"),
          limit(3)
        );
      } else {
        first = query(
          collection(db, "Favorites"),
          where("localId", "==", localId),
          orderBy("created_time"),
          limit(3)
        );
      }

      const documentSnapshots = await getDocs(first);
      let favoritesArray = [];
      documentSnapshots.forEach((doc) => {
        favoritesArray.push({ ...doc.data(), id: doc.id });
      });
      setFavorites(favoritesArray);
      categorySelected = category;
      previousDocumentSnapshots = documentSnapshots;
    } catch (e) {
      console.error("Error getting favorite documents: ", e);
    }
  };

  const loadMoreItems = async (category) => {
    try {
      const lastVisible =
        previousDocumentSnapshots.docs[
          previousDocumentSnapshots.docs.length - 1
        ];
      let next;
      if (category) {
        next = query(
          collection(db, "Favorites"),
          where("localId", "==", localId),
          where("category", "==", category),
          orderBy("created_time"),
          startAfter(lastVisible),
          limit(3)
        );
      } else {
        next = query(
          collection(db, "Favorites"),
          where("localId", "==", localId),
          orderBy("created_time"),
          startAfter(lastVisible),
          limit(3)
        );
      }

      const nextDocumentSnapshots = await getDocs(next);
      let newFavoritesArray = [];
      nextDocumentSnapshots.forEach((doc) => {
        newFavoritesArray.push({ ...doc.data(), id: doc.id });
      });
      setFavorites((prevFavorites) => {
        return [...prevFavorites, ...newFavoritesArray];
      });
      previousDocumentSnapshots = nextDocumentSnapshots;
    } catch (e) {
      console.error("Error getting more favorite documents: ", e);
    }
  };

  const deleteHandler = async (id, category) => {
    try {
      await deleteDoc(doc(db, "Favorites", `${id}`));
      if (!categorySelected) {
        getTotalFavorites(localId);
        getFavoritesWithPagination(localId);
      } else {
        getTotalFavorites(localId, category);
        getFavoritesWithPagination(localId, category);
      }

      window.scroll({ top: 0, behavior: "smooth" });
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const sortFromOldToNew = () => {
    const oldToNewArray = [...favorites].sort((a, b) => {
      return a.created_time.seconds - b.created_time.seconds;
    });
    setFavorites(oldToNewArray);
    window.scroll({ top: 0, behavior: "smooth" });
  };

  const sortFromNewToOld = () => {
    const newToOldArray = [...favorites].sort((a, b) => {
      return b.created_time.seconds - a.created_time.seconds;
    });
    setFavorites(newToOldArray);
    window.scroll({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <ButtonArea>
        {categoryArray.map((category) => (
          <FavoritesCategory
            key={category}
            category={category}
            getTotalFavorites={getTotalFavorites}
            getFavoritesWithPagination={getFavoritesWithPagination}
          />
        ))}
        <FavoritesCategory
          getTotalFavorites={getTotalFavorites}
          getFavoritesWithPagination={getFavoritesWithPagination}
        />
      </ButtonArea>
      <SortButtonArea>
        <SortButton onClick={sortFromOldToNew}>Sort from old to new</SortButton>
        <SortButton onClick={sortFromNewToOld}>Sort from new to old</SortButton>
      </SortButtonArea>
      <WelcomeMessage>{`hi ${displayName}`}</WelcomeMessage>
      {totalFavorites.length > 0 ? (
        categorySelected === undefined ? (
          <ItemQuantity>{`全部共有${totalFavorites.length}個景點`}</ItemQuantity>
        ) : (
          <ItemQuantity>{`${categorySelected}共有${totalFavorites.length}個景點`}</ItemQuantity>
        )
      ) : (
        <ItemQuantity>無景點</ItemQuantity>
      )}

      {favorites &&
        favorites.map((item, index) => {
          if (favorites.length === index + 1) {
            return (
              <FavoriteItem
                ref={lastFavoriteItem}
                key={item.title}
                category={item.category}
                id={item.id}
                title={item.title}
                subtitle={item.subtitle}
                description={item.description}
                img={item.photo}
                timestamp={item.created_time.toDate()}
                deleteHandler={deleteHandler}
              />
            );
          } else {
            return (
              <FavoriteItem
                key={item.title}
                category={item.category}
                id={item.id}
                title={item.title}
                subtitle={item.subtitle}
                description={item.description}
                img={item.photo}
                timestamp={item.created_time.toDate()}
                deleteHandler={deleteHandler}
              />
            );
          }
        })}

      <Footer />
    </>
  );
};

export default React.forwardRef(Favorites);
