const dynamoose = require('dynamoose');
const config = require('./config');

const dbConfig = {
  region: config.awsRegion
};
if (config.dynamoEndPoint) {
  dbConfig.endpoint = config.dynamoEndPoint;
}
if (config.awsAccessKeyId) {
  dbConfig.accessKeyId = config.awsAccessKeyId;
}
if (config.awsSecretAccessKey) {
  dbConfig.secretAccessKey = config.awsSecretAccessKey;
}

// Create new DynamoDB instance
const ddb = new dynamoose.aws.sdk.DynamoDB(dbConfig);

// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set(ddb);

const createTables = async tableCreatedPayload => {
  // eslint-disable-next-line no-console
  return new Promise((resolve, reject) => {
    ddb.createTable(tableCreatedPayload, (err, data) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
};
dynamoose.createTables = createTables;
module.exports = dynamoose;
