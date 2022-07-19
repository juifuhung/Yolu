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
import {
  getFirestore,
  getDocs,
  collection,
  // getDoc,
  doc,
  addDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

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
const db = getFirestore();

export const signUp = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (email, password) => {
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
        setCurrentUser(user);
      }
    });
  }, []);

  return currentUser;
};

export const getFirestoreDocuments = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, `${collectionName}`));
  return querySnapshot;
};

export const addDocumentToFirestore = async (collectionName, obj) => {
  await addDoc(collection(db, `${collectionName}`), obj);
};

export const getFirestoreDocumentsWithQuery = async (
  collectionName,
  queryKey,
  queryValue
) => {
  const querySnapshot = await getDocs(
    query(
      collection(db, `${collectionName}`),
      where(`${queryKey}`, "==", queryValue)
    )
  );
  return querySnapshot;
};

export const deleteFireStoreDocument = async (collectionName, id) => {
  await deleteDoc(doc(db, `${collectionName}`, id));
};
