// Импортируeм необходимые функции из SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Моя конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCAMuFFr_-7ZWAUFTko8OI_169LcOqJYuM",
  authDomain: "real-time-chat-446e5.firebaseapp.com",
  projectId: "real-time-chat-446e5",
  storageBucket: "real-time-chat-446e5.firebasestorage.app",
  messagingSenderId: "1079443334505",
  appId: "1:1079443334505:web:db3d45ca658daef4dcc9f8"
};

const app = initializeApp(firebaseConfig); // Инициализация Firebase

const db = getFirestore(app); // Получение экземпляра Firestore

// Экспортируем объект db для использования в других частях приложения
export { db };