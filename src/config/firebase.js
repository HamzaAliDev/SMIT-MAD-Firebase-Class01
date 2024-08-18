// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyANhcOo0FtevujaJXfi8BeTYxeEog4GwRE",
    authDomain: "smit-learning-firebase.firebaseapp.com",
    projectId: "smit-learning-firebase",
    storageBucket: "smit-learning-firebase.appspot.com",
    messagingSenderId: "971387644605",
    appId: "1:971387644605:web:22afbe5caa24a63b4225d4",
    measurementId: "G-4VZK167JWY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { analytics, auth, firestore };