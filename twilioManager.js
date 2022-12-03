// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = 'ACfdc7ae0ddb1e08f83709a104362bc3f4'
const authToken = '455f4398b159d415cfda17e83624de9d'
const client = require('twilio')(accountSid, authToken)
const axios = require('axios')
const API_HOST = 'https://api.twilio.com'

const PLATE_NUM_INDICATOR = 'Thank you for providing plate number'
const FEEDBACK_INDICATOR = 'do you have more feedback'
const BUMPER_ID_INDICATOR = ''

// db design
/*

select all feedback for a given plate number or bumper id

how to get plate number or bumper id
- single field

how to get feedback
- feedback field

1 or multiple event may contain plate number or bumper id for given date and time

callsid + event index

- create_date
- from_number
- user_speech
- plate_number
- bumper_id
- response
- extra

*/

async function getDataFromTwilio (startDateTime, endDateTime) {
    const LOG_HEADER = '[getDataFromTwilio] ';
    console.log(LOG_HEADER + 'startDateTime ' + startDateTime + 'endDateTime ' + endDateTime);
    const calls = await getAllCalls(
        client,
        startDateTime,
        endDateTime
    )

    let finalData = []
    for (const call of calls) {
        try {
            const eventsGot = await getEventsFromSingleCall(call)
            if (Array.isArray(eventsGot)) {
                const processedEvents = getProcessedEventsForTransferToDb(
                    call,
                    eventsGot
                )
                finalData = [
                    ...finalData,
                    ...processedEvents
                ]
            }
        } catch (e) {
            console.error(e)
        }
    }
    return finalData
}

async function getAllCalls (twilioClient, starTime, endTime) {
    try {
        const calls = await twilioClient
            .calls
            .list({
                endTimeBefore: endTime,
                endTimeAfter: starTime
            })
        return calls
    } catch (e) {
        console.error(e)
    }
}

async function getEventsFromSingleCall (call) {
    let eventUri = call?.subresourceUris?.events
    if (eventUri) {
        eventUri = API_HOST + eventUri
        try {
            return await getEvents(eventUri)
        } catch (e) {
            console.error(e)
        }
    }
}

async function getEvents (eventUri) {
    if (!eventUri) {
        return Promise.resolve(undefined)
    }

    try {
        return await axios.get(eventUri, {
            auth: {
                username: accountSid,
                password: authToken
            }
        }).then(response => {
            return response.data.events
        })
    } catch (e) {
        console.error(e)
        return []
    }
}

function getCallDataForDb (call) {
    const {
        startTime,
        endTime,
        callStatus: status,
        from,
        accountSid,
        sid
    } = call

    return {
        callStartTime: startTime,
        callEndTime: endTime,
        callStatus: status,
        from,
        accountSid,
        callSid: sid
    }
}

/**
 * Decide if the event should be included and stored.
 * @param {} event
 */
function shouldIncludeEvent (event) {

}

function getProcessedEventsForTransferToDb (call, events) {
    const processedEvents = []
    let plateNumber = ''
    if (!Array.isArray(events)) {
        return []
    }

    const callData = getCallDataForDb(call)

    // For each event, construct a document.
    events.forEach((event, index) => {
        const parsedEvent = getParsedEvent(event)

        if (!parsedEvent) {
            // Not the event we want - skip.
            return
        }

        if (parsedEvent.plateNumber &&
        parsedEvent.plateNumber.length >= 5
        ) {
            plateNumber = parsedEvent.plateNumber
        }

        // TODO: bumper id
        const eventForDb = {
            ...callData,
            ...parsedEvent
        }
        processedEvents.push(eventForDb)
    })
    // Not userful without plate number.
    if (!plateNumber) {
        return []
    }

    const output = processedEvents.map((processedEvent, index) => {
        // unique identifier for each document in firestore
        const doc = callData.callSid + '_' + index
        return {
            docName: doc,
            ...callData,
            ...processedEvent,
            plateNumber
        }
    })
    return output
}

function getParsedEvent (event) {
    const requestParams = event?.request?.parameters
    if (!requestParams) {
        return
    }

    const {
        speech_result
    } = requestParams

    if (!speech_result) {
        return
    }

    const parsedEvent = {
        speechResult: speech_result
    }
    const responseBody = event?.response?.response_body
    if (responseBody) {
        parsedEvent.machineResponse = responseBody
        if (responseBody.indexOf(PLATE_NUM_INDICATOR) !== -1) {
            parsedEvent.plateNumber = speech_result
        }
    }
    return parsedEvent
}

module.exports = {
    getDataFromTwilio
}
