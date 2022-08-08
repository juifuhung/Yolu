import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { signUp, signIn, setDocumentToFirestore } from "../utils/Firebase";
import memberBackground from "../images/aurora_gif.gif";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MemberHeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
`;

const MemberpageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 87vh;
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
  width: 220px;
  font-size: ${(props) => (props.changeIsLogin ? "0.8rem" : "1rem")};
  background-color: ${(props) =>
    props.changeIsLogin ? " #003777" : " #006ee6"};

  @media (max-width: 450px) {
    border-radius: 0.6rem;
    height: 35px;
    width: 160px;
  }
`;

const scrollToTop = () => {
  window.scroll({ top: 0, behavior: "smooth" });
};

const Member = () => {
  const [enteredName, setEnteredName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    scrollToTop();
  }, []);

  const isLoginHandler = () => {
    setIsLogin((prev) => !prev);
  };

  const signUpHandler = async () => {
    try {
      const result = await signUp(enteredEmail, enteredPassword);
      await setDocumentToFirestore("User", `${result.user.uid}`, {
        name: enteredName,
        uid: result.user.uid,
        email: result.user.email,
      });
      setEnteredName("");
      setEnteredEmail("");
      setEnteredPassword("");
    } catch (e) {
      Swal.fire({
        icon: "error",
        confirmButtonColor: "#3085d6",
        title: e.message,
      });
    }
  };

  const signInHandler = async () => {
    try {
      await signIn(enteredEmail, enteredPassword);
      setEnteredEmail("");
      setEnteredPassword("");
    } catch (e) {
      Swal.fire({
        icon: "error",
        confirmButtonColor: "#3085d6",
        title: e.message,
      });
    }
  };

  const nameInputChangeHandler = (e) => {
    setEnteredName(e.target.value);
  };

  const emailInputChangeHandler = (e) => {
    setEnteredEmail(e.target.value);
  };

  const passwordInputChangeHandler = (e) => {
    setEnteredPassword(e.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      if (isLogin) {
        await signInHandler();
      } else {
        await signUpHandler();
      }
    } catch {
      if (isLogin) {
        Swal.fire({
          icon: "error",
          title: "登入時發生問題",
          // footer: '<a href="">回報問題</a>',
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "註冊時發生問題",
          // footer: '<a href="">回報問題</a>',
        });
      }
    }
  };

  return (
    <>
      <MemberHeaderContainer>
        <Header />
      </MemberHeaderContainer>
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
                    isLogin={isLogin ? true : false}
                    onChange={nameInputChangeHandler}
                  />
                </InputContainer>
              )}
              <InputContainer isLogin={isLogin ? true : false}>
                <Label isLogin={isLogin ? true : false}>信箱</Label>
                <Input
                  type="email"
                  id="email"
                  required
                  isLogin={isLogin ? true : false}
                  onChange={emailInputChangeHandler}
                />
              </InputContainer>
              <InputContainer isLogin={isLogin ? true : false}>
                <Label isLogin={isLogin ? true : false}>密碼</Label>
                <Input
                  type="password"
                  id="password"
                  required
                  isLogin={isLogin ? true : false}
                  onChange={passwordInputChangeHandler}
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
