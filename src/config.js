// export const credentials = {
//   firebase : {
//     apiKey: "AIzaSyBGKoky24XlRBsuGn-n8HYFQD4H67FKkdM",
//     authDomain: "hydromart-c937b.firebaseapp.com",
//     databaseURL: "https://hydromart-c937b.firebaseio.com",
//     projectId: "hydromart-c937b",
//     storageBucket: "hydromart-c937b.appspot.com",
//     messagingSenderId: "265425859597",
//     appId: "1:265425859597:web:ae85bc7e489c204c585144",
//     measurementId: "G-3C69186HFN"
//   }
// };

import firebase from 'firebase/app'
import 'firebase/firestore'; 

var firebaseConfig = {
  apiKey: "AIzaSyBGKoky24XlRBsuGn-n8HYFQD4H67FKkdM",
  authDomain: "hydromart-c937b.firebaseapp.com",
  databaseURL: "https://hydromart-c937b.firebaseio.com",
  projectId: "hydromart-c937b",
  storageBucket: "hydromart-c937b.appspot.com",
  messagingSenderId: "265425859597",
  appId: "1:265425859597:web:ae85bc7e489c204c585144",
  measurementId: "G-3C69186HFN"
  };
  
const firebaseApp=firebase.initializeApp(firebaseConfig);
const db=firebase.firestore();

export default db;