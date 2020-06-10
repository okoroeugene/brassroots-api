var firebase = require('firebase');

const firebaseConfig = {
    apiKey: process.env.firebaseAuthKey,
    authDomain: process.env.firebaseAuthDomain,
    projectId: process.env.firebaseProjectID,
    databaseURL: process.env.firebaseDatabaseURL,
    storageBucket: process.env.firebaseStorageBucket,
};

var app = firebase.initializeApp(firebaseConfig);

module.exports = app.firestore();