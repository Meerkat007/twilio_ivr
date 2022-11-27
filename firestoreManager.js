const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const {Twilio} = require('twilio');

  
// Initialize Firebase
const serviceAccount = require("./key/collisionzerov-dev-firebase-adminsdk-59lzo-6ce072f375.json");

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAw7SJ9hf37-O6TEh24b0NvSe70FJD4cyk",
    authDomain: "collisionzerov-dev.firebaseapp.com",
    projectId: "collisionzerov-dev",
    storageBucket: "collisionzerov-dev.appspot.com",
    messagingSenderId: "98222469541",
    appId: "1:98222469541:web:2ad3de32ab6603c3fc784c",
    credential: cert(serviceAccount)
  };

const app = initializeApp(firebaseConfig);
const database = getFirestore();

function batchSendToFireStore(db, twilioData) {
    if (!Array.isArray(twilioData) ||
        twilioData.length === 0
    ) {
        console.log('No data to send');
    }

    // 
    // const batchWritter = db.batch();
    // const twilioEventsRef = getTwilioEventsRef(db);

    twilioData.forEach(data => {
        console.log('aaa', data.docName, data);
    })

}

function getTwilioEventsRef(db) {
    return db.collection('twilioEvents');
}

module.exports = {
    batchSendToFireStore,
}