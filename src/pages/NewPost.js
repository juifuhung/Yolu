import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../utils/Firebase";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";

const db = getFirestore();

const spots = [
  { title: "奧納斯山", category: "自然景觀", state: false },
  { title: "聖誕老人的鮭魚餐廳", category: "餐廳", state: false },
  { title: "聖誕老人辦公室", category: "聖誕主題", state: false },
  { title: "北極圈", category: "聖誕主題", state: false },
  { title: "聖誕屋", category: "聖誕主題", state: false },
  { title: "哈士奇公園", category: "聖誕主題", state: false },
  { title: "聖誕老人馴鹿", category: "聖誕主題", state: false },
  { title: "馬勒蒂尼北極圈工廠店", category: "購物", state: false },
  { title: "Curry Masala", category: "餐廳", state: false },
  { title: "極光購物中心", category: "購物", state: false },
  { title: "北極科學博物館", category: "博物館", state: false },
  { title: "皮爾凱科學中心", category: "博物館", state: false },
  { title: "羅瓦涅米機場", category: "交通", state: false },
  { title: "羅瓦涅米中央巴士站", category: "交通", state: false },
  { title: "羅瓦涅米火車站", category: "交通", state: false },
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

const Post = () => {
  const [tagArray, setTagArray] = useState(spots);
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredContent, setEnteredContent] = useState("");

  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

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
