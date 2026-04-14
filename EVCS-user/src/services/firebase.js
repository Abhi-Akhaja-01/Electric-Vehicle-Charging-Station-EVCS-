import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { firestore } from "./config";

const createCollection = async (collectionName, docId, data) => {
  const docRef = doc(firestore, collectionName, docId);
  const createdAt = new Date();
  try {
    await setDoc(docRef, { ...data, createdAt });
    return true;
  } catch (error) {
    return error;
  }
};

const getFullCollection = async (collectionName) => {
  const collectionRef = collection(firestore, collectionName);
  const q = query(collectionRef);
  try {
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (error) {
    console.error("Error getting documents:", error);
  }
};

export { createCollection, getFullCollection };
