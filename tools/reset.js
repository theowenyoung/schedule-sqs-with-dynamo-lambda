const { removeTables } = require('./db/remove-tables');

const init = () => {
  // !NOTE this will delete all table, be careful
  removeTables();
};

init();
