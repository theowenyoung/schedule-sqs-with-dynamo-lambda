const Schedule = require('../../src/schedule.model');
const db = require('../../src/connection');
let dynamodb = db.aws.ddb();
const createTable = function (tableCreatedPayload) {
  return new Promise((resolve, reject) => {
    dynamodb.createTable(tableCreatedPayload, (err, data) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
};
const createTables = async () => {
  const createTablePayloadPromises = [Schedule.table.create.request()];
  const tableCreatePayloads = await Promise.all(createTablePayloadPromises);
  // eslint-disable-next-line no-console
  console.log('tableCreatePayloads', JSON.stringify(tableCreatePayloads, null, 2));

  // createTable
  const createTablePromises = tableCreatePayloads.map(item => createTable(item));
  const tableCreatedResult = await Promise.all(createTablePromises);
  // eslint-disable-next-line no-console
  console.log('tableCreatedResult', tableCreatedResult);
};

exports.createTables = createTables;
exports.showTables = async function () {
  const createTablePayloadPromises = [Schedule.table.create.request()];
  const tableCreatePayloads = await Promise.all(createTablePayloadPromises);
  return tableCreatePayloads;
};
