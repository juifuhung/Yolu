import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { v4 } from "uuid";
import {
  useAuth,
  getDisplayName,
  setDocumentToFirestore,
  deleteFireStoreDocument,
  getFirestoreDocument,
  getFirestoreDocumentsWithQuery,
  favoritesGetFirestoreDocumentsWithPagination,
  favoritesLoadMoreItems,
} from "../utils/Firebase";
import {
  getDownloadURL,
  uploadBytes,
  deleteObject,
  ref,
} from "firebase/storage";
import { storage } from "../utils/Firebase";
import "../styles/yesOrNo.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FavoriteItem from "../components/FavoriteItem";
import FavoritesCategory from "../components/FavoritesCategory";
import FavoritesCover from "../images/favorites_cover.jpg";
import DefaultProfile from "../images/defaultProfile.jpg";
import ProfileCamera from "../images/profie_camera.jpg";
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
  min-height: 65vh;
  margin-bottom: 20px;

  @media (max-width: 1100px) {
    flex-direction: column;
    align-items: center;
  }
`;

const BodyLeft = styled.div`
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  @media (max-width: 1100px) {
    justify-content: flex-start;
    width: 90%;
  }
`;

const ProfileImageLabel = styled.label`
  width: 100px,
  height: 100px,
  display: flex,
  justify-content: center,
  align-items: center,
  
`;

const ProfileImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  background-image: url(${(props) => props.img});
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
  border-radius: 50%;
  cursor: pointer;
  margin-top: 3rem;
  border: ${(props) => (props.default ? "solid 3px #afabab" : "none")};
`;

const UploadProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
  display: none;
  ${ProfileImage}:hover & {
    display: flex;
  }
`;

const ImageInput = styled.input`
  display: none;
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
let previousDocumentSnapshots;
let categorySelected;

const scrollToTop = () => {
  window.scroll({ top: 0, behavior: "smooth" });
};

const scrollTo250PxFromTop = () => {
  window.scroll({ top: 250, behavior: "smooth" });
};

