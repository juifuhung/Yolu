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

let previousDocumentSnapshots;
let previousDocumentSnapshotsWithCategory;

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
        console.log(previousDocumentSnapshots);
        console.log(previousDocumentSnapshotsWithCategory);
        if (previousDocumentSnapshotsWithCategory) {
          categoryLoadMoreItems();
        } else {
          console.log("hi");
          loadMoreItems();
        }
        return;
      }
    });
    if (node) {
      observer.current.observe(node);
    }
  }, []);

  const getTotalFavorites = async (localId, category) => {
    if (!category || category === "undefined") {
      console.log("沒選");
      const totalFavorites = query(
        collection(db, "Favorites"),
        where("localId", "==", localId)
      );

      const querySnapshot = await getDocs(totalFavorites);
      let totalFavoriteArray = [];
      querySnapshot.forEach((doc) => {
        totalFavoriteArray.push(doc.data());
      });
      setTotalFavorites(totalFavoriteArray);
    } else {
      console.log("有選種類要走這");
      console.log(category);
      const totalCategoryFavorites = query(
        collection(db, "Favorites"),
        where("localId", "==", localId),
        where("category", "==", `${category}`)
      );

      const querySnapshot = await getDocs(totalCategoryFavorites);
      let totalCategoryFavoriteArray = [];
      querySnapshot.forEach((doc) => {
        totalCategoryFavoriteArray.push(doc.data());
      });
      setTotalFavorites(totalCategoryFavoriteArray);
    }
  };

  const getFavoritesWithPagination = async (localId) => {
    try {
      console.log("getFavoritesWithPagination");
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
      setFavorites(favoritesArray);
      previousDocumentSnapshots = documentSnapshots;
      previousDocumentSnapshotsWithCategory = undefined;
    } catch (e) {
      console.error("Error getting favorite documents: ", e);
    }
  };

  const loadMoreItems = async () => {
    try {
      console.log("loadMoreItems");
      const lastVisible =
        previousDocumentSnapshots.docs[
          previousDocumentSnapshots.docs.length - 1
        ];
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
      setFavorites((prevFavorites) => {
        return [...prevFavorites, ...newFavoritesArray];
      });
      previousDocumentSnapshots = nextDocumentSnapshots;
    } catch (e) {
      console.error("Error getting more favorite documents: ", e);
    }
  };

  useEffect(() => {
    getTotalFavorites(localId);
    getFavoritesWithPagination(localId);
  }, []);

  const deleteHandler = async (id) => {
    try {
      await deleteDoc(doc(db, "Favorites", `${id}`));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const categoryHandlerWithPagination = async (category) => {
    try {
      console.log("categoryHandlerWithPagination");
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
      setFavorites(categoryArray);
      console.log(categoryDocumentSnapshots);
      previousDocumentSnapshots = undefined;
      previousDocumentSnapshotsWithCategory = categoryDocumentSnapshots;
    } catch (e) {
      console.error("Error getting favorite documents: ", e);
    }
  };

  const categoryLoadMoreItems = async (category) => {
    try {
      console.log("categoryLoadMoreItems");
      const categoryLastVisible =
        previousDocumentSnapshotsWithCategory.docs[
          previousDocumentSnapshotsWithCategory.docs.length - 1
        ];

      const next = query(
        collection(db, "Favorites"),
        where("localId", "==", localId),
        where("category", "==", `${category}`),
        orderBy("created_time"),
        startAfter(categoryLastVisible),
        limit(3)
      );

      const categoryNextDocumentSnapshots = await getDocs(next);
      let newCategoryArray = [];
      categoryNextDocumentSnapshots.forEach((doc) => {
        newCategoryArray.push(doc.data());
      });
      setFavorites((prevCategoryFavorites) => {
        return [...prevCategoryFavorites, ...newCategoryArray];
      });
      previousDocumentSnapshotsWithCategory = categoryNextDocumentSnapshots;
    } catch (e) {
      console.error("Error getting more favorite documents: ", e);
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
      {console.log(totalFavorites)}
      {console.log(favorites)}
      <ButtonArea>
        {categoryArray.map((category) => (
          <FavoritesCategory
            key={category}
            category={category}
            getTotalFavorites={getTotalFavorites}
            categoryHandlerWithPagination={categoryHandlerWithPagination}
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
        <ItemQuantity>{`共有${totalFavorites.length}個景點`}</ItemQuantity>
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
                description={item.description}
                img={item.photo}
                timestamp={item.created_time.toDate()}
                deleteHandler={deleteHandler}
                getFavoritesWithPagination={getFavoritesWithPagination}
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
                getFavoritesWithPagination={getFavoritesWithPagination}
              />
            );
          }
        })}

      <Footer />
    </>
  );
};

export default React.forwardRef(Favorites);
