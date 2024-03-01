// Importing required modules
const cors = require("cors");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

// Creating an instance of Express
const express = require('express');
const app = express();

// Loading environment variables from a .env file into process.env
require("dotenv").config();

// Importing the Firestore database instance from firebase.js
const db = require("./firebase");

// Middleware to parse JSON bodies
app.use(express.json());

const ORG_COLLECTION = 'orgs'
const REVIEWER_COLLECTION = 'reviewers'
const APPS_COLLECTION = 'apps'

const orgCollectionRef = db.collection(ORG_COLLECTION)

// Endpoint to make a new org
app.post("/org", async (req, res) => {
    try {
      const { name, questions } = req.body;
  
      const documentRef = db.collection(ORG_COLLECTION).doc();
      await documentRef.set({
        name: name,
        questions: questions
      });
  
      const reviewerCollectionRef = documentRef.collection(REVIEWER_COLLECTION);
      await reviewerCollectionRef.add({
        name: 'Joe'
      });
  
      const appCollectionRef = documentRef.collection(APPS_COLLECTION);
      await appCollectionRef.add({
        applicant: 'Bob'
      });
  
      // Sending a successful response with the ID of the newly created org
      res.status(201).send({ id: documentRef.id });
    } catch (error) {
      // Sending an error response in case of an exception
      res.status(500).send(error.message);
    }
  }); 

// GET: Endpoint to retrieve all orgs
app.get("/orgs", async (req, res) => {
    try {
        const snapshot = await db.collection(ORG_COLLECTION).get();

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

// POST: Endpoint to make a new reviewer and assign them to their org ... 
app.post("/reviewer", async (req, res) => {
    try {
        const { name, org } = req.body;

        const documentRef = db.collection(REVIEWER_COLLECTION).doc();
        await documentRef.set({
            name: name,
            org: org
        });

        // Send response with status 200
        res.status(200).send({ id: documentRef.id });

        const orgSnapshot = await db.collection(ORG_COLLECTION).where("name", "==", org).get(); // FIXME should change this to be ID 

        orgSnapshot.forEach(async (doc) => {
            // add reviewer document to the subcollection named reviewers within the org collection
            const orgId = doc.id;
            const reviewerRef = db.collection(ORG_COLLECTION).doc(orgId).collection("reviewers").doc(documentRef.id);
            await reviewerRef.set({
                name: name,
                reviewerId: documentRef.id
            });
        });
    } catch (error) {
        res.status(500).send(error.message)
    }
});



// const MAIN_COLLECTION_NAME = 'orgs'

// // Define your API function to add org
// async function addOrg(orgName) {
//     try {
//       // Add main collection
//       await firestore.collection(MAIN_COLLECTION_NAME).doc(orgName).set({
//         // Add fields or data for main collection
//         name: orgName
//       });
  
//       // Add subcollections
//       await firestore.collection(MAIN_COLLECTION_NAME).doc(orgName).collection('reviewers').doc('subDoc1').set({
//         // Add fields or data for subcollection 1
//         subField1: 'subValue1',
//         subField2: 'subValue2'
//       });
  
//       await firestore.collection('mainCollection').doc('mainDoc').collection('subCollection2').doc('subDoc2').set({
//         // Add fields or data for subcollection 2
//         subField3: 'subValue3',
//         subField4: 'subValue4'
//       });
  
//       // Add more subcollections as needed
  
//       console.log("Collections added successfully!");
//     } catch (error) {
//       console.error("Error adding collections: ", error);
//     }
//   }

// // POST: Endpoint to add a new org
// app.post("/org", async (req, res) => {
//     try {
//       const {name, questions} = req.body; 
//       const data = {
//         name, 
//         questions
//       }
//       const addedTask = await db.collection("orgs").add(data);    // You can also add validation for the task data here
  
//       // Sending a successful response with the ID of the newly created org
//       res.status(201).send({ id: addedTask.id, ...data });
//     } catch (error) {
//       // Sending an error response in case of an exception
//       res.status(500).send(error.message);
//     }
// });

// // GET: Endpoint to retrieve all orgs
// app.get("/orgs", async (req, res) => {
//     try {
//         const snapshot = await db.collection("orgs").get();

//         let orgs = [];
//         if (snapshot.empty) {
//             console.log('No matching documents.');
//             res.status(404).send('No matching documents.');
//             return;
//         }  

//         snapshot.forEach((doc) => {
//             orgs.push({
//                 id: doc.id,
//                 ...doc.data()
//             });
//         });

//         res.status(200).send(orgs);
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// // POST: Endpoint to add a new applicant
// app.post("/application", async (req, res) => {
//     try {
        
//         const {name, org, ...responses } = req.body;
        
//         const newData = {
//             name: name,
//             responses: Object.entries(responses).map(([question, answer]) => ({ question, answer })), 
//             org: org
//         };
        
//         console.log(newData);
        
//         const data = {
//             name, 
//             responses, 
//             org
//         };
//       const addedTask = await db.collection("applications").add(data); 
  
//       // Sending a successful response with the ID of the newly created applicant
//       res.status(201).send({ id: addedTask.id, ...data });
//     } catch (error) {
//       // Sending an error response in case of an exception
//       res.status(500).send(error.message);
//     }
// });

// // GET: Endpoint to retrieve all applications
// app.get("/applications", async (req, res) => {
//     try {
//         const snapshot = await db.collection("applications").get();

//         let apps = [];
//         if (snapshot.empty) {
//             console.log('No matching documents.');
//             res.status(404).send('No matching documents.');
//             return;
//         }  

//         snapshot.forEach((doc) => {
//             apps.push({
//                 id: doc.id,
//                 ...doc.data()
//             });
//         });

//         res.status(200).send(apps);
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// Setting the port for the server to listen on
const PORT = process.env.PORT || 4001;
// Starting the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
