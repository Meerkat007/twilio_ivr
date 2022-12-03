const {
    database,
    batchSendToFireStore,
    getLastReadEpochMillis,
    setLastReadEpochMillis
} = require('./firestoreManager')
const { getDataFromTwilio } = require('./twilioManager')
const timeUtils = require('./timeUtils');

async function run () {
    // run every 30 sec
    // get last update epoch
    // query data between now and last update epoch
    let readStartEpochMillis = -1;
    const lastReadEpoch = await getLastReadEpochMillis(database);
    if (lastReadEpoch === -1) {
        readStartEpochMillis = timeUtils
            .getEpochMillisFromDateTime('2022-11-01 00:00:00');
        await setLastReadEpochMillis(database, readStartEpochMillis);
    }
    const readStartDateTime = timeUtils
        .getFormattedEpoch(readStartEpochMillis);
    const readEndEpochMillis = timeUtils.getFormattedNow();
    const readEndDateTime = timeUtils
        .getFormattedEpoch(readEndEpochMillis);
    try {
        const twilioData = await getDataFromTwilio(
            readStartDateTime,
            readEndDateTime
        );
        console.log('!!!twilio data')
        batchSendToFireStore('', twilioData)
    } catch (e) {
        console.error('failed with', e)
    }
}

run();