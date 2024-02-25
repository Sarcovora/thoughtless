// Importing required modules
const cors = require("cors");

// Creating an instance of Express
const express = require('express');
const app = express();

// Loading environment variables from a .env file into process.env
require("dotenv").config();

// Importing the Firestore database instance from firebase.js
const db = require("./firebase");

// Middleware to parse JSON bodies
app.use(express.json());

// POST: Endpoint to add a new org
app.post("/org", async (req, res) => {
    try {
      const {name, questions} = req.body; 
      const data = {
        name, 
        questions
      }
      const addedTask = await db.collection("orgs").add(data);    // You can also add validation for the task data here
  
      // Sending a successful response with the ID of the newly created org
      res.status(201).send({ id: addedTask.id, ...data });
    } catch (error) {
      // Sending an error response in case of an exception
      res.status(500).send(error.message);
    }
});

// GET: Endpoint to retrieve all orgs
app.get("/orgs", async (req, res) => {
    try {
        const snapshot = await db.collection("orgs").get();

        let orgs = [];
        if (snapshot.empty) {
            console.log('No matching documents.');
            res.status(404).send('No matching documents.');
            return;
        }  

        snapshot.forEach((doc) => {
            orgs.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).send(orgs);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST: Endpoint to add a new applicant
app.post("/application", async (req, res) => {
    try {
        
        const {name, org, ...responses } = req.body;
        
        const newData = {
            name: name,
            responses: Object.entries(responses).map(([question, answer]) => ({ question, answer })), 
            org: org
        };
        
        console.log(newData);
        
        const data = {
            name, 
            responses, 
            org
        };
      const addedTask = await db.collection("applications").add(data);    // You can also add validation for the task data here
  
      // Sending a successful response with the ID of the newly created applicant
      res.status(201).send({ id: addedTask.id, ...data });
    } catch (error) {
      // Sending an error response in case of an exception
      res.status(500).send(error.message);
    }
});

// GET: Endpoint to retrieve all applications
app.get("/applications", async (req, res) => {
    try {
        const snapshot = await db.collection("applications").get();

        let apps = [];
        if (snapshot.empty) {
            console.log('No matching documents.');
            res.status(404).send('No matching documents.');
            return;
        }  

        snapshot.forEach((doc) => {
            apps.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).send(apps);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Setting the port for the server to listen on
const PORT = process.env.PORT || 4001;
// Starting the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
