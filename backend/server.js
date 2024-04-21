// Importing required modules
const cors = require("cors");
// const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");


// Creating an instance of Express
const express = require('express');
const app = express();
const admin = require('firebase-admin');


// Loading environment variables from a .env file into process.env
require("dotenv").config();

// Importing the Firestore database instance from firebase.js
const firebaseModules = require("./firebase");
const db = firebaseModules.db
const storage = firebaseModules.storage
const upload = firebaseModules.upload
// const ref = firebaseModules.ref
// const 

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors()); 

const ORG_COLLECTION = 'orgs'
const REVIEWER_COLLECTION = 'reviewers'
const APPS_COLLECTION = 'apps'

const orgCollectionRef = db.collection(ORG_COLLECTION)

// for hashing
var pbkdf2 = require('pbkdf2')
// JWT 
const jwt = require('jsonwebtoken');
const SALT = ";asf;klsadfllsfjalskdfjl";

const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'thoughtlessautomail@gmail.com',
        pass: process.env.EMAIL_PASSWORD
    }
});


// Hash a password function using PBKDF2
const hashPassword = (password) => {
    const key = pbkdf2.pbkdf2Sync(password, SALT, 1000, 64, 'sha512');
    return key.toString('hex');
  };

// Auth Middleware for non expiring tokens (check validity of token sent in)
function authMiddleware(req, res, next) {
    // Check if proper header exists
    if (req.headers["authorization"]) {
        // Split on space -> should return ["Bearer", "${token}"]
        const headers = req.headers["authorization"].split(" ");
        // Check if first argument is Bearer
        if (headers.length === 2 && headers[0] === "Bearer") {
        let token = headers[1];
        try {
            // verify the token
            let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            // Set user object which can be accessed in the req in future
            req.user = decodedToken.email;
            next(); // Go to next function
        } catch (e) {
            return res.status(401).json({ msg: e.message });
        }
        } else {
        return res.status(401).json({ msg: "invalid token" });
        }
    } else {
        return res.status(401).json({ msg: "token was not found in header" });
    }
}

function adminAuthMiddleware(req, res, next) {
    if (req.headers["authorization"]) {
        const headers = req.headers["authorization"].split(" ");
        if (headers.length === 2 && headers[0] === "Bearer") {
            let token = headers[1];
            try {
                let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                if (decodedToken.role !== "admin") {
                    throw new Error("Not authorized as admin");
                }
                req.user = decodedToken;
                next();
            } catch (e) {
                return res.status(401).json({ msg: e.message });
            }
        } else {
            return res.status(401).json({ msg: "Invalid token format" });
        }
    } else {
        return res.status(401).json({ msg: "Authorization token missing" });
    }
}

