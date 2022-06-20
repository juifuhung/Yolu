import React, { useState, useRef } from "react";

const Member = () => {
  const emailInputRef = useRef("");
  const passwordInputRef = useRef("");

  const [isLogin, setIsLogin] = useState(true);

  const isLoginHandler = () => {
    setIsLogin((prev) => !prev);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

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
        console.log(parsedResult);
        location.replace("./");
      } else {
        alert(parsedResult.error.message);
      }
    } catch (error) {
      return error;
    }

    emailInputRef.current.value = "";
    passwordInputRef.current.value = "";
  };

  return (
    <div>
      <h1>{isLogin ? "Sign In" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
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
    </div>
  );
};

export default Member;
