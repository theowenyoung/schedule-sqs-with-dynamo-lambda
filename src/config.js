'use strict';
const env = process.env.NODE_ENV || 'development';
const configs = {
  base: {
    env,
    awsRegion: process.env.AWS_REGION || 'us-west-1',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
    dynamoEndPoint: process.env.DYNAMO_ENDPOINT || 'http://localhost:8000',
    tablePrefix: 'schedule_',
    receiveQueueName: process.env.RECEIVE_QUEUE_NAME || 'schedule_receive_queue'
  },
  production: {
    awsAccessKeyId: '',
    awsSecretAccessKey: '',
    dynamoEndPoint: ''
  },
  development: {},
  test: {}
};
const config = Object.assign(configs.base, configs[env]);

module.exports = config;
