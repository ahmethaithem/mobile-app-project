import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCZUVwnotwWUVPxqUbj0WsGr2uR19rffRA",
  authDomain: "expensetracker-40da2.firebaseapp.com",
  projectId: "expensetracker-40da2",
  storageBucket: "expensetracker-40da2.firebasestorage.app",
  messagingSenderId: "608627293035",
  appId: "1:608627293035:web:2da402cdd952c55cf82a2e"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
