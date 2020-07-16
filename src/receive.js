const Schedule = require('./schedule.model');
const Joi = require('@hapi/joi');
const { nanoid } = require('nanoid');
const debug = require('debug')('schedule-sqs');
const { sendMessageBatch } = require('./sqs');
const { maxDelayTimeSeconds } = require('./constans');
const { recordToQueueMessage } = require('./util');
exports.handler = async (event, context) => {
  // receive sqs message
  // write to dynamo
  debug('event: %s', JSON.stringify(event, null, 2));
  debug('context %s', JSON.stringify(context, null, 2));
  // valid
  if (event.Records && event.Records.length > 0) {
    // valid
    const validQueues = event.Records.map(item => {
      try {
        const body = JSON.parse(item.body);
        return body;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('parse body error', error);
        return null;
      }
    }).filter(item => {
      if (item) {
        const schema = Joi.object({
          queue_url: Joi.string().required(),
          triggered_at: Joi.number().required(),
          payload: Joi.object()
        });
        const { error } = schema.validate(item);
        if (!error) {
          // check trigger at time is 15minutes
          return true;
        } else {
          // eslint-disable-next-line no-console
          console.error('body params invalid', error);
          return false;
        }
      } else {
        return false;
      }
    });
    // group
    const queueMap = {};
    const dbRecords = [];
    // add to dynamodb
    validQueues.forEach(value => {
      const record = {
        queueUrl: value.queue_url,
        payload: value.payload ? value.payload : {},
        triggeredAt: value.triggered_at,
        id: nanoid()
      };
      let dueToTime = record.triggeredAt - Date.now();
      if (dueToTime > 0) {
        // do nothing
      } else {
        dueToTime = 0;
      }
      debug('dueToTime %s', dueToTime);
      if (dueToTime < maxDelayTimeSeconds) {
        // direct push to consumer queue
        if (queueMap[record.queueUrl]) {
          queueMap[record.queueUrl].push(record);
        } else {
          queueMap[record.queueUrl] = [record];
        }
      } else {
        dbRecords.push(record);
      }
    });
    const keys = Object.keys(queueMap);
    // send
    const sendPromises = keys.map(key => {
      const records = queueMap[key];
      debug('records: %o', records);
      return sendMessageBatch({
        QueueUrl: key,
        Entries: records.map(recordToQueueMessage)
      });
    });
    let promises = sendPromises;
    if (dbRecords.length > 0) {
      debug('dbRecords: %o', dbRecords);
      promises = promises.concat(Schedule.batchPut(dbRecords));
    }
    if (promises.length > 0) {
      return Promise.all(promises);
    } else {
      return {};
    }
  } else {
    return {};
  }
};
