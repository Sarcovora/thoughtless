const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("dotenv").config();

const creds = JSON.parse(process.env.FIREBASE_CREDENTIALS);

// Firebase authentication
admin.initializeApp({
  credential: admin.credential.cert(creds),
  databaseURL: "//https://thoughtless-backend.firebaseio.com"
});

const express = require("express");
const app = express();
const db = admin.firestore();

const cors = require("cors");
app.use( cors({ origin:true }));

module.exports = db; 

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
