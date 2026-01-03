
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlVDtOTDvt6-hzAO-esVr7xsn4eR0HiiM",
  authDomain: "prepinterview-21b85.firebaseapp.com",
  projectId: "prepinterview-21b85",
  storageBucket: "prepinterview-21b85.firebasestorage.app",
  messagingSenderId: "793248509842",
  appId: "1:793248509842:web:8266d49d99e6243a9f1b4b",
  measurementId: "G-J39EMLVYHV"
};

const app = !getApps.length ?  initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);