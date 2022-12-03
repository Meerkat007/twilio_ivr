const moment = require('moment-timezone');

const TWILIO_DATE_TIME_FORMAT = 'yyyy-MM-DD HH:mm:ss';

module.exports = {
    getFormattedNow() {
        return moment().format(TWILIO_DATE_TIME_FORMAT)
    },

    getEpochMillisNow() {
        return moment().valueOf();
    },

    getFormattedEpoch(epoch) {
        return moment(epoch).format(TWILIO_DATE_TIME_FORMAT)
    },

    getEpochMillisFromDateTime(dateTime) {
        return moment(dateTime, TWILIO_DATE_TIME_FORMAT).valueOf();
    },
}


