import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4wLxsDVhZq1dNErIQ_97HGaV-j6YXM_k",
  authDomain: "sri-anveeksha.firebaseapp.com",
  projectId: "sri-anveeksha",
  storageBucket: "sri-anveeksha.firebasestorage.app",
  messagingSenderId: "711998013275",
  appId: "1:711998013275:web:eb635fb24a6d2203ea247e",
  measurementId: "G-C0KDY1EWW6"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber };



