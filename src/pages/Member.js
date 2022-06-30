import React, { useState, useRef } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import memberBackground from "../images/aurora_gif.gif";

const Member = () => {
  const emailInputRef = useRef("");
  const passwordInputRef = useRef("");
  const nameInputRef = useRef("");

  const [isLogin, setIsLogin] = useState(true);

  const isLoginHandler = () => {
    setIsLogin((prev) => !prev);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    let url;
    if (isLogin) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_API_KEY}`;
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_API_KEY}`;
    }
    try {
      const result = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          displayName: enteredName,
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const parsedResult = await result.json();
      if (parsedResult.localId) {
        window.localStorage.setItem("localId", parsedResult.localId);
        window.localStorage.setItem("displayName", parsedResult.displayName);
        location.replace("./");
      } else {
        alert(parsedResult.error.message);
      }
    } catch (error) {
      return error;
    }

    nameInputRef.current.value = "";
    emailInputRef.current.value = "";
    passwordInputRef.current.value = "";
  };

  const MemberpageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70vh;
    background-image: url(${memberBackground});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  `;

  const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 360px;
    height: 380px;
    border-radius: 8%;
    background-color: #fffdfa;
    border: solid black 1.5px;
    box-shadow: 6px 6px 5px black;

    @media (max-width: 450px) {
      height: 266px;
      width: 252px;
    }
  `;

  const Title = styled.h1`
    margin: 10px 0;
    font-size: 2rem;
    color: black;

    @media (max-width: 450px) {
      font-size: 1.5rem;
      margin: 5px 0 0 0;
    }
  `;

  const Form = styled.form`
    width: 60%;
    height: 65%;
  `;

  const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    justify-content: space-between;
  `;

  const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 100%;

    height: ${(props) => (props.isLogin ? "50px" : "42px")};
  `;

  const Label = styled.label`
    margin: 2px 0;
    color: #000000;
    font-size: ${(props) => (props.isLogin ? "1.4rem" : "1rem")};

    @media (max-width: 450px) {
      font-size: ${(props) => (props.isLogin ? "1rem" : "0.7rem")};
    }
  `;

  const Input = styled.input`
    font-size: 1.2rem;
    width: 100%;
    margin: 2px 0;
    padding: 0;

    height: ${(props) => (props.isLogin ? "25px" : "20px")};

    @media (max-width: 450px) {
      height: ${(props) => (props.isLogin ? "20px" : "12px")};
      font-size: 0.6rem;
    }
  `;

  const Button = styled.button`
    margin: 5px 0;
    height: 40px;
    background-color: #006ee6;
    color: white;
    cursor: pointer;
    border: none;
    border-radius: 1rem;

    width: ${(props) => (props.changeIsLogin ? "220px" : "160px")};
    font-size: ${(props) => (props.changeIsLogin ? "0.8rem" : "1rem")};
    background-color: ${(props) =>
      props.changeIsLogin ? " #003777" : " #006ee6"};
  `;

  return (
    <>
      <Header />
      <MemberpageContainer>
        <LoginContainer>
          <Title isLogin={isLogin ? true : false}>
            {isLogin ? "登入" : "註冊"}
          </Title>
          <Form onSubmit={submitHandler}>
            <FormContainer isLogin={isLogin ? true : false}>
              {!isLogin && (
                <InputContainer isLogin={isLogin ? true : false}>
                  <Label isLogin={isLogin ? true : false}>會員名稱</Label>
                  <Input
                    type="string"
                    id="name"
                    required
                    ref={nameInputRef}
                    isLogin={isLogin ? true : false}
                  />
                </InputContainer>
              )}
              <InputContainer isLogin={isLogin ? true : false}>
                <Label isLogin={isLogin ? true : false}>信箱</Label>
                <Input
                  type="email"
                  id="email"
                  required
                  ref={emailInputRef}
                  isLogin={isLogin ? true : false}
                />
              </InputContainer>
              <InputContainer isLogin={isLogin ? true : false}>
                <Label isLogin={isLogin ? true : false}>密碼</Label>
                <Input
                  type="password"
                  id="password"
                  required
                  isLogin={isLogin ? true : false}
                  ref={passwordInputRef}
                />
              </InputContainer>
              <Button>{isLogin ? "登入" : "註冊"}</Button>
            </FormContainer>
          </Form>
          <Button onClick={isLoginHandler} changeIsLogin={true}>
            {isLogin ? "註冊新帳號" : "我已註冊，讓我登入"}
          </Button>
        </LoginContainer>
      </MemberpageContainer>
      <Footer />
    </>
  );
};

export default Member;
