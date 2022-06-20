import React, { useState, useRef } from "react";

const Member = () => {
  const emailInputRef = useRef("");
  const passwordInputRef = useRef("");

  const [loggedIn, setIsLoggedIn] = useState(true);

  const changeLoginStateHandler = () => {
    setIsLoggedIn((prev) => !prev);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    let url;
    if (loggedIn) {
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
      if (parsedResult.idToken) {
        window.localStorage.setItem("token", parsedResult.idToken);
        console.log(parsedResult);
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
      <h1>{loggedIn ? "Sign Up" : "Sign In"}</h1>
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
        <button onClick={changeLoginStateHandler}>
          {loggedIn ? "Sign Up" : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Member;
