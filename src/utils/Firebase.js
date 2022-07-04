import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

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
const auth = getAuth();
const user = auth.currentUser;

if (user) {
  console.log("yes logged in");
  console.log(user);
  console.log(user.uid);
} else {
  console.log("logged out");
}

export const signUp = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (email, password) => {
  console.log("signin outside");
  await setPersistence(auth, browserSessionPersistence);
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = async () => {
  return signOut(auth);
};

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("yes");
        setCurrentUser(user);
      } else {
        console.log("no");
      }
    });
  }, []);

  return currentUser;
};
