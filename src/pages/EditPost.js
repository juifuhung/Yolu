import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import styled from "styled-components";
import { useAuth } from "../utils/Firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";

const db = getFirestore();

// const spots = [
//   { title: "奧納斯山", category: "自然景觀", state: false },
//   { title: "聖誕老人的鮭魚餐廳", category: "餐廳", state: false },
//   { title: "聖誕老人辦公室", category: "聖誕主題", state: false },
//   { title: "北極圈", category: "聖誕主題", state: false },
//   { title: "聖誕屋", category: "聖誕主題", state: false },
//   { title: "哈士奇公園", category: "聖誕主題", state: false },
//   { title: "聖誕老人馴鹿", category: "聖誕主題", state: false },
//   { title: "馬勒蒂尼北極圈工廠店", category: "購物", state: false },
//   { title: "Curry Masala", category: "餐廳", state: false },
//   { title: "極光購物中心", category: "購物", state: false },
//   { title: "北極科學博物館", category: "博物館", state: false },
//   { title: "皮爾凱科學中心", category: "博物館", state: false },
//   { title: "羅瓦涅米機場", category: "交通", state: false },
//   { title: "羅瓦涅米中央巴士站", category: "交通", state: false },
//   { title: "羅瓦涅米火車站", category: "交通", state: false },
// ];

let localId;
let displayName;

const EditPost = () => {
  const [articleData, setArticleData] = useState({});

  const params = useParams();
  console.log(params.articleId);

  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  const getDisplayName = async (localId) => {
    console.log("getDisplayName");
    const docSnap = await getDoc(doc(db, "User", `${localId}`));
    displayName = docSnap.data().name;
  };

  const getArticle = async () => {
    console.log("getArticle");
    const docSnap = await getDoc(doc(db, "Post", params.articleId));
    console.log("Document data:", docSnap.data());
    setArticleData(docSnap.data());
  };

  //   const getCategoryArrayState = () => {
  //     spots.map((item) => {
  //         if(item)
  //     })
  //   }

  useEffect(() => {
    getDisplayName(localId);
    getArticle();
  }, [localId]);

  return (
    <>
      {console.log(articleData)}
      <Header />
      <h1>Edit</h1>
      <p>{displayName}</p>
      <form>
        <input type="text" value={articleData.title} />
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          value={articleData.content}
        ></textarea>
        {articleData.tags}
        <button>更改</button>
      </form>
      <Footer />
    </>
  );
};

export default EditPost;
