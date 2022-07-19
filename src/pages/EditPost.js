import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { useAuth } from "../utils/Firebase";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

const falseState = (item) => item.state === false;

const BodyContainer = styled.div`
  width: 100%;
  min-height: 88vh;
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
  margin-top: 2rem;

  @media (max-width: 570px) {
    font-size: 2.2rem;
  }

  @media (max-width: 400px) {
    font-size: 2rem;
  }
`;

const NameAndTime = styled.div`
  width: 100%;
  display: flex;
  color: #aaaaaa;
  margin: 1.5rem 0;

  @media (max-width: 570px) {
    flex-direction: column;
  }
`;

const DisplayNameAndDate = styled.p`
  margin: 0 1rem 0 0;
  font-size: 0.9rem;

  @media (max-width: 1300px) {
    font-size: 1rem;
  }

  @media (max-width: 570px) {
    font-size: 0.9rem;
    margin: 0.1rem 0;
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

const EditPost = () => {
  const [tagArray, setTagArray] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredContent, setEnteredContent] = useState("");

  const navigate = useNavigate();

  const currentUser = useAuth();
  if (currentUser) {
    localId = currentUser.uid;
  }

  const API_URl = "https://noteyard-backend.herokuapp.com";
  const UPLOAD_ENDPOINT = "api/blogs/uploadImg";

  function uploadAdapter(loader) {
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
  }

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  const getDisplayName = async (localId) => {
    const docSnap = await getDoc(doc(db, "User", `${localId}`));
    setDisplayName(docSnap.data().name);
  };

  const params = useParams();

  const getArticle = async () => {
    const docSnap = await getDoc(doc(db, "Post", params.articleId));
    setTagArray(docSnap.data().fullTagArray);
    setEnteredTitle(docSnap.data().title);
    setEnteredContent(docSnap.data().content);
    setTimestamp(docSnap.data().created_time.toDate());
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (enteredTitle === "") {
      Swal.fire({
        icon: "warning",
        confirmButtonColor: "#3085d6",
        title: `請填寫標題`,
      });
    } else if (enteredContent === "") {
      Swal.fire({
        icon: "warning",
        confirmButtonColor: "#3085d6",
        title: `請填寫內容`,
      });
    } else if (tagArray.every(falseState)) {
      Swal.fire({
        icon: "warning",
        confirmButtonColor: "#3085d6",
        title: `請選擇標籤`,
      });
    } else {
      try {
        await updateDoc(doc(db, "Post", params.articleId), {
          title: enteredTitle,
          content: enteredContent,
          fullTagArray: tagArray,
          created_time: new Date(),
          localId: localId,
          displayName: displayName,
        });
        navigate(`/article/${params.articleId}`);
      } catch (e) {
        console.log("error", e);
      }
    }
  };

  const titleInputChangeHandler = (e) => {
    setEnteredTitle(e.target.value);
  };

  useEffect(() => {
    getArticle();
  }, []);

  useEffect(() => {
    getDisplayName(localId);
  }, [localId]);

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
        <MainForm onSubmit={handleFormSubmit}>
          <TitleInput
            type="text"
            value={enteredTitle}
            onChange={titleInputChangeHandler}
            maxlength="20"
          />
          <NameAndTime>
            {!displayName && (
              <DisplayNameAndDate>Loading...</DisplayNameAndDate>
            )}
            <DisplayNameAndDate>{displayName}</DisplayNameAndDate>
            {timestamp && (
              <DisplayNameAndDate
                time={true}
              >{`最近更新：${timestamp.getFullYear()}年${
                timestamp.getMonth() + 1 < 10
                  ? "0" + (timestamp.getMonth() + 1).toString()
                  : (timestamp.getMonth() + 1).toString()
              }月${
                timestamp.getDate() < 10
                  ? "0" + timestamp.getDate().toString()
                  : timestamp.getDate().toString()
              }日 ${
                timestamp.getHours() === 0
                  ? "00"
                  : timestamp.getHours() < 10
                  ? "0" + timestamp.getHours().toString()
                  : timestamp.getHours().toString()
              }:${
                timestamp.getMinutes() === 0
                  ? "00"
                  : timestamp.getMinutes() < 10
                  ? "0" + timestamp.getMinutes().toString()
                  : timestamp.getMinutes().toString()
              }`}</DisplayNameAndDate>
            )}
          </NameAndTime>
          <CKEditor
            config={{
              extraPlugins: [uploadPlugin],
            }}
            editor={ClassicEditor}
            data={enteredContent}
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
            <SubmitButton>提交更改</SubmitButton>
          </ButtonContainer>
        </MainForm>
      </BodyContainer>
      <Footer />
    </>
  );
};

export default EditPost;
