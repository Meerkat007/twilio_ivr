const {
    database,
    batchSendToFireStore,
    getLastReadEpochMillis,
    setLastReadEpochMillis
} = require('./firestoreManager')
const { getDataFromTwilio } = require('./twilioManager')
const timeUtils = require('./timeUtils');

async function run () {
    console.log('run')
    let readStartEpochMillis = -1;
    const lastReadEpoch = await getLastReadEpochMillis(database);
    if (lastReadEpoch === -1) {
        readStartEpochMillis = timeUtils
            .getEpochMillisFromDateTime('2022-11-01 00:00:00');
        await setLastReadEpochMillis(database, readStartEpochMillis);
    }
    const readStartDateTime = timeUtils
        .getFormattedEpoch(readStartEpochMillis);
    console.log('readStartDateTime', readStartEpochMillis, readStartDateTime)
    const readEndEpochMillis = timeUtils.getEpochMillisNow();
    const readEndDateTime = timeUtils
        .getFormattedEpoch(readEndEpochMillis);
    console.log('readEndDateTime', readEndEpochMillis, readEndDateTime)
    return;
    try {
        const twilioData = await getDataFromTwilio(
            readStartDateTime,
            readEndDateTime
        );
        console.log('!!!twilio data')
        await batchSendToFireStore(database, twilioData)
        await setLastReadEpochMillis(database, readEndEpochMillis);
    } catch (e) {
        console.error('failed with', e)
    }
}

setInterval(() => {
    try {
        run();
    } catch (e) {
        console.log('failed to run', e);
    }
}, 30 * 1000)

