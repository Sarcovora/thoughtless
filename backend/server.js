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
app.use(cors()); 

const ORG_COLLECTION = 'orgs'
const REVIEWER_COLLECTION = 'reviewers'
const APPS_COLLECTION = 'apps'

const orgCollectionRef = db.collection(ORG_COLLECTION)

// Endpoint to make a new org
app.post("/org", cors(), async (req, res) => {
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
app.get("/orgs", cors(), async (req, res) => {
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

// GET: List of questions for an org
app.get("/questions/:org", cors(), async(req, res) => {
    try {
        const org = req.params.org;

        const orgSnapshot = await db.collection(ORG_COLLECTION).where("name", "==", org).get(); // FIXME should change this to be ID 

        if (orgSnapshot.empty) {
            console.log('No matching documents.');
            res.status(404).send('No matching documents.');
            return;
        }  

        // Access the qeustions list within the org document
        const questions = orgSnapshot.docs[0].data().questions; // Assuming there's only one org with this name
    
        res.status(200).send(questions);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

// POST: Endpoint to make a new reviewer and assign them to their org ... 
app.post("/reviewer", cors(), async (req, res) => {
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
            const reviewerRef = db.collection(ORG_COLLECTION).doc(orgId).collection(REVIEWER_COLLECTION).doc(documentRef.id);
            await reviewerRef.set({
                name: name,
                reviewerId: documentRef.id
            });
            // res.status(200).send({ id: reviewerRef.id });
        });
    } catch (error) {
        res.status(500).send(error.message)
    }
});

//POST : Endpoint to post a new app 
app.post("/app", cors(), async(req,res) => {
    try {
        const { name, org, responses } = req.body;

        const orgSnapshot = await db.collection(ORG_COLLECTION).where("name", "==", org).get(); // FIXME should change this to be ID 

        orgSnapshot.forEach(async (doc) => {
            // add reviewer document to the subcollection named reviewers within the org collection
            const orgId = doc.id;
            const appRef = db.collection(ORG_COLLECTION).doc(orgId).collection(APPS_COLLECTION).doc();
            await appRef.set({
                name: name,
                responses: responses
            });
            res.status(200).send({ id: appRef.id });

        });
    } catch (error) {
        res.status(500).send(error.message)
    }
}); 

// ALTERNATE GET using params instead of body 
app.get("/apps/:org", cors(), async (req, res) => {

    try {
      const org = req.params.org;

      const orgSnapshot = await db.collection(ORG_COLLECTION).where("name", "==", org).get(); // FIXME should change this to be ID 

      if (orgSnapshot.empty) {
          console.log('No matching documents.');
          res.status(404).send('No matching documents.');
          return;
      }  

      // Access the apps subcollection within the org document
      const orgData = orgSnapshot.docs[0].data(); // Assuming there's only one org with this name
      const appsCollectionRef = db.collection(ORG_COLLECTION).doc(orgSnapshot.docs[0].id).collection(APPS_COLLECTION);
      
      // Retrieve all apps from the apps subcollection
      const appsSnapshot = await appsCollectionRef.get();
      const apps = [];
      appsSnapshot.forEach((doc) => {
          apps.push(doc.data());
      });

      res.status(200).send(apps);
  } catch (error) {
      res.status(500).send(error.message);
  }
})

// POST: push feedback from a reviewer to an app
app.post("/feedback", cors(), async (req, res) => {
    const { org, reviewer, app, feedback_array, comments_array } = req.body;

    try {
        const orgSnapshot = await db.collection(ORG_COLLECTION).where("name", "==", org).get();
        if (orgSnapshot.empty) {
            console.log('No matching documents. for org');
            res.status(404).send('No matching documents for org.');
            return;
        }

        const orgId = orgSnapshot.docs[0].id;
        const appSnapshot = await db.collection(ORG_COLLECTION).doc(orgId).collection(APPS_COLLECTION).where("name", "==", app).get();

        if (appSnapshot.empty) {
            console.log('No matching documents for app');
            res.status(404).send('No matching documents for app.');
            return;
        }

        const appId = appSnapshot.docs[0].id;
        const appRef = db.collection(ORG_COLLECTION).doc(orgId).collection(APPS_COLLECTION).doc(appId);

        // Construct the data object to be updated
        const updateData = {};
        updateData[`reviewers.${reviewer}.feedback`] = feedback_array;
        updateData[`reviewers.${reviewer}.comments`] = comments_array;

        // Update the document with the new data
        await appRef.update(updateData);

        res.status(200).send('Feedback added successfully.');
    } catch (error) {
        console.error("Error adding feedback:", error);
        res.status(500).send(error.message);
    }
});

//GET for feedback 
app.get("/feedback/:org/:app/:reviewer", cors(), async (req, res) => {
    const org = req.params.org;
    const reviewer = req.params.reviewer; 
    const app = req.params.app;  

    try {
        const orgSnapshot = await db.collection(ORG_COLLECTION).where("name", "==", org).get();
        if (orgSnapshot.empty) {
            console.log('No matching documents.');
            res.status(404).send('No matching documents.');
            return;
        }

        const orgId = orgSnapshot.docs[0].id;
        const appSnapshot = await db.collection(ORG_COLLECTION).doc(orgId).collection(APPS_COLLECTION).where("name", "==", app).get();

        if (appSnapshot.empty) {
            console.log('No matching app documents.');
            res.status(404).send('No matching documents.');
            return;
        }

        const appId = appSnapshot.docs[0].id;
        const appRef = db.collection(ORG_COLLECTION).doc(orgId).collection(APPS_COLLECTION).doc(appId);

        const appDoc = await appRef.get();
        if (!appDoc.exists) {
            console.log('App document not found.');
            res.status(404).send('App document not found.');
            return;
        }

        const appData = appDoc.data();
        if (!appData.reviewers || !appData.reviewers[reviewer]) {
            console.log('Reviewer data not found.');
            res.status(404).send('Reviewer data not found.');
            return;
        }

        const feedbackArray = appData.reviewers[reviewer].feedback || [];
        const commentsArray = appData.reviewers[reviewer].comments || [];

        res.status(200).json({ feedbackArray, commentsArray });
    } catch (error) {
        console.error("Error retrieving feedback:", error);
        res.status(500).send(error.message);
    }
});

// Setting the port for the server to listen on
const PORT = process.env.PORT || 4001;
// Starting the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
