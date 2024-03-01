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

// const {getFirestore} = require("firebase/firestore");

// const admin = require("firebase-admin");
// require("dotenv").config();

// const creds = JSON.parse(process.env.FIREBASE_CREDENTIALS);

// // Firebase initialization
// admin.initializeApp({
//   credential: admin.credential.cert(creds),
//   databaseURL: "https://thoughtless-backend.firebaseio.com"
// });

// const db = getFirestore();

// module.exports = db;
