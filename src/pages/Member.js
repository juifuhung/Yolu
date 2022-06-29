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
    height: 80vh;
    background-image: url(${memberBackground});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  `;

  const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 550px;
    height: 600px;
    border-radius: 8%;
    background-color: #fffdfa;
    border: solid black 1.5px;
    box-shadow: 6px 6px 5px black;
  `;

  const Title = styled.h1`
    margin: 25px 0 15px;
    font-size: 2.5rem;
    color: black;
  `;

  const Form = styled.form`
    width: 70%;
    height: 65%;
  `;

  const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;

    justify-content: ${(props) =>
      props.isLogin ? "space-around" : "space-between"};
  `;

  const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

    height: ${(props) => (props.isLogin ? "100px" : "90px")};
  `;

  const Label = styled.label`
    margin: 5px 0;
    font-size: 1.5rem;
    color: #000000;
  `;

  const Input = styled.input`
    font-size: 1.2rem;
    width: 100%;
    height: 40px;
    margin: 5px 0;
    padding: 0;
  `;

  const Button = styled.button`
    margin: 10px 0;
    height: 60px;
    background-color: #006ee6;
    color: white;
    cursor: pointer;
    border: none;
    border-radius: 1rem;

    width: ${(props) => (props.changeIsLogin ? "250px" : "170px")};
    font-size: ${(props) => (props.changeIsLogin ? "1.2rem" : "1.5rem")};
    background-color: ${(props) =>
      props.changeIsLogin ? " #003777" : " #006ee6"};
  `;

  return (
    <>
      <Header />
      <MemberpageContainer>
        <LoginContainer>
          <Title>{isLogin ? "登入" : "註冊"}</Title>
          <Form onSubmit={submitHandler}>
            <FormContainer isLogin={isLogin ? true : false}>
              {!isLogin && (
                <InputContainer>
                  <Label>會員名稱</Label>
                  <Input type="string" id="name" required ref={nameInputRef} />
                </InputContainer>
              )}
              <InputContainer isLogin={isLogin ? true : false}>
                <Label>信箱</Label>
                <Input type="email" id="email" required ref={emailInputRef} />
              </InputContainer>
              <InputContainer isLogin={isLogin ? true : false}>
                <Label>密碼</Label>
                <Input
                  type="password"
                  id="password"
                  required
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
