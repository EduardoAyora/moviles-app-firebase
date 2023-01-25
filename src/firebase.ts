import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAnwLnQR2AZlU5FxX49pvl07dhwZtQfYOg",
  authDomain: "citas-medicas-moviles.firebaseapp.com",
  projectId: "citas-medicas-moviles",
  storageBucket: "citas-medicas-moviles.appspot.com",
  messagingSenderId: "520059290213",
  appId: "1:520059290213:web:4985df127891e0dba07c8c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;