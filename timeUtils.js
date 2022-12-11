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

    getEpochMillisFromTwilioEventDateTime(dateTimeStr) {
        // 2022-11-15T03:32:27.000Z
        const format = 'yyyy-MM-DDTHH:mm:ssZ';
        return moment(dateTimeStr, format).valueOf();
    }
}


