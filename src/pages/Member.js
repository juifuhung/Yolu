import React, { useState, useRef } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

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

  return (
    <div>
      <Header />
      <h1>{isLogin ? "Sign In" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        {!isLogin && (
          <div>
            <label>Name</label>
            <input type="string" id="name" required ref={nameInputRef} />
          </div>
        )}
        <div>
          <label>Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <button>{isLogin ? "Sign In" : "Sign Up"}</button>
      </form>
      <button onClick={isLoginHandler}>
        {isLogin ? "change to Sign Up" : "change to Sign In"}
      </button>
      <Footer />
    </div>
  );
};

export default Member;
