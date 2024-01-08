const root = require('path').resolve();
const { put, load } = require('../infrastructure/file-system');
const { prettyFileContent } = require('../infrastructure/commons');

const defaultConfigFile = {
  useRootPage: true,
  sectionFileCase: 'kebab',
  manifestImportAlias: '@/',
};

function getConfigFile() {
  const kiwiConfigPath = `${root}/kiwi.config.js`;

  let configFile = defaultConfigFile;
  try {
    const localConfigFile = load(kiwiConfigPath);

    if (localConfigFile) {
      configFile = {
        ...defaultConfigFile,
        ...localConfigFile,
      };
    }
  } catch (_) {
    console.log('It wasn`t possible to open the kiwi.config.js file. Using the default config.');
  }

  return configFile;
}

async function createConfigFile(setup) {
  let configFile = {};
  for (const configKey in defaultConfigFile) {
    let configValue = defaultConfigFile[configKey];

    if (configKey in setup) {
      configValue = setup[configKey];
    }

    configFile[configKey] = configValue;
  }

  const configFileContent = await prettyFileContent(`
    module.exports = ${JSON.stringify(configFile)}
  `);
  put(configFileContent, `${root}/kiwi.config.js`);
}

module.exports = {
  getConfigFile,
  createConfigFile,
  defaultConfigFile,
};
