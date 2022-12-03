const {
    database,
    batchSendToFireStore,
    getLastWriteEpoch
} = require('./firestoreManager')
const { getDataFromTwilio } = require('./twilioManager')

async function run () {
    try {
        const twilioData = await getDataFromTwilio()
        console.log('!!!twilio data')
        batchSendToFireStore('', twilioData)
    } catch (e) {
        console.error('failed with', e)
    }
}

getLastWriteEpoch(database)
