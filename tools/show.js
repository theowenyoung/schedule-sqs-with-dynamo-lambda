const { showTables } = require('./db/create-tables');
const init = async () => {
  try {
    const tables = await showTables();
    tables.forEach(item => {
      console.log(JSON.stringify(item, null, 2));
    });
    // eslint-disable-next-line no-console
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('show table error', error);
  }
};

init();
