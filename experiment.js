const {getDataFromTwilio} = require('./twilioManager');
const timeUtils = require('./timeUtils')

// getDataFromTwilio('2022-11-01', '2022-12-01')
console.log(timeUtils.getEpochMillisFromTwilioEventDateTime('2022-11-15T03:32:27.000Z'))