function sendTokenEmail(email, token) {
    const mailOptions = {
        from: 'thoughtlessautomail@gmail.com', // sender address
        to: email, // list of receivers
        subject: 'Your Access Token', // Subject line
        text: 'Here is your token: ' + token, // plaintext body
        html: `<b>Here is your token:</b> <code>${token}</code>` // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log('Email could not be sent: ' + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


// Endpoint to make a new org
app.post("/org", cors(), async (req, res) => {
    try {
      const { name } = req.body;
  
      const documentRef = db.collection(ORG_COLLECTION).doc();
      await documentRef.set({
        name: name,
        questions: [], 
        hyperlinks: [], 
        id_info: [], 
        file: ""
      });
  
      const reviewerCollectionRef = documentRef.collection(REVIEWER_COLLECTION);
      const reviewerDocRef = await reviewerCollectionRef.add({
        name: 'Joe'
      });

      await reviewerDocRef.delete(); // Delete the document after creation

      const appCollectionRef = documentRef.collection(APPS_COLLECTION);
      const appDocRef = await appCollectionRef.add({
        applicant: 'Bob'
      });
      await appDocRef.delete();
  
      // Sending a successful response with the ID of the newly created org
      res.status(201).send({ id: documentRef.id });
    } catch (error) {
      // Sending an error response in case of an exception
      res.status(500).send(error.message);
    }
  }); 

// POST: add questions, hyperlinks, and id_info
app.post("/org/details", cors(), async (req, res) => {
    try {
        const { org, questions, hyperlinks, id_info } = req.body;

        // Query Firestore to find the organization document by name
        const querySnapshot = await db.collection(ORG_COLLECTION).where("name", "==", org).get();

        // Check if there's a matching document
        if (querySnapshot.empty) {
            console.log('No matching document.');
            res.status(404).send('No matching document.');
            return;
        }  

        // There should only be one document matching the name, so we take the first one
        const documentRef = querySnapshot.docs[0].ref;

        // Update the organization document with the provided details
        await documentRef.update({
            questions: questions,
            hyperlinks: hyperlinks,
            id_info: id_info
        });

        // Sending a successful response
        res.status(200).send("Organization details updated successfully");
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
        const { firstname, lastname, email, password, org } = req.body;

        const passHashed = hashPassword(password);

        const check = await db.collection(REVIEWER_COLLECTION).doc(email).get();
        if(check.exists) {
            return res.status(400).json({ msg: "User exists" });
        }

        role = "user"
        const check2 = await db.collection(ORG_COLLECTION).doc(org).get();
        if (!check2.exists) {
            role = "admin"
            const documentRef = db.collection(ORG_COLLECTION).doc();
            await documentRef.set({
                name: org,
                questions: [], 
                hyperlinks: [], 
                id_info: [], 
                file: ""
            });
        
            const reviewerCollectionRef = documentRef.collection(REVIEWER_COLLECTION);
            const reviewerDocRef = await reviewerCollectionRef.add({
                name: 'Joe'
            });

            await reviewerDocRef.delete(); // Delete the document after creation

            const appCollectionRef = documentRef.collection(APPS_COLLECTION);
            const appDocRef = await appCollectionRef.add({
                applicant: 'Bob'
            });
            await appDocRef.delete();
        }

        const reviewer = {
            email: email,
            firstname: firstname, 
            lastname: lastname, 
            password: passHashed,
            org: org, 
            role: role
        }
        console.log(reviewer)

        const reviewerRef = db.collection(REVIEWER_COLLECTION); 
        await reviewerRef.doc(email).set(reviewer)

        const documentRef = db.collection(REVIEWER_COLLECTION).doc(email);
        // await documentRef.set({
        //     name: name,
        //     org: org
        // });


        // Send response with status 200
        // res.status(200).send({ id: documentRef.id });

        const orgSnapshot = await db.collection(ORG_COLLECTION).where("name", "==", org).get(); // FIXME should change this to be ID 

        orgSnapshot.forEach(async (doc) => {
            // add reviewer document to the subcollection named reviewers within the org collection
            const orgId = doc.id;
            const reviewerRef = db.collection(ORG_COLLECTION).doc(orgId).collection(REVIEWER_COLLECTION).doc(documentRef.id);
            await reviewerRef.set({
                name: email,
                firstname: firstname, 
                lastname: lastname,
                reviewerId: documentRef.id,
                apps: []
            });
            // res.status(200).send({ id: reviewerRef.id });
        });

        // create new access token
        const accessToken = jwt.sign(
            { "email": email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '24h' }
        );  
        // Send JWT Token back
        res.json({
            msg: "successfully created",
            data: { email: email, org: org },
            token: accessToken,
        });
    } catch (error) {
        res.status(500).send(error.message)
    }
});

// Verifies password + creates token
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const passHashed = hashPassword(password);
    // Get the user
    const check = await db.collection(REVIEWER_COLLECTION).doc(email).get();
    // Check if user exists
    if (!check.exists) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    // Cross reference the stored password with the incoming password (hashed)
    const user = check.data();
    let samePassword = passHashed === user.password;
    if (samePassword) {
      // user logged in correctly
      const accessToken = jwt.sign(
        { "email": email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '24h' }
      );
      return res.json({
        msg: "successfully logged in",
        data: { email: email, org: user.org },
        token: accessToken,
      });
    } else {
      return res.status(401).json({ msg: "Username or password was incorrect" });
    }
  });


  // POST: add apps to review to a single reviewer 
app.post("/assign", cors(), async (req, res) => {
    try {
        const { org, reviewer, apps } = req.body;

        const orgSnapshot = await db.collection(ORG_COLLECTION).where("name", "==", org).get(); // FIXME should change this to be ID 

        orgSnapshot.forEach(async (doc) => {
            const orgId = doc.id;
            const reviewerRef = db.collection(ORG_COLLECTION).doc(orgId).collection(REVIEWER_COLLECTION).doc(reviewer); //ASSUME this is ID 
            await reviewerRef.update({
                apps: apps
            });
        });

        // Sending a successful response
        res.status(200).send("Authorized applications updated successfully");
    } catch (error) {
        // Sending an error response in case of an exception
        res.status(500).send(error.message);
    }
});

