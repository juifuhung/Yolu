import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../utils/Firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";

const db = getFirestore();

const Tag = styled.div`
  width: 200px;
  height: 40px;
  font-size: 1rem;
  border: solid black 1px;

  background-color: ${(props) => (props.selected ? "aqua" : "pink")};
`;

// let localId;
// let displayName;

const EditPost = () => {
  // const [tagArray, setTagArray] = useState(articleData.tags);
  const [articleData, setArticleData] = useState([]);

  // const currentUser = useAuth();
  // if (currentUser) {
  //   localId = currentUser.uid;
  // }
  // console.log(currentUser);
  // console.log(localId);

  // console.log(params.articleId);

  // const getDisplayName = async (localId) => {
  //   console.log("getDisplayName");
  //   const docSnap = await getDoc(doc(db, "User", `${localId}`));
  //   displayName = docSnap.data().name;
  // };

  const params = useParams();

  const getArticle = async () => {
    console.log("getArticle");
    const docSnap = await getDoc(doc(db, "Post", params.articleId));
    console.log("Document data:", docSnap.data());
    setArticleData(docSnap.data());
  };

  //寫法一
  // useEffect(() => {
  //   getArticle();
  // }, []);

  // 寫法二
  getArticle();

  // const chooseTagHandler = (index) => {
  //   const newTagArray = [...articleData.tags].map((item, i) => {
  //     if (i === index) {
  //       return { ...item, state: !item.state };
  //     } else {
  //       return item;
  //     }
  //   });
  //   console.log(newTagArray);
  //   // setTagArray(newTagArray);
  // };

  return (
    <>
      {console.log(articleData)}
      {console.log(articleData.tags)}
      <Header />
      <h1>Edit</h1>
      {/* <p>{displayName}</p> */}
      <form>
        <input type="text" value={articleData.title} />
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          value={articleData.content}
        ></textarea>
        {articleData.tags.map((item) => {
          return (
            <Tag key={item.title} state={item.state}>
              {item.title}
            </Tag>
          );
        })}
        {/* {articleData.tags.map((item, index) => {
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
        })} */}
        <button>更改</button>
      </form>
      <Footer />
    </>
  );
};

export default EditPost;
