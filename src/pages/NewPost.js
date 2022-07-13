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
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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
  min-height: 75vh;
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
  margin-bottom: 1rem;

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

const TagTitle = styled.p`
  width: 100%;
  font-size: 1.1em;
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
  font-size: 0.8rem;
  margin: 0.3rem 0;
  padding: 0 10px;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 35px;
  margin-right: 15px;
  cursor: pointer;

  &:hover {
    background-color: #949494;
    color: white;
  }

  @media (max-width: 355px) {
    height: 32px;
    font-size: 0.7rem;
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
  font-size: 1.3rem;
  background-color: #ff0000;
  color: white;
  border-radius: 1rem;
  width: 150px;
  height: 50px;
  border: none;
  cursor: pointer;

  @media (max-width: 570px) {
    border-radius: 0.8rem;
    width: 120px;
    height: 45px;
    font-size: 1rem;
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

  const navigate = useNavigate();

  useEffect(() => {
    getDisplayName(localId);
  }, [localId]);

  const API_URl = "https://noteyard-backend.herokuapp.com";
  const UPLOAD_ENDPOINT = "api/blogs/uploadImg";

  const uploadAdapter = (loader) => {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append("uploadImg", file);
            fetch(`${API_URl}/${UPLOAD_ENDPOINT}`, {
              method: "post",
              body: body,
            })
              .then((res) => res.json())
              .then((res) => {
                resolve({ default: `${API_URl}/${res.url}` });
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      },
    };
  };

  const uploadPlugin = (editor) => {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  };

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
          <CKEditor
            config={{
              extraPlugins: [uploadPlugin],
            }}
            editor={ClassicEditor}
            data=""
            onChange={(event, editor) => {
              const data = editor.getData();
              setEnteredContent(data);
            }}
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
