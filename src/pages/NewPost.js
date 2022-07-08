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

const BodyContainer = styled.div`
  width: 100%;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainForm = styled.form`
  width: 65%;
  display: flex;
  flex-direction: column;

  @media (max-width: 970px) {
    width: 75%;
  }

  @media (max-width: 750px) {
    width: 80%;
  }
`;

const TitleInput = styled.input`
  width: 100%;
  font-size: 2.5rem;
  font-weight: 600;
  border: none;
  outline: none;

  ::placeholder {
    color: #e0e0e0;
  }

  @media (max-width: 570px) {
    font-size: 2.2rem;
  }

  @media (max-width: 400px) {
    font-size: 2rem;
  }
`;

const DisplayName = styled.p`
  margin: 2rem 0 1rem 0.5rem;
  font-size: 1rem;

  @media (max-width: 1300px) {
    font-size: 1rem;
  }

  @media (max-width: 570px) {
    font-size: 0.9rem;
  }

  @media (max-width: 360px) {
    font-size: 0.7rem;
  }
`;

const Content = styled.textarea`
  margin: 2rem 0;
  width: 100%;
  min-height: 40vh;
  font-size: 1.5rem;
  border: none;
  outline: none;
  resize: none;
  ::placeholder {
    color: #e0e0e0;
  }
  ::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 900px) {
    font-size: 1.2rem;
  }

  @media (max-width: 570px) {
    font-size: 1rem;
  }
`;

const TagTitle = styled.p`
  width: 100%;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1rem 0;
  color: #464646;
`;

const TagContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  height: auto;
`;

const Tag = styled.div`
  margin: 0.5rem 0;
  padding: 0 15px;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 40px;
  margin-right: 15px;

  cursor: pointer;

  &:hover {
    background-color: #949494;
    color: white;
  }

  @media (max-width: 355px) {
    height: 35px;
    font-size: 0.8rem;
  }

  background-color: ${(props) => (props.state ? "#949494" : "#ececec")};
  color: ${(props) => (props.state ? "white" : "black")};
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
`;

const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: 2rem;
  background-color: #ff0000;
  color: white;
  border-radius: 2rem;
  width: 300px;
  height: 80px;
  border: none;
  cursor: pointer;

  @media (max-width: 570px) {
    border-radius: 1.2rem;
    width: 220px;
    height: 60px;
    font-size: 1.5rem;
  }
`;

let localId;
let articleId;

const Post = () => {
  const [tagArray, setTagArray] = useState(spots);
  const [displayName, setDisplayName] = useState("");
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredContent, setEnteredContent] = useState("");

  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  console.log(localId);

  const navigate = useNavigate();

  useEffect(() => {
    getDisplayName(localId);
  }, [localId]);

  const getDisplayName = async (localId) => {
    const docSnap = await getDoc(doc(db, "User", `${localId}`));
    setDisplayName(docSnap.data().name);
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
        where("localId", "==", localId)
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
      <BodyContainer>
        <MainForm action="" onSubmit={handleFormSubmit}>
          {displayName ? (
            <DisplayName>{displayName}</DisplayName>
          ) : (
            <DisplayName>Loading...</DisplayName>
          )}
          <TitleInput
            type="text"
            onChange={titleInputChangeHandler}
            value={enteredTitle}
            maxlength="20"
            required
            placeholder="標題"
          />

          <Content
            onChange={contentInputChangeHandler}
            value={enteredContent}
            placeholder="內容"
            required
            maxlength="5000"
          />
          <TagTitle>選擇標籤</TagTitle>
          <TagContainer>
            {tagArray.map((item, index) => {
              return (
                <Tag
                  key={item.title}
                  state={item.state}
                  onClick={() => {
                    chooseTagHandler(index);
                  }}
                >
                  {item.title}
                </Tag>
              );
            })}
          </TagContainer>
          <ButtonContainer>
            <SubmitButton>發表</SubmitButton>
          </ButtonContainer>
        </MainForm>
      </BodyContainer>
      <Footer />
    </>
  );
};

export default Post;
