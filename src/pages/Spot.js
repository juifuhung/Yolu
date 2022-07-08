import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  startAfter,
} from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SpotItem from "../components/SpotItem";
import TopIcon from "../images/top.png";

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

const TopButton = styled.div`
  width: 100px;
  height: 100px;
  background-image: url(${TopIcon});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: fixed;
  bottom: 50px;
  left: 30px;
  cursor: pointer;

  @media (max-width: 1100px) {
    width: 80px;
    height: 80px;
  }

  @media (max-width: 850px) {
    width: 60px;
    height: 60px;
    bottom: 30px;
    left: 20px;
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

const FavoritesHeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;
`;

const BodyContainer = styled.div`
  width: 100%;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SpotsCover = styled.div`
  width: 100%;
  height: 250px;
  margin-bottom: 2rem;
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: top;
  position: relative;

  @media (max-width: 880px) {
    height: 200px;
  }

  @media (max-width: 420px) {
    height: 160px;
  }
`;

const SpotsCoverTitle = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SpotsCoverTitleWords = styled.h1`
  margin: 0;
  color: white;
  text-shadow: 5px 5px 4px black;
  font-weight: 800;
  font-size: 4.5rem;

  @media (max-width: 880px) {
    font-size: 3.5rem;
  }

  @media (max-width: 460px) {
    font-size: 2.5rem;
  }

  @media (max-width: 360px) {
    font-size: 2rem;
  }
`;

const SortSection = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 18%;
  width: 100%;

  @media (max-width: 460px) {
    bottom: 26%;
  }

  @media (max-width: 420px) {
    bottom: 21%;
  }

  @media (max-width: 360px) {
    bottom: 10%;
    flex-direction: column;
    align-items: center;
  }
`;

const SortWords = styled.div`
  color: ${(props) => (props.selected ? "white" : "#e5e5e5")};
  font-size: 1.2rem;
  font-weight: 400;
  text-shadow: 1px 1px 3px black;
  display: flex;
  cursor: pointer;
  justify-content: ${(props) =>
    props.position === "left" ? "flex-end" : "flex-start"};
  margin-right: ${(props) => (props.position === "left" ? "10px" : "0")};
  margin-left: ${(props) => (props.position === "left" ? "0" : "10px")};
  width: 40%;

  &:hover {
    color: white;
  }

  @media (max-width: 880px) {
    font-size: 1.1rem;
    margin-right: ${(props) => (props.position === "left" ? "6px" : "0")};
    margin-left: ${(props) => (props.position === "left" ? "0" : "6px")};
  }

  @media (max-width: 460px) {
    font-size: 0.8rem;
    margin-right: ${(props) => (props.position === "left" ? "4px" : "0")};
    margin-left: ${(props) => (props.position === "left" ? "0" : "4px")};
  }

  @media (max-width: 360px) {
    width: 100%;
    justify-content: center;
    margin: 1px 0;
    font-size: 0.6rem;
  }
`;

const ArticleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const NoArticle = styled.div`
  margin-bottom: 2rem;
  font-size: 4rem;
  font-weight: 800;
`;

let previousDocumentSnapshots;

const Spot = () => {
  const [spots, setSpots] = useState([]);
  const [newToOldSelected, setNewToOldSelected] = useState(false);
  const [oldToNewSelected, setOldToNewSelected] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState("");

  const params = useParams();

  const observer = useRef();
  const lastSpotItem = useCallback((node) => {
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (previousDocumentSnapshots) {
          loadMoreItems();
        }
        return;
      }
    });
    if (node) {
      observer.current.observe(node);
    }
  }, []);

  const getSpotsWithPagination = async () => {
    let first;
    try {
      first = query(
        collection(db, "Post"),
        where("fullTagArray", "array-contains", {
          state: true,
          title: `${params.spot}`,
        }),
        orderBy("created_time", "desc"),
        limit(3)
      );

      const documentSnapshots = await getDocs(first);
      let spotsArray = [];
      documentSnapshots.forEach((doc) => {
        spotsArray.push({ ...doc.data(), id: doc.id });
      });
      setSpots(spotsArray);
      previousDocumentSnapshots = documentSnapshots;
    } catch (e) {
      console.error("Error getting article documents: ", e);
    }
  };

  const loadMoreItems = async () => {
    try {
      const lastVisible =
        previousDocumentSnapshots.docs[
          previousDocumentSnapshots.docs.length - 1
        ];
      let next;
      next = query(
        collection(db, "Post"),
        where("fullTagArray", "array-contains", {
          state: true,
          title: `${params.spot}`,
        }),
        orderBy("created_time", "desc"),
        startAfter(lastVisible),
        limit(3)
      );

      const nextDocumentSnapshots = await getDocs(next);
      let newSpotsArray = [];
      nextDocumentSnapshots.forEach((doc) => {
        newSpotsArray.push({ ...doc.data(), id: doc.id });
      });
      setSpots((prevSpots) => {
        return [...prevSpots, ...newSpotsArray];
      });
      previousDocumentSnapshots = nextDocumentSnapshots;
    } catch (e) {
      console.error("Error getting more article documents: ", e);
    }
  };

  const getCoverPhoto = async () => {
    const docSnap = await getDoc(doc(db, "SpotsCoverPhoto", `${params.spot}`));
    setCoverPhoto(docSnap.data().image);
  };

  useEffect(() => {
    window.scroll({ top: 0, behavior: "smooth" });
    getSpotsWithPagination();
    getCoverPhoto();
  }, []);

  const sortFromOldToNew = () => {
    const oldToNewArray = [...spots].sort((a, b) => {
      return a.created_time.seconds - b.created_time.seconds;
    });
    setSpots(oldToNewArray);
    setOldToNewSelected(true);
    setNewToOldSelected(false);
  };

  const sortFromNewToOld = () => {
    const newToOldArray = [...spots].sort((a, b) => {
      return b.created_time.seconds - a.created_time.seconds;
    });
    setSpots(newToOldArray);
    setNewToOldSelected(true);
    setOldToNewSelected(false);
  };

  return (
    <>
      <FavoritesHeaderContainer>
        <Header />
      </FavoritesHeaderContainer>
      <BodyContainer>
        <SpotsCover image={coverPhoto}>
          <SpotsCoverTitle>
            <SpotsCoverTitleWords>{params.spot}</SpotsCoverTitleWords>
          </SpotsCoverTitle>
          <SortSection>
            <SortWords
              position={"left"}
              onClick={sortFromNewToOld}
              selected={newToOldSelected}
            >
              由新到舊
            </SortWords>
            <SortWords selected={oldToNewSelected} onClick={sortFromOldToNew}>
              由舊到新
            </SortWords>
          </SortSection>
        </SpotsCover>
        <ArticleContainer>
          {spots.length === 0 ? (
            <NoArticle>無文章</NoArticle>
          ) : (
            spots.map((item, index) => {
              if (spots.length === index + 1) {
                return (
                  <SpotItem
                    ref={lastSpotItem}
                    key={item.title}
                    title={item.title}
                    content={item.content}
                    displayName={item.displayName}
                    created_time={item.created_time.toDate()}
                    id={item.id}
                  />
                );
              } else {
                return (
                  <SpotItem
                    key={item.title}
                    title={item.title}
                    content={item.content}
                    displayName={item.displayName}
                    created_time={item.created_time.toDate()}
                    id={item.id}
                  />
                );
              }
            })
          )}
        </ArticleContainer>
      </BodyContainer>
      <TopButton
        onClick={() => {
          window.scroll({ top: 0, behavior: "smooth" });
        }}
      />
      <Footer />
    </>
  );
};

export default React.forwardRef(Spot);
