const {
    database,
    getFeedbackForPlate,
} = require('./firestoreManager')
const moment = require('moment-timezone');

const startDateStr = '2022-10-10 00:00:00UTC-5'
const start = moment(startDateStr, 'YYYY-MM-DD').toDate();

const endDateStr = '2022-10-10 00:00:00UTC-5'
const end = moment(endDateStr, 'YYYY-MM-DD').toDate();
getFeedbackForPlate(database, )