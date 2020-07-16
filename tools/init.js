const { createTables } = require('./db/create-tables');
const init = async () => {
  try {
    await createTables();
    // eslint-disable-next-line no-console
    console.log('create tables success');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('create table error', error);
  }
};

init();
