// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// IMPORTANT: This is a temporary configuration for development purposes only
// In a production environment, these values should be stored in environment variables
const firebaseConfig = {
  // Replace these with your actual Firebase project values
  apiKey: "AIzaSyDVMh6O5UYvVo-U9P4Gm9mPdmYoQTu-ULo",
  authDomain: "chatrtc-9db81.firebaseapp.com",
  projectId: "chatrtc-9db81",
  storageBucket: "chatrtc-9db81.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890",
  measurementId: "G-ABCDEFGHIJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };
