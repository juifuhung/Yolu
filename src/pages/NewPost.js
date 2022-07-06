import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../utils/Firebase";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";

const db = getFirestore();

const spots = [
  { title: "奧納斯山", state: false },
  { title: "聖誕老人的鮭魚餐廳", state: false },
  { title: "聖誕老人辦公室", state: false },
  { title: "北極圈", state: false },
  { title: "聖誕屋", state: false },
  { title: "哈士奇公園", state: false },
  { title: "聖誕老人馴鹿", state: false },
  { title: "馬勒蒂尼北極圈工廠店", state: false },
  { title: "Curry Masala", state: false },
  { title: "極光購物中心", state: false },
  { title: "北極科學博物館", state: false },
  { title: "皮爾凱科學中心", state: false },
  { title: "羅瓦涅米機場", state: false },
  { title: "羅瓦涅米中央巴士站", state: false },
  { title: "羅瓦涅米火車站", state: false },
];

const Tag = styled.div`
  width: 200px;
  height: 40px;
  font-size: 1rem;
  border: solid black 1px;

  background-color: ${(props) => (props.selected ? "aqua" : "pink")};
`;

let localId;
let displayName;
let articleId;

const Post = () => {
  const [tagArray, setTagArray] = useState(spots);
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredContent, setEnteredContent] = useState("");

  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  const navigate = useNavigate();

  useEffect(() => {
    getDisplayName(localId);
  }, [localId]);

  const getDisplayName = async (localId) => {
    const docSnap = await getDoc(doc(db, "User", `${localId}`));
    displayName = docSnap.data().name;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await addDoc(collection(db, "Post"), {
        title: enteredTitle,
        content: enteredContent,
        fullTagArray: tagArray,
        created_time: new Date(),
        localId: localId,
        displayName: displayName,
      });
      setEnteredTitle("");
      setEnteredContent("");
      setTagArray(spots);

      const q = query(
        collection(db, "Post"),
        where("title", "==", enteredTitle),
        where("content", "==", enteredContent)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        articleId = doc.id;
      });

      if (articleId) {
        navigate(`/article/${articleId}`);
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const titleInputChangeHandler = (e) => {
    setEnteredTitle(e.target.value);
  };

  const contentInputChangeHandler = (e) => {
    setEnteredContent(e.target.value);
  };

  const chooseTagHandler = (index) => {
    const newTagArray = [...tagArray].map((item, i) => {
      if (i === index) {
        return { ...item, state: !item.state };
      } else {
        return item;
      }
    });
    setTagArray(newTagArray);
  };

  return (
    <>
      <Header />
      Post
      <form action="" onSubmit={handleFormSubmit}>
        <h1>Title</h1>
        <input
          type="text"
          onChange={titleInputChangeHandler}
          value={enteredTitle}
        />
        <h2>Content</h2>
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          onChange={contentInputChangeHandler}
          value={enteredContent}
        ></textarea>
        {tagArray.map((item, index) => {
          return (
            <Tag
              key={item.title}
              selected={item.state}
              onClick={() => {
                chooseTagHandler(index);
              }}
            >
              {item.title}
            </Tag>
          );
        })}
        <button>submit</button>
      </form>
      <Footer />
    </>
  );
};

export default Post;
