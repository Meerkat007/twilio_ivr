const {
    database,
    getFeedbackForPlate,
} = require('./firestoreManager')
const moment = require('moment-timezone');

const startDateStr = '2022-11-10 00:00:00UTC-5'
const start = moment(startDateStr, 'YYYY-MM-DD').valueOf();

const endDateStr = '2022-11-20 00:00:00UTC-5'
const end = moment(endDateStr, 'YYYY-MM-DD').valueOf();
getFeedbackForPlate(database, '123456', start, end)

// TODO: set this up in api gateway and lambda