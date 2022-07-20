import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import {
  useAuth,
  getDisplayName,
  deleteFireStoreDocument,
  getFirestoreDocumentsWithQuery,
  getFirestoreDocumentsWithPagination2,
  getFirestoreDocumentsForLoadMoreItems2,
} from "../utils/Firebase";
import "../styles/yesOrNo.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FavoriteItem from "../components/FavoriteItem";
import FavoritesCategory from "../components/FavoritesCategory";
import FavoritesCover from "../images/favorites_cover.jpg";
import TopIcon from "../images/top.png";
import Loading from "../images/loading.gif";
import NoItemImage from "../images/no_item_found.png";

const FavoritesHeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;
`;

const TopButton = styled.div`
  width: 62px;
  height: 62px;
  background-image: url(${TopIcon});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: fixed;
  bottom: 30px;
  right: 30px;
  cursor: pointer;

  @media (max-width: 1100px) {
    width: 58px;
    height: 58px;
    bottom: 20px;
    right: 20px;
  }

  @media (max-width: 850px) {
    width: 55px;
    height: 55px;
  }

  @media (max-width: 350px) {
    width: 50px;
    height: 50px;
    bottom: 15px;
    right: 15px;
  }

  &:hover {
    animation: shake 0.82s cubic-bezier(0.30, 0.07, 0.19, 0.97) both;
  }

  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1.5px, 0px, 0);
    }
    20%, 80% {
      transform: translate3d(0, 1.5px, 0);
    }
    
    30%, 50%, 70% {
      transform: translate3d(-1.5px, 0, 0);
    }
    40%, 60% {
      transform: translate3d(0, 1.5px, 0);
  }
`;

const FavoritesCoverSection = styled.div`
  width: 100%;
  height: 250px;
  background-image: url(${FavoritesCover});
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;

  @media (max-width: 880px) {
    height: 200px;
  }

  @media (max-width: 420px) {
    height: 160px;
  }
`;

const FavoritesCoverTitle = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-attachment: fixed;
`;

const FavoritesCoverTitleWords = styled.h1`
  margin: 0;
  color: white;
  text-shadow: 5px 5px 4px black;
  font-weight: 800;
  font-size: 4.5rem;

  @media (max-width: 880px) {
    font-size: 3.5rem;
  }

  @media (max-width: 420px) {
    font-size: 3rem;
  }
`;

const BodyContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 58vh;
  margin-bottom: 20px;

  @media (max-width: 1100px) {
    flex-direction: column;
    align-items: center;
  }
`;

const BodyLeft = styled.div`
  width: 20%;
  display: flex;
  justify-content: center;

  @media (max-width: 1100px) {
    justify-content: flex-start;
    width: 90%;
  }
`;

const BodyRight = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1100px) {
    min-height: 30vh;
    width: 100%;
  }
`;

const NoItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 800px;
  width: 90%;
  background-image: url(${NoItemImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  @media (max-width: 1350px) {
    height: 40vh;
  }
`;

const UserName = styled.div`
  display: flex;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  margin: 2rem 0;

  @media (max-width: 1100px) {
    font-size: 1.8rem;
    margin: 1.5rem 0;
  }

  @media (max-width: 420px) {
    font-size: 1.5rem;
  }
`;

const SubtitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  width: 90%;
  height: 35px;
  margin-top: 2rem;

  @media (max-width: 1100px) {
    margin-top: 0;
  }
`;

const Subtitle = styled.h3`
  margin: 0;
  font-weight: 500;
  color: black;
`;

const TotalQuantity = styled.div`
  display: flex;
  justify-content: flex-start;
  width: auto;
  font-size: 1.5rem;

  @media (max-width: 420px) {
    font-size: 1.3rem;
  }
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
  flex-wrap: wrap;
`;

const SortOptionArea = styled.div`
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: end;
  min-width: 60px;

  @media (max-width: 570px) {
    flex-direction: column;
  }
`;

const SortOption = styled.div`
  font-size: 1.1rem;
  cursor: pointer;
  margin-left: 15px;
  color: #767676;

  @media (max-width: 570px) {
    margin-left: 0;
    margin-bottom: 1px;
  }

  @media (max-width: 420px) {
    font-size: 0.9rem;
  }

  &:hover {
    color: #111111;
  }
`;

const LoadingSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoadingWords = styled.p`
  font-size: 1.5rem;
`;

const categoryArray = [
  { title: "博物館", selected: false },
  { title: "購物", selected: false },
  { title: "餐廳", selected: false },
  { title: "聖誕主題", selected: false },
  { title: "自然景觀", selected: false },
  { title: "交通", selected: false },
];

let localId;
let displayName;
let previousDocumentSnapshots;

const Favorites = () => {
  const [totalFavorites, setTotalFavorites] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState(categoryArray);
  const [categorySelected, setCategorySelected] = useState(undefined);
  const [allCategoriesSelected, setAllCategoriesSelected] = useState(false);

  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  const showDisplayName = async (localId) => {
    if (localId) {
      displayName = await getDisplayName("User", localId);
    }
  };

  const scrollToTop = () => {
    window.scroll({ top: 0, behavior: "smooth" });
  };

  const scrollTo250PxFromTop = () => {
    window.scroll({ top: 250, behavior: "smooth" });
  };

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
    showDisplayName(localId);
    getTotalFavorites(localId);
    getFavoritesWithPagination(localId);
  }, [localId]);

  useEffect(() => {
    scrollToTop();
  }, []);

  const getTotalFavorites = async (localId, category) => {
    let querySnapshot;
    try {
      if (!category || category === "undefined") {
        querySnapshot = await getFirestoreDocumentsWithQuery(
          "Favorites",
          "localId",
          "==",
          `${localId}`,
          null,
          null,
          null
        );
      } else {
        querySnapshot = await getFirestoreDocumentsWithQuery(
          "Favorites",
          "localId",
          "==",
          `${localId}`,
          "category",
          "==",
          `${category}`
        );
      }
    } catch (e) {
      console.log(`Error getting total favorites: ${e}`);
    }

    let totalFavoritesArray = [];
    querySnapshot.forEach((doc) => {
      totalFavoritesArray.push({ ...doc.data(), id: doc.id });
    });
    setTotalFavorites(totalFavoritesArray);
  };

  const getFavoritesWithPagination = async (localId, category) => {
    setCategorySelected(category);
    let documentSnapshots;
    try {
      if (category) {
        documentSnapshots = await getFirestoreDocumentsWithPagination2(
          "Favorites",
          "localId",
          "==",
          `${localId}`,
          "category",
          "==",
          `${category}`,
          "create_time",
          3
        );
      } else {
        console.log("ho");
        documentSnapshots = await getFirestoreDocumentsWithPagination2(
          "Favorites",
          "localId",
          "==",
          `${localId}`,
          null,
          null,
          null,
          "create_time",
          3
        );
        console.log(456, documentSnapshots);
      }

      console.log(123, documentSnapshots);
      let favoritesArray = [];
      documentSnapshots.forEach((doc) => {
        favoritesArray.push({ ...doc.data(), id: doc.id });
      });
      setFavorites(favoritesArray);
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
      let nextDocumentSnapshots;
      if (category) {
        nextDocumentSnapshots = await getFirestoreDocumentsForLoadMoreItems2(
          "Favorites",
          "localId",
          "==",
          localId,
          "category",
          "==",
          category,
          "create_time",
          lastVisible,
          3
        );
      } else {
        nextDocumentSnapshots = await getFirestoreDocumentsForLoadMoreItems2(
          "Favorites",
          "localId",
          "==",
          localId,
          null,
          null,
          null,
          "title",
          "create_time",
          lastVisible,
          3
        );
      }

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

  const deleteHandler = (id) => {
    try {
      Swal.fire({
        title: "確定移出最愛清單？",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "是，請移除",
        cancelButtonText: "否",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteFireStoreDocument("Favorites", `${id}`);
          Swal.fire({
            title: "已移除",
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
          scrollToTop();
          getTotalFavorites(localId);
          getFavoritesWithPagination(localId);
        }
      });
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const sortFromOldToNew = () => {
    const oldToNewArray = [...favorites].sort((a, b) => {
      return a.created_time.seconds - b.created_time.seconds;
    });
    setFavorites(oldToNewArray);
    scrollTo250PxFromTop();
  };

  const sortFromNewToOld = () => {
    const newToOldArray = [...favorites].sort((a, b) => {
      return b.created_time.seconds - a.created_time.seconds;
    });
    setFavorites(newToOldArray);
    scrollTo250PxFromTop();
  };

  const selectionHandler = (i) => {
    setAllCategoriesSelected(false);
    const newCategoryArray = [...categoryArray].map((item, index) => {
      if (i === index) {
        return { ...item, selected: !item.selected };
      } else {
        return item;
      }
    });
    setCategories(newCategoryArray);
    scrollTo250PxFromTop();
  };

  const categorySelectionHandler = () => {
    setAllCategoriesSelected(true);
    setCategories(categoryArray);
    scrollTo250PxFromTop();
  };

  return (
    <>
      <FavoritesHeaderContainer>
        <Header />
      </FavoritesHeaderContainer>
      {console.log(favorites)}
      <FavoritesCoverSection>
        <FavoritesCoverTitle>
          <FavoritesCoverTitleWords>最愛清單</FavoritesCoverTitleWords>
        </FavoritesCoverTitle>
      </FavoritesCoverSection>
      <BodyContainer>
        <BodyLeft>
          <UserName>{`你好，${displayName}`}</UserName>
        </BodyLeft>
        <BodyRight>
          <SubtitleContainer>
            <Subtitle>
              {localId && categorySelected === undefined ? (
                <TotalQuantity>{`全部共有${totalFavorites.length}個景點`}</TotalQuantity>
              ) : (
                <TotalQuantity>{`${categorySelected}共有${totalFavorites.length}個景點`}</TotalQuantity>
              )}
            </Subtitle>
            <SortOptionArea>
              <SortOption onClick={sortFromOldToNew}>由舊到新</SortOption>
              <SortOption onClick={sortFromNewToOld}>由新到舊</SortOption>
            </SortOptionArea>
          </SubtitleContainer>
          <BodyRightLine />
          <ButtonArea>
            <FavoritesCategory
              selected={allCategoriesSelected}
              categorySelectionHandler={categorySelectionHandler}
              selectionHandler={selectionHandler}
              getTotalFavorites={getTotalFavorites}
              getFavoritesWithPagination={getFavoritesWithPagination}
            />
            {categories.map((category, index) => (
              <FavoritesCategory
                key={category.title}
                category={category.title}
                selected={category.selected}
                index={index}
                selectionHandler={selectionHandler}
                getTotalFavorites={getTotalFavorites}
                getFavoritesWithPagination={getFavoritesWithPagination}
              />
            ))}
          </ButtonArea>
          {!favorites && (
            <LoadingSection>
              <LoadingWords>Loading...</LoadingWords>
              <img src={Loading} />
            </LoadingSection>
          )}
          {favorites.length === 0 && <NoItem />}
          {favorites.length > 0 &&
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
      <TopButton
        onClick={() => {
          scrollToTop();
        }}
      />
      <Footer />
    </>
  );
};

export default React.forwardRef(Favorites);