//POST : Endpoint to post a new app 
app.post("/app", cors(), async(req,res) => {
    try {
        const { name, id_info, org, responses, hyperlinks } = req.body;

        const orgSnapshot = await db.collection(ORG_COLLECTION).where("name", "==", org).get(); // FIXME should change this to be ID 

        orgSnapshot.forEach(async (doc) => {
            // add reviewer document to the subcollection named reviewers within the org collection
            const orgId = doc.id;
            const appRef = db.collection(ORG_COLLECTION).doc(orgId).collection(APPS_COLLECTION).doc();
            await appRef.set({
                name: name,
                status: "Incomplete",
                id_info: id_info, 
                hyperlinks: hyperlinks,
                responses: responses
            });
            res.status(200).send({ id: appRef.id });

        });
    } catch (error) {
        res.status(500).send(error.message)
    }
}); 

//POST : Endpoint to update an app's status 
app.post("/update-status", cors(), async(req,res) => {
    try {
        const { app_id, status, org } = req.body;

       // Retrieve the assigned app IDs from the reviewer's document
       const orgSnapshot = await db.collection(ORG_COLLECTION).where("name", "==", org).get();
       if (orgSnapshot.empty) {
           return res.status(404).send('Organization not found.');
       }
       const orgId = orgSnapshot.docs[0].id;

       const appRef = db.collection(ORG_COLLECTION).doc(orgId).collection(APPS_COLLECTION).doc(app_id);


       await appRef.update({
            status: status
       })

       res.status(200).send("Status updated successfully.");
    } catch (error) {
        res.status(500).send(error.message)
    }
}); 

