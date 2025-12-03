import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Product } from '../types';

// TODO: REPLACE WITH YOUR FIREBASE CONFIGURATION
// You can find this in your Firebase Console > Project Settings
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyCY8mQaQfvm-2kKC2dstyHKCh7CcZkCSqs",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "jwlstr-aefoniq.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "jwlstr-aefoniq",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "jwlstr-aefoniq.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "521397400358",
  appId: process.env.FIREBASE_APP_ID || "1:521397400358:web:9e44e2717dac38ff7ec7e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION_NAME = 'products';

export const fetchProductsFromDB = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const addProductToDB = async (product: Omit<Product, 'id'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), product);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
};

export const deleteProductFromDB = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
};
