const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const {Twilio} = require('twilio');
const {getSanitizedPlateNumber} = require('./twilioManager');

  
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
database.settings({
    ignoreUndefinedProperties: true
})

async function batchSendToFireStore(db, twilioData) {
    if (!Array.isArray(twilioData) ||
        twilioData.length === 0
    ) {
        console.log('No data to send');
    }

    const batchWritter = db.batch();
    const twilioEventsCollection = getTwilioEventsCollection(db);
    let count = 0;
    const BATCH_WRITE_LIMIT = 500;

    for (data of twilioData) {
        batchWritter.set(
            twilioEventsCollection.doc(data.docName),
            {
                ...data,
            },
        )
        count++;
        if (count === BATCH_WRITE_LIMIT) {
            await batchWritter.commit();
            count = 0;
        }
    }

    if (count > 0) {
        await batchWritter.commit();
        count = 0;
    }
}

function getTwilioEventsCollection(db) {
    return db.collection('twilioEvents');
}

async function getLastReadEpochMillis(db) {
    const lastWriteEpochRef = db
        .collection('watermark')
        .doc('lastWriteEpochMillis');
    const doc = await lastWriteEpochRef.get()
    console.log('doc', doc.data().value)
    if (!doc.exists) {
        return -1;
    } else {
        return doc.data().value || -1;
    }
}

async function setLastReadEpochMillis(db, value) {
    const lastWriteEpochRef = db
        .collection('watermark')
        .doc('lastWriteEpochMillis');
    await lastWriteEpochRef.set({value})
    return value;
}

async function getFeedbackForPlate(db, plateNumber, startEpochMillis, endEpochMillis) {
    const sanitizedPlateNumber = getSanitizedPlateNumber(plateNumber);
    const docs = await getTwilioEventsCollection(db)
        .where('plateNumber', '=', sanitizedPlateNumber)
        .where('callEndTimeEpochMillis', '>=', startEpochMillis)
        .where('callEndTimeEpochMillis', '<=', endEpochMillis)
        .orderBy('callEndTimeEpochMillis', 'desc')
        .get()
    
    if (!docs.empty) {
        const result = [];
        docs.forEach(doc => {
            result.push(doc.data())
        })
        return result;
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}

module.exports = {
    database,
    batchSendToFireStore,
    getLastReadEpochMillis,
    setLastReadEpochMillis,
    getFeedbackForPlate,
}