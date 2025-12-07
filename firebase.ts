//File: firebase.ts
import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB8oeenzyciQ4MzUXTZAE3bYU1VpQYi1bU",
  authDomain: "chatapp-4b13f.firebaseapp.com",
  projectId: "chatapp-4b13f",
  storageBucket: "chatapp-4b13f.firebasestorage.app",
  messagingSenderId: "488805321390",
  appId: "1:488805321390:web:a0b507a76e581b3eb5bb3f"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Inisialisasi Firestore dengan Cache Lokal (Offline Mode)
// Sesuai tugas: "Simpan history chat di local storage"
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

const messagesCollection = collection(db, "messages") as CollectionReference<DocumentData>;

export {
  auth,
  db,
  messagesCollection,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
};