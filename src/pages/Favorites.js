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
  "Museum",
  "Nature",
  "Restaurant",
  "Christmas",
  "Shopping",
  "Transportation",
];

const localId = window.localStorage.getItem("localId");
const displayName = window.localStorage.getItem("displayName");

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [favoritesArray, setFavoritesArray] = useState([]);

  let previousDocumentSnapshots;
  let previousDocumentSnapshotsWithCategory;

  const observer = useRef();
  const lastFavoriteItem = useCallback((node) => {
    console.log(node);
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (previousDocumentSnapshotsWithCategory) {
          categoryLoadMoreItems();
        } else {
          loadMoreItems();
        }
        return;
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  const getFavorites = async () => {
    try {
      const first = query(
        collection(db, "Favorites"),
        where("localId", "==", localId),
        orderBy("created_time"),
        limit(3)
      );

      const documentSnapshots = await getDocs(first);
      let favoritesArray = [];
      documentSnapshots.forEach((doc) => {
        favoritesArray.push(doc.data());
      });
      setFavoritesArray(favoritesArray);
      previousDocumentSnapshots = documentSnapshots;
    } catch (e) {
      console.error("Error getting favorite documents: ", e);
    }
  };

  const loadMoreItems = async () => {
    try {
      const lastVisible =
        previousDocumentSnapshots.docs[
          previousDocumentSnapshots.docs.length - 1
        ];
      console.log(lastVisible);
      const next = query(
        collection(db, "Favorites"),
        where("localId", "==", localId),
        orderBy("created_time"),
        startAfter(lastVisible),
        limit(3)
      );

      const nextDocumentSnapshots = await getDocs(next);
      let newFavoritesArray = [];
      nextDocumentSnapshots.forEach((doc) => {
        newFavoritesArray.push(doc.data());
      });
      setFavoritesArray((prevFavorites) => {
        return [...prevFavorites, ...newFavoritesArray];
      });
      previousDocumentSnapshots = nextDocumentSnapshots;
    } catch (e) {
      console.error("Error getting more favorite documents: ", e);
    }
  };

  useEffect(() => {
    getFavorites(localId);
  }, []);

  const deleteHandler = async (id) => {
    try {
      await deleteDoc(doc(db, "Favorites", `${id}`));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  // const categoryHandler = async (category) => {
  //   try {
  //     let categoryArray = [];
  //     const querySnapshot = await getDocs(
  //       query(
  //         collection(db, "Favorites"),
  //         where("localId", "==", localId),
  //         where("category", "==", `${category}`)
  //       )
  //     );
  //     querySnapshot.forEach((doc) => {
  //       categoryArray.push(doc.data());
  //     });
  //     setFavoritesArray(categoryArray);
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  // };

  const categoryHandler = async (category) => {
    try {
      const first = query(
        collection(db, "Favorites"),
        where("localId", "==", localId),
        where("category", "==", `${category}`),
        orderBy("created_time"),
        limit(3)
      );

      const categoryDocumentSnapshots = await getDocs(first);
      let categoryArray = [];
      categoryDocumentSnapshots.forEach((doc) => {
        categoryArray.push(doc.data());
      });
      setFavoritesArray(categoryArray);
      previousDocumentSnapshotsWithCategory = categoryDocumentSnapshots;
    } catch (e) {
      console.error("Error getting favorite documents: ", e);
    }
  };

  const categoryLoadMoreItems = async (category) => {
    try {
      const lastVisible =
        previousDocumentSnapshotsWithCategory.docs[
          previousDocumentSnapshotsWithCategory.docs.length - 1
        ];
      const next = query(
        collection(db, "Favorites"),
        where("localId", "==", localId),
        where("category", "==", `${category}`),
        orderBy("created_time"),
        startAfter(lastVisible),
        limit(3)
      );

      const categoryNextDocumentSnapshots = await getDocs(next);
      let newCategoryArray = [];
      categoryNextDocumentSnapshots.forEach((doc) => {
        newCategoryArray.push(doc.data());
      });
      setFavoritesArray((prevFavorites) => {
        return [...prevFavorites, ...newCategoryArray];
      });
      previousDocumentSnapshots = categoryNextDocumentSnapshots;
    } catch (e) {
      console.error("Error getting more favorite documents: ", e);
    }
  };

  const sortFromOldToNew = () => {
    const oldToNewArray = [...favoritesArray].sort((a, b) => {
      return a.created_time.seconds - b.created_time.seconds;
    });
    setFavorites(oldToNewArray);
  };

  const sortFromNewToOld = () => {
    const newToOldArray = [...favorites].sort((a, b) => {
      return b.created_time.seconds - a.created_time.seconds;
    });
    setFavorites(newToOldArray);
  };

  return (
    <>
      <Header />
      {console.log(favoritesArray)}
      <WelcomeMessage>{`hi ${displayName}`}</WelcomeMessage>
      {favorites.length === 1 ? (
        <ItemQuantity>{`${favorites.length} item on the list`}</ItemQuantity>
      ) : favorites.length > 1 ? (
        <ItemQuantity>{`${favorites.length} items on the list`}</ItemQuantity>
      ) : (
        <ItemQuantity>No Item Found</ItemQuantity>
      )}
      {favoritesArray &&
        favoritesArray.map((item, index) => {
          if (favoritesArray.length === index + 1) {
            return (
              <FavoriteItem
                ref={lastFavoriteItem}
                key={item.title}
                category={item.category}
                id={item.id}
                title={item.title}
                description={item.description}
                img={item.photo}
                timestamp={item.created_time.toDate()}
                deleteHandler={deleteHandler}
                getFavorites={getFavorites}
              />
            );
          } else {
            return (
              <FavoriteItem
                key={item.title}
                category={item.category}
                id={item.id}
                title={item.title}
                description={item.description}
                img={item.photo}
                timestamp={item.created_time.toDate()}
                deleteHandler={deleteHandler}
                getFavorites={getFavorites}
              />
            );
          }
        })}
      <ButtonArea>
        {categoryArray.map((category) => (
          <FavoritesCategory
            key={category}
            category={category}
            categoryHandler={categoryHandler}
            getFavorites={getFavorites}
          />
        ))}
        <FavoritesCategory
          categoryHandler={categoryHandler}
          getFavorites={getFavorites}
        />
      </ButtonArea>
      <SortButtonArea>
        <SortButton onClick={sortFromOldToNew}>Sort from old to new</SortButton>
        <SortButton onClick={sortFromNewToOld}>Sort from new to old</SortButton>
      </SortButtonArea>
      <Footer />
    </>
  );
};

export default React.forwardRef(Favorites);
