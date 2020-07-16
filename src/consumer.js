const Schedule = require('./schedule.model');
const { sendMessageBatch } = require('./sqs');
const debug = require('debug')('schedule-receive');
const { maxDelayTime } = require('./constans');
const { recordToQueueMessage } = require('./util');
exports.handler = async (event, context) => {
  // receive sqs message
  // write to dynamo
  debug('event: %s', JSON.stringify(event, null, 2));
  debug('context %s', JSON.stringify(context, null, 2));
  // scan dynamo
  try {
    const dueToTime = Date.now() + maxDelayTime;
    debug('dueToTime: %s', dueToTime);
    const records = await Schedule.query('status')
      .eq('active')
      .and()
      .where('triggeredAt')
      .lt(dueToTime)
      .exec();
    debug('records.length %s', records.length);
    if (records.length > 0) {
      // need to handle
      // group by queue url
      const queueMap = {};
      records.forEach(record => {
        if (queueMap[record.queueUrl]) {
          queueMap[record.queueUrl].push(record);
        } else {
          queueMap[record.queueUrl] = [record];
        }
      });
      const keys = Object.keys(queueMap);

      // send
      const sendPromises = keys.map(key => {
        const sendRecords = queueMap[key];
        debug('sendRecords: %o', sendRecords);
        return sendMessageBatch({
          QueueUrl: key,
          Entries: sendRecords.map(recordToQueueMessage)
        });
      });
      if (sendPromises.length > 0) {
        const results = await Promise.all(sendPromises);
        debug('results', results);
        // delete the db records
        await Schedule.batchDelete(records.map(item => item.id));
      } else {
        debug('no records need to handle');
      }
    } else {
      debug('no queue need to handle, wait to run next');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error', error);
  }
  return {};
};
