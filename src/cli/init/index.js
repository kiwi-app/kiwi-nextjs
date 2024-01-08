const { createConfigFile } = require('../infrastructure/config-file');
const manifest = require('../manifest');
const customUserSetup = require('./custom-user-setup');
const { createKiwiDirectory, createKiwiStructure } = require('./file-structure');
const updateTsConfig = require('./update-ts-config');

async function init(args) {
  const setup = await customUserSetup();

  await createConfigFile(setup);
  console.log('✔  Config file');

  await manifest();

  await updateTsConfig();
  console.log('✔  Manifest alias');

  await createKiwiDirectory(setup);
  console.log('✔  Kiwi directories');

  await createKiwiStructure(setup);
  console.log('✔  Kiwi structure');
}

module.exports = init;
