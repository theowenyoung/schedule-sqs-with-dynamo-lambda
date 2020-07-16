const db = require('../../src/connection');
const config = require('../../src/config');
let dynamodb = db.aws.ddb();
const removeTables = () => {
  // !NOTE this will delete all table, be careful
  if (process.env.NODE_ENV === 'development' && config.dynamoEndPoint === 'http://localhost:8000') {
    // eslint-disable-next-line no-console
    console.log('Remove Tables start');

    dynamodb.listTables({}, (err, data) => {
      // eslint-disable-next-line no-console
      console.log('list tables', data);
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err, err.stack);
      }
      for (let tableName of data.TableNames) {
        if (tableName.indexOf(config.tablePrefix) === 0) {
          dynamodb.deleteTable({ TableName: tableName }, err1 => {
            if (err1) {
              // eslint-disable-next-line no-console
              console.error(err1, err1.stack);
            } else {
              // eslint-disable-next-line no-console
              console.log('Deleted', tableName);
            }
          });
        }
      }
    });
  } else {
    // eslint-disable-next-line no-console
    console.log('remove operator only allowed in development enviroment.');
  }
};

exports.removeTables = removeTables;