//POST : Endpoint to post many new apps
app.post("/apps", cors(), async (req, res) => {
    try {
        const apps = req.body; // Assuming req.body is an array of apps

        const orgSnapshot = await db.collection(ORG_COLLECTION).where("name", "in", apps.map(app => app.org)).get(); // FIXME should change this to be ID 

        const promises = [];

        orgSnapshot.forEach(async (orgDoc) => {
            const orgId = orgDoc.id;
            
            apps.filter(app => app.org === orgDoc.data().name).forEach(async (app) => {
                const appRef = db.collection(ORG_COLLECTION).doc(orgId).collection(APPS_COLLECTION).doc();
                promises.push(
                    appRef.set({
                        name: app.name,
                        status: "Incomplete",
                        id_info: app.id_info,
                        hyperlinks: app.hyperlinks,
                        responses: app.responses
                    })
                );
            });
        });

        await Promise.all(promises);

        res.status(200).send({ message: "Apps added successfully" });
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

// GET: Endpoint to retrieve apps assigned to a specific reviewer within an organization
app.get("/assigned-apps/:org/:reviewerId", cors(), async (req, res) => {
    try {
        const { org, reviewerId } = req.params;

        // Retrieve the assigned app IDs from the reviewer's document
        const orgSnapshot = await db.collection(ORG_COLLECTION).where("name", "==", org).get();
        if (orgSnapshot.empty) {
            return res.status(404).send('Organization not found.');
        }
        const orgId = orgSnapshot.docs[0].id;

        const reviewerRef = db.collection(ORG_COLLECTION).doc(orgId).collection(REVIEWER_COLLECTION).doc(reviewerId);
        const reviewerDoc = await reviewerRef.get();
        if (!reviewerDoc.exists) {
            return res.status(404).send('Reviewer not found.');
        }
        const assignedAppIds = reviewerDoc.data().apps || [];

        // Fetch the application details for the assigned application IDs
        const appsCollectionRef = db.collection(ORG_COLLECTION).doc(orgId).collection(APPS_COLLECTION);
        const appsQuerySnapshot = await appsCollectionRef.where(admin.firestore.FieldPath.documentId(), 'in', assignedAppIds).get();

        let assignedApps = [];
        appsQuerySnapshot.forEach(doc => {
            assignedApps.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).send(assignedApps);
    } catch (error) {
        console.error("Error retrieving assigned apps:", error);
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

app.post("/file", upload.single("filename"), cors(), async (req, res) => {
    try {
        const dateTime = giveCurrentDateTime();

        const bucket = storage.bucket(); // Get a reference to the default storage bucket

        const storageRef = bucket.file(`files/${req.file.originalname + "       " + dateTime}`);

        // Create file metadata including the content type
        const metadata = {
            contentType: req.file.mimetype,
        };

        // Upload the file in the bucket storage
        await storageRef.save(req.file.buffer, {
            metadata: metadata,
            resumable: false // Disable resumable uploads for simplicity
        });

        // Grab the public url
        const downloadURL = await storageRef.getSignedUrl({
            action: 'read',
            expires: '03-25-2025' // Adjust the expiration date as needed
        });

        // post the download URL for the org 
        const { org } = req.body;

        // Query Firestore to find the organization document by name
        const querySnapshot = await db.collection(ORG_COLLECTION).where("name", "==", org).get();

        // Check if there's a matching document
        if (querySnapshot.empty) {
            console.log('No matching document for org ', org);
            res.status(404).send('No matching document for org');
            return;
        }  

        // There should only be one document matching the name, so we take the first one
        const documentRef = querySnapshot.docs[0].ref;

        // Update the organization document with the provided details
        await documentRef.update({
            file: downloadURL[0],
        });

        console.log('File successfully uploaded.');

        // Run Python script on the saved file
        const spawn = require("child_process").spawn;
        const path = require('path');
        const fs = require('fs');
        const pythonScript = path.join(__dirname, 'csv_to_json.py');

        fs.access(pythonScript, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('Python script file does not exist:', pythonScript);
                return;
            }
            else {
                console.log("YYAAAAAAAAAAAAAAAAAAYYYYYYYYY")
            }

            // Proceed to spawn the Python process
        });

        // const pythonScript = './csv_to_json.py';
        const pythonProcess = spawn('python', [pythonScript])
        console.log('req.file:', req.file);
        // const pythonProcess = spawn('python', [pythonScript, req.file.buffer]);

        // Pipe the file buffer to the Python script's standard input
        pythonProcess.stdin.write(req.file.buffer);
        pythonProcess.stdin.end();

        // Capture output of the Python script
        let output = '';
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        // Handle Python script completion
        pythonProcess.on('close', (code) => {
            console.log(`Python script exited with code ${code}`);
            // Send the output back as response
            res.send(output);
        });

        // return res.send({
        //     message: 'file uploaded to firebase storage',
        //     name: req.file.originalname,
        //     type: req.file.mimetype,
        //     downloadURL: downloadURL[0] // The getSignedUrl method returns an array of URLs
        // });
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

// Helper function to give date and time for file names
const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
}

app.post("/invite-user", cors(), adminAuthMiddleware, async (req, res) => {
    try {
        const { email, org } = req.body;
        const token = jwt.sign(
            { email, org },
            process.env.INVITE_SECRET,
            { expiresIn: '48h' }
        );

        sendTokenEmail(email, token)
        console.log(`Invite token for ${email}: ${token}`); // For demonstration

        res.status(200).json({ message: "Invitation sent successfully", token });
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.post("/fuckme", cors(), async (req, res) => {
    try {
        res.status(200).json({ message: process.env.ACCESS_TOKEN_SECRET });
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.post("/register-from-invite", cors(), async (req, res) => {
    const { token, email, firstname, lastname, password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.INVITE_SECRET);
        const { org } = decoded; // FIXME shouldn't this be org and email? 

        // Create user logic here
        const reviewer = {
            email: email,
            firstname: firstname, 
            lastname: lastname, 
            password: passHashed(password),
            role: "user",
            org: org
        };
        console.log(reviewer)

        const reviewerRef = db.collection(REVIEWER_COLLECTION); 
        await reviewerRef.doc(email).set(reviewer)

        const documentRef = db.collection(REVIEWER_COLLECTION).doc(email);
        // await documentRef.set({
        //     name: name,
        //     org: org
        // });


        // Send response with status 200
        // res.status(200).send({ id: documentRef.id });

        const orgSnapshot = await db.collection(ORG_COLLECTION).where("name", "==", org).get(); // FIXME should change this to be ID 

        orgSnapshot.forEach(async (doc) => {
            // add reviewer document to the subcollection named reviewers within the org collection
            const orgId = doc.id;
            const reviewerRef = db.collection(ORG_COLLECTION).doc(orgId).collection(REVIEWER_COLLECTION).doc(documentRef.id);
            await reviewerRef.set({
                name: email,
                firstname: firstname, 
                lastname: lastname,
                reviewerId: documentRef.id,
                apps: []
            });
            // res.status(200).send({ id: reviewerRef.id });
        });

        // create new access token
        const accessToken = jwt.sign(
            { "email": email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '24h' }
        );  
        // Send JWT Token back
        res.json({
            msg: "successfully created",
            data: { email: email, org: org },
            token: accessToken,
        });

        res.status(201).json({ message: "User registered from invite", user: newUser });
    } catch (error) {
        res.status(400).send("Invalid or expired token");
    }
});





// Setting the port for the server to listen on
const PORT = process.env.PORT || 4001;
// Starting the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
