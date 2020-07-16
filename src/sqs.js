const AWS = require('aws-sdk');
const config = require('./config');
AWS.config.update({ region: config.awsRegion });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const sendMessage = (params = {}) => {
  return new Promise((resolve, reject) => {
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
const sendMessageBatch = (params = {}) => {
  return new Promise((resolve, reject) => {
    sqs.sendMessageBatch(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
exports.sendMessage = sendMessage;
exports.sendMessageBatch = sendMessageBatch;
exports.sqs = sqs;
