const {
    database,
    getFeedbackForPlate,
} = require('./firestoreManager')
const moment = require('moment-timezone');

const startDateStr = '2022-11-10 00:00:00UTC-5'
const start = moment(startDateStr, 'YYYY-MM-DD').valueOf();

const endDateStr = '2022-11-30 00:00:00UTC-5'
const end = moment(endDateStr, 'YYYY-MM-DD').valueOf();


function getResponse() {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "http://localhost:3000",
        },
        body: JSON.stringify(getResponseBody())
    }
}

function getResponseBody(data, error) {
    return {
        data: data,
        error: error
    }
}

const excludeKeywords = [
    'n/a',
    'no',
    'yes'
]

function shouldIncludeItem(item) {
    const check1 = item &&
        item.feedback &&
        item.feedback.trim();
    const feedbackLowerCase = item.feedback.toLowerCase();
    
    const check2 = excludeKeywords.every(word => {
        return feedbackLowerCase !== word
    })
    return check1 && check2;
}

function getFieldsToIncludeFromItem(item) {
    return {
        plateNumber: item.plateNumber || '',
        feedback: item.feedback || '',
        callEndTimeEpochMillis: item.callEndTimeEpochMillis || 0
    }
}

/**
 * data should contain the following field in each item
 * plateNumber
 * speechResult
 * callEndTimeEpochMillis
 * feedback
 * @param {*} data 
 */
function getCleanedDataForTransfer(data) {
    if (!Array.isArray(data)) {
        return [];
    }
    const result = [];
    data.forEach(eachItem => {
        if (shouldIncludeItem(eachItem)) {
            result.push(getFieldsToIncludeFromItem(eachItem))
        }
    })
    return result;
}

async function awsApiGatewayHander(event) {
    console.log('request received ', JSON.stringify(event))

    const response = getResponse();
    if (!event || 
        !event.queryStringParameters ||
        !event.queryStringParameters.plateNumber ||
        !event.queryStringParameters.startEpochMillis ||
        !event.queryStringParameters.endEpochMillis
    ) {
        response.statusCode = 400
        return response;
    }

    let result;
    try {
        result = await getFeedbackForPlate(
            database, 
            event.queryStringParameters.plateNumber, 
            Number(event.queryStringParameters.startEpochMillis), 
            Number(event.queryStringParameters.endEpochMillis)
        );
        const data = getCleanedDataForTransfer(result);
        response.body = JSON.stringify(getResponseBody(data));
    } catch (e) {
        console.error(
            'Failed to get result for event', 
            JSON.stringify(event),
            e
        )
        response.statusCode = 500;
    }
    
    return response;
}

// getFeedbackForPlate(database, '54321', 1668754899000, 1669791699000)
// .then(d => console.log(getCleanedDataForTransfer(d)))

exports.handler = awsApiGatewayHander;