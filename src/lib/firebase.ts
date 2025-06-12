import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCO28Be7qxlyPa7e2FzfO2V6ZLVYPpe4Hg",
  authDomain: "traversebook-68768.firebaseapp.com",
  projectId: "traversebook-68768",
  storageBucket: "traversebook-68768.firebasestorage.app",
  messagingSenderId: "640798005007",
  appId: "1:640798005007:web:964939fb24a1a41695107a",
  measurementId: "G-J1BW7JX9BF"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 