const Favorites = () => {
  const [displayName, setDisplayName] = useState("");
  const [totalFavorites, setTotalFavorites] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState(categoryArray);
  const [allCategoriesSelected, setAllCategoriesSelected] = useState(false);
  const [image, setImage] = useState();
  const [imgUrl, setImgUrl] = useState("");
  const [imgPath, setImgPath] = useState("");

  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  useEffect(() => {
    if (image) {
      const uploadImg = async () => {
        const imgRef = ref(storage, `profile-pictures/${displayName + v4()}`);
        if (imgPath) {
          await deleteObject(ref(storage, imgPath));
        }
        const snap = await uploadBytes(imgRef, image);
        const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
        setImgUrl(url);
        await setDocumentToFirestore("ProfilePic", localId, { image: url });
        setImgPath(snap.ref.fullPath);
        setImage(undefined);
      };
      uploadImg();
    }
  }, [image]);

  const showDisplayName = async (localId) => {
    try {
      if (localId) {
        setDisplayName(await getDisplayName("User", localId));
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "無法讀取您的名稱",
        confirmButtonColor: "#3085d6",
        // footer: '<a href="">回報問題</a>',
      });
    }
  };

  const getProfilePic = async (localId) => {
    if (localId) {
      const docSnap = await getFirestoreDocument("ProfilePic", localId);
      setImgUrl(docSnap.data().image);
    }
  };

  const observer = useRef();
  const lastFavoriteItem = useCallback((node) => {
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && previousDocumentSnapshots) {
        if (categorySelected) {
          loadMoreItems(categorySelected);
        } else {
          loadMoreItems();
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
    getProfilePic(localId);
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
    } catch {
      Swal.fire({
        icon: "error",
        title: "讀取最愛清單數量時發生錯誤",
        confirmButtonColor: "#3085d6",
        // footer: '<a href="">回報問題</a>',
      });
    }

    let totalFavoritesArray = [];
    querySnapshot.forEach((doc) => {
      totalFavoritesArray.push({ ...doc.data(), id: doc.id });
    });
    setTotalFavorites(totalFavoritesArray);
  };

  const getFavoritesWithPagination = async (localId, category) => {
    try {
      if (localId) {
        let documentSnapshots;
        if (!category) {
          categorySelected = undefined;
          documentSnapshots =
            await favoritesGetFirestoreDocumentsWithPagination(
              "Favorites",
              "localId",
              "==",
              localId,
              null,
              null,
              null,
              "created_time",
              3
            );
        } else {
          categorySelected = category;
          documentSnapshots =
            await favoritesGetFirestoreDocumentsWithPagination(
              "Favorites",
              "localId",
              "==",
              localId,
              "category",
              "==",
              `${category}`,
              "created_time",
              3
            );
        }

        let favoritesArray = [];
        documentSnapshots.forEach((doc) => {
          favoritesArray.push({ ...doc.data(), id: doc.id });
        });
        setFavorites(favoritesArray);
        previousDocumentSnapshots = documentSnapshots;
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "讀取最愛清單資料時發生錯誤",
        confirmButtonText: "回首頁",
        confirmButtonColor: "#3085d6",
        // footer: '<a href="">回報問題</a>',
      }).then(() => {
        window.location = "/";
      });
    }
  };

  const loadMoreItems = async (category) => {
    try {
      const lastVisible =
        previousDocumentSnapshots.docs[
          previousDocumentSnapshots.docs.length - 1
        ];
      if (lastVisible) {
        let nextDocumentSnapshots;
        if (!category) {
          nextDocumentSnapshots = await favoritesLoadMoreItems(
            "Favorites",
            "localId",
            "==",
            localId,
            null,
            null,
            null,
            "created_time",
            lastVisible,
            3
          );
        } else {
          nextDocumentSnapshots = await favoritesLoadMoreItems(
            "Favorites",
            "localId",
            "==",
            localId,
            "category",
            "==",
            category,
            "created_time",
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
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "載入更多最愛清單資料時發生錯誤",
        confirmButtonColor: "#3085d6",
        // footer: '<a href="">回報問題</a>',
      });
    }
  };

  const deleteHandler = (id) => {
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
  };

  const sortFromOldToNew = () => {
    const oldToNewArray = [...favorites].sort((a, b) => {
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

  const categorySelectionHandler = (i) => {
    setAllCategoriesSelected(false);
    const newCategoryArray = [...categoryArray].map((item, index) => {
      if (i === index) {
        return { ...item, selected: !item.selected };
      } else {
        return item;
      }
    });
    setCategories(newCategoryArray);
  };

  const unselectCategoryHandler = () => {
    setAllCategoriesSelected(true);
    setCategories(categoryArray);
  };

  return (
    <>
      <FavoritesHeaderContainer>
        <Header />
      </FavoritesHeaderContainer>
      <FavoritesCoverSection>
        <FavoritesCoverTitle>
          <FavoritesCoverTitleWords>最愛清單</FavoritesCoverTitleWords>
        </FavoritesCoverTitle>
      </FavoritesCoverSection>
      <BodyContainer>
        <BodyLeft>
          <ProfileImageLabel htmlFor="photo">
            {imgUrl ? (
              <ProfileImage img={imgUrl} alt="Loading Image...">
                <UploadProfileImage src={ProfileCamera} />
              </ProfileImage>
            ) : (
              <ProfileImage
                img={DefaultProfile}
                default={true}
                alt="Loading Image..."
              >
                <UploadProfileImage src={ProfileCamera} />
              </ProfileImage>
            )}
            <ImageInput
              type="file"
              accept="image/*"
              id="photo"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
          </ProfileImageLabel>
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
              <SortOption
                onClick={() => {
                  sortFromOldToNew(), scrollTo250PxFromTop();
                }}
              >
                由舊到新
              </SortOption>
              <SortOption
                onClick={() => {
                  sortFromNewToOld(), scrollTo250PxFromTop();
                }}
              >
                由新到舊
              </SortOption>
            </SortOptionArea>
          </SubtitleContainer>
          <BodyRightLine />
          <ButtonArea>
            <FavoritesCategory
              selected={allCategoriesSelected}
              unselectCategoryHandler={unselectCategoryHandler}
              categorySelectionHandler={categorySelectionHandler}
              getTotalFavorites={getTotalFavorites}
              getFavoritesWithPagination={getFavoritesWithPagination}
              scrollTo250PxFromTop={scrollTo250PxFromTop}
            />
            {categories.map((category, index) => (
              <FavoritesCategory
                key={category.title}
                category={category.title}
                selected={category.selected}
                index={index}
                categorySelectionHandler={categorySelectionHandler}
                getTotalFavorites={getTotalFavorites}
                getFavoritesWithPagination={getFavoritesWithPagination}
                scrollTo250PxFromTop={scrollTo250PxFromTop}
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
                    image={item.image}
                    timestamp={item.created_time.toDate()}
                    deleteHandler={deleteHandler}
                    scrollToTop={scrollToTop}
                    getTotalFavorites={getTotalFavorites}
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
                    subtitle={item.subtitle}
                    description={item.description}
                    image={item.image}
                    timestamp={item.created_time.toDate()}
                    deleteHandler={deleteHandler}
                    scrollToTop={scrollToTop}
                    getTotalFavorites={getTotalFavorites}
                    getFavoritesWithPagination={getFavoritesWithPagination}
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
