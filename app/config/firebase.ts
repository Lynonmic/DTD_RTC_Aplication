// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyB7ier68WVjdhPdTBYp5lLbq66oJ5EtPlE",
  authDomain: "chatrtc-9db81.firebaseapp.com",
  projectId: "chatrtc-9db81",
  storageBucket: "chatrtc-9db81.firebasestorage.app",
  messagingSenderId: "1033850947026",
  appId: "1:1033850947026:web:950337383082ca8700740b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, db, googleProvider, facebookProvider };
