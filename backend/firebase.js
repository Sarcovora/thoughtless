const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("dotenv").config();

const creds = JSON.parse(process.env.FIREBASE_CREDENTIALS);

// Firebase authentication
admin.initializeApp({
  credential: admin.credential.cert(creds),
  databaseURL: "//https://thoughtless-backend.firebaseio.com",
  storageBucket: "gs://thoughtless-backend.appspot.com"
});

const multer = require("multer");
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase-admin/storage");

const express = require("express");
const app = express();
const db = admin.firestore();
const auth = admin.auth(); 
const storage = getStorage(); 
const upload = multer({storage: multer.memoryStorage()}); 
// https://www.youtube.com/watch?v=CgMD6VykQXQ

const cors = require("cors");
app.use( cors({ origin:true }));

module.exports = {db, auth, storage, upload}; 
// module.exports = db

// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection } from 'firebase/firestore';
// require("dotenv").config();

// const creds = JSON.parse(process.env.FIREBASE_CREDENTIALS);

// // Firebase initialization
// initializeApp({
//   credential: admin.credential.cert(creds),
//   databaseURL: "https://thoughtless-backend.firebaseio.com"
// });

// const db = getFirestore();

// module.exports = db;
