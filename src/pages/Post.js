import React, { useRef, useState } from "react";
import styled from "styled-components";
import { getFirestore, collection, addDoc } from "firebase/firestore";
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

const Post = () => {
  const [tagArray, setTagArray] = useState(spots);

  const titleRef = useRef("");
  const contentRef = useRef("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const tagsChosen = tagArray.filter((item) => {
      return item.state === true;
    });

    try {
      await addDoc(collection(db, "Post"), {
        title: titleRef.current.value,
        content: contentRef.current.value,
        tags: tagsChosen,
        created_time: new Date(),
      });

      titleRef.current.value = "";
      contentRef.current.value = "";
      setTagArray(spots);
    } catch (e) {
      console.log("error", e);
    }
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
      Post
      <form action="" onSubmit={handleFormSubmit}>
        <h1>Title</h1>
        <input type="text" ref={titleRef} />
        <h2>Content</h2>
        <textarea name="" id="" cols="30" rows="10" ref={contentRef}></textarea>
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
    </>
  );
};

export default Post;
