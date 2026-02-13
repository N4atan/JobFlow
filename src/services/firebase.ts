// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB-KSOVEXfg0-tt9TjWMAruKDC-SxwlXPA",
    authDomain: "job-flow-06.firebaseapp.com",
    projectId: "job-flow-06",
    storageBucket: "job-flow-06.firebasestorage.app",
    messagingSenderId: "1089265246007",
    appId: "1:1089265246007:web:2ee6860b7ebbdad98104b2",
    measurementId: "G-SXHZQK1XWW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();