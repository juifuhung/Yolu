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
  getDoc,
  doc,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  updateDoc,
  setDoc,
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

export const getDisplayName = async (collectionName, localId) => {
  const docSnap = await getDoc(doc(db, `${collectionName}`, `${localId}`));
  return docSnap.data().name;
};

export const getFirestoreDocument = async (document, id) => {
  return await getDoc(doc(db, `${document}`, id));
};

export const getFirestoreDocuments = async (collectionName) => {
  return await getDocs(collection(db, `${collectionName}`));
};

export const addDocumentToFirestore = async (collectionName, obj) => {
  await addDoc(collection(db, `${collectionName}`), obj);
};

export const setDocumentToFirestore = async (collectionName, id, obj) => {
  await setDoc(doc(db, `${collectionName}`, id), obj);
};

export const updateFirestoreDocument = async (collectionName, id, obj) => {
  await updateDoc(doc(db, `${collectionName}`, id), obj);
};

export const getFirestoreDocumentsWithQuery = async (
  collectionName,
  queryKey,
  operator,
  queryValue,
  secondQueryKey,
  secondOperator,
  secondQueryValue
) => {
  if (!secondQueryKey && !secondOperator && !secondQueryValue) {
    return await getDocs(
      query(
        collection(db, `${collectionName}`),
        where(`${queryKey}`, `${operator}`, queryValue)
      )
    );
  } else {
    return await getDocs(
      query(
        collection(db, `${collectionName}`),
        where(`${queryKey}`, `${operator}`, queryValue),
        where(`${secondQueryKey}`, `${secondOperator}`, secondQueryValue)
      )
    );
  }
};

export const getFirestoreDocumentsWithPagination = async (
  collectionName,
  queryKey,
  operator,
  queryValue,
  secondQueryKey,
  secondOperator,
  secondQueryValue,
  orderByItem,
  order,
  limitNumber
) => {
  if (!secondQueryKey && !secondQueryValue) {
    return await getDocs(
      query(
        collection(db, `${collectionName}`),
        where(`${queryKey}`, `${operator}`, queryValue),
        orderBy(`${orderByItem}`, `${order}`),
        limit(limitNumber)
      )
    );
  } else {
    return await getDocs(
      query(
        collection(db, `${collectionName}`),
        where(`${queryKey}`, `${operator}`, queryValue),
        where(`${secondQueryKey}`, `${secondOperator}`, secondQueryValue),
        orderBy(`${orderByItem}`, `${order}`),
        limit(limitNumber)
      )
    );
  }
};

export const getFirestoreDocumentsForLoadMoreItems = async (
  collectionName,
  queryKey,
  operator,
  queryValue,
  secondQueryKey,
  secondOperator,
  secondQueryValue,
  orderByItem,
  order,
  startAfterItem,
  limitNumber
) => {
  if (!secondQueryKey && !secondOperator && !secondQueryValue) {
    return await getDocs(
      query(
        collection(db, `${collectionName}`),
        where(`${queryKey}`, `${operator}`, queryValue),
        orderBy(`${orderByItem}`, `${order}`),
        startAfter(startAfterItem),
        limit(limitNumber)
      )
    );
  } else {
    return await getDocs(
      query(
        collection(db, `${collectionName}`),
        where(`${queryKey}`, `${operator}`, queryValue),
        where(`${secondQueryKey}`, `${secondOperator}`, secondQueryValue),
        orderBy(`${orderByItem}`, `${order}`),
        startAfter(startAfterItem),
        limit(limitNumber)
      )
    );
  }
};

export const favoritesGetFirestoreDocumentsWithPagination = async (
  collectionName,
  queryKey,
  operator,
  queryValue,
  secondQueryKey,
  secondOperator,
  secondQueryValue,
  orderByItem,
  limitNumber
) => {
  if (!secondQueryKey && !secondOperator && !secondQueryValue) {
    return await getDocs(
      query(
        collection(db, `${collectionName}`),
        where(`${queryKey}`, `${operator}`, queryValue),
        orderBy(`${orderByItem}`),
        limit(limitNumber)
      )
    );
  } else {
    return await getDocs(
      query(
        collection(db, `${collectionName}`),
        where(`${queryKey}`, `${operator}`, queryValue),
        where(`${secondQueryKey}`, `${secondOperator}`, secondQueryValue),
        orderBy(`${orderByItem}`),
        limit(limitNumber)
      )
    );
  }
};

export const favoritesLoadMoreItems = async (
  collectionName,
  queryKey,
  operator,
  queryValue,
  secondQueryKey,
  secondOperator,
  secondQueryValue,
  orderByItem,
  startAfterItem,
  limitNumber
) => {
  if (!secondQueryKey && !secondOperator && !secondQueryValue) {
    return await getDocs(
      query(
        collection(db, `${collectionName}`),
        where(`${queryKey}`, `${operator}`, queryValue),
        orderBy(`${orderByItem}`),
        startAfter(startAfterItem),
        limit(limitNumber)
      )
    );
  } else {
    return await getDocs(
      query(
        collection(db, `${collectionName}`),
        where(`${queryKey}`, `${operator}`, queryValue),
        where(`${secondQueryKey}`, `${secondOperator}`, secondQueryValue),
        orderBy(`${orderByItem}`),
        startAfter(startAfterItem),
        limit(limitNumber)
      )
    );
  }
};

export const deleteFireStoreDocument = async (collectionName, id) => {
  await deleteDoc(doc(db, `${collectionName}`, id));
};
