// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    // TODO: Add your Firebase config here
};

// Initialize Firebase
if (getApps().length === 0) {
    initializeApp(firebaseConfig);
}

const db = getFirestore();

export { db };