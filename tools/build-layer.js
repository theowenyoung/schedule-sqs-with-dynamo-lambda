const fs = require('fs-extra');
const path = require('path');

async function init() {
  await fs.remove(path.resolve(__dirname, '../layer/nodejs'));
  await fs.copy(
    path.resolve(__dirname, '../package.json'),
    path.resolve(__dirname, '../layer/nodejs/package.json')
  );
}

init().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
});
