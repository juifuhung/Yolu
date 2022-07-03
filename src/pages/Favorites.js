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
import FavoritesCover from "../images/favorites_cover.jpg";
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

const FavoritesCoverSection = styled.div`
  width: 100%;
  height: 250px;
  background-image: url(${FavoritesCover});
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: -1;
  position: relative;
`;

const FavoritesCoverTitle = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-attachment: fixed;
  z-index: -1;
`;

const FavoritesCoverTitleWords = styled.h1`
  margin: 0;
  color: white;
  text-shadow: 5px 5px 4px black;
  font-weight: 800;
  font-size: 4.5rem;
`;

const BodyContainer = styled.div`
  display: flex;
  width: 100%;
`;

const BodyLeft = styled.div`
  width: 20%;
`;

const BodyRight = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserName = styled.div`
  display: flex;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  margin: 2rem 0;
`;

const SubtitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  width: 90%;
  margin-top: 2rem;
`;

const Subtitle = styled.h3`
  margin: 0;
  font-weight: 500;
  color: black;
`;

const TotalQuantity = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  font-size: 1.5rem;
`;

const BodyRightLine = styled.div`
  margin-top: 20px;
  height: 5px;
  width: 90%;
  background-color: black;
`;

const ButtonArea = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 90%;
`;

const SortOptionArea = styled.select`
  display: flex;
  justify-content: center;
  background-color: black;
  color: white;
  height: 30px;
  width: 160px;
  border: none;
  margin-bottom: 2px;
`;

const SortOption = styled.option`
  color: #7a7373;
  background-color: #ece9e9;
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
      <FavoritesCoverSection>
        <FavoritesCoverTitle>
          <FavoritesCoverTitleWords>最愛清單</FavoritesCoverTitleWords>
        </FavoritesCoverTitle>
      </FavoritesCoverSection>
      <BodyContainer>
        <BodyLeft>
          <UserName>{`${displayName}`}</UserName>
        </BodyLeft>
        <BodyRight>
          <SubtitleContainer>
            <Subtitle>
              {categorySelected === undefined ? (
                <TotalQuantity>{`全部共有${totalFavorites.length}個景點`}</TotalQuantity>
              ) : (
                <TotalQuantity>{`${categorySelected}共有${totalFavorites.length}個景點`}</TotalQuantity>
              )}
            </Subtitle>
            <SortOptionArea>
              <option selected disabled hidden>
                排序依據
              </option>
              <SortOption onClick={sortFromOldToNew}>
                新增日期（舊到新）
              </SortOption>
              <SortOption onClick={sortFromNewToOld}>
                新增日期（新到舊）
              </SortOption>
            </SortOptionArea>
          </SubtitleContainer>
          <BodyRightLine />
          <ButtonArea>
            <FavoritesCategory
              getTotalFavorites={getTotalFavorites}
              getFavoritesWithPagination={getFavoritesWithPagination}
            />
            {categoryArray.map((category) => (
              <FavoritesCategory
                key={category}
                category={category}
                getTotalFavorites={getTotalFavorites}
                getFavoritesWithPagination={getFavoritesWithPagination}
              />
            ))}
          </ButtonArea>

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
        </BodyRight>
      </BodyContainer>

      <Footer />
    </>
  );
};

export default React.forwardRef(Favorites);
