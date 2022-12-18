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
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(getResponseBody())
    }
}

function getResponseBody(data, error) {
    return {
        data: data,
        error: error
    }
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
        response.body = JSON.stringify(getResponseBody(result));
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
// .then(d => console.log(d))

exports.handler = awsApiGatewayHander;