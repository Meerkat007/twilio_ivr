// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = "ACfdc7ae0ddb1e08f83709a104362bc3f4";
const authToken = "455f4398b159d415cfda17e83624de9d";
const client = require('twilio')(accountSid, authToken);
const axios = require('axios');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');



  
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
const db = getFirestore();


  async function testDb() {
    const citiesRef = db.collection('cities').doc('SF');
    console.log('citiesRef', citiesRef)
    try {
        // await citiesRef.doc('SF').set({
        //     name: 'San Francisco', state: 'CA', country: 'USA',
        //     capital: false, population: 860000
        //   });
      
        const doc = await citiesRef.get();
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            console.log('Document data:', doc.data());
        }
    } catch (e) {
console.error('!!!!', e)
    }

    
  }


    testDb()


/*
periodically pull data and save to db
create an api endpoint that can retrieve the information
create a web page for calling that api
*/






function getDataFromTwilio() {
    client.calls('CA3252225398939099151f4fff3ab2833d')
    .fetch()
    .then(call => {
      //   console.log(call)
      });

const url = "https://api.twilio.com/2010-04-01/Accounts/ACfdc7ae0ddb1e08f83709a104362bc3f4/Calls/CA3252225398939099151f4fff3ab2833d/Events.json"
axios.get(url, {
  auth: {
      username: accountSid,
      password: authToken
  }
  }).then(response => {
      // console.log('response', response.data.events.forEach(event => {
      //     console.log(event)
      // }) )
      console.log('ffff')
      const events = response.data.events;
      events.forEach(event => {
          const requestParams = event.request.parameters;
          console.log(
              'User said', 
              requestParams.speech_result, 
              // requestParams.from,
              // requestParams.caller,
          )
          const responseBody = event.response.response_body;
          console.log('response', responseBody)
      })
  })
}



// pull logs based on date or some flag periodically
// iterate each item in the log
// retrieve events for each item
// retrieve question and user speech from events
// store these in the database

// db design
/*
calls

- create_date
- from_number
- user_speech
- plate_number
- bumper_id
- response
- extra

*/


function getDataFromTwilio() {

}

function getAllCalls(twilioClient, starTime, endTime, limit) {
    twilioClient
        .calls
        .list({
            startTimeBefore: endTime,
            startTimeAfter: starTime,
            limit: limit
        })
        .then(calls => calls.forEach(call => {
            console.log('call', call)
        }));
        return;
}

function getEvents() {

}

function parseDataForTransferToDb() {

}

function writeDataToDb() {

}



// curl -G https://api.twilio.com/2010-04-01/Accounts/ACfdc7ae0ddb1e08f83709a104362bc3f4/Calls/CA3252225398939099151f4fff3ab2833d/Events.json -u ACfdc7ae0ddb1e08f83709a104362bc3f4:455f4398b159d415cfda17e83624de9d
