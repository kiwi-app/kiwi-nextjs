const root = require('path').resolve();
const { put, load } = require('../infrastructure/file-system');
const { prettyFileContent, packageName } = require('../infrastructure/commons');

const defaultConfigFile = {
  useRootPage: true,
  sectionFileCase: 'kebab',
  manifestImportAlias: '@/',
};

function getKiwiConfig(key) {
  const kiwiConfig = getConfigFile();

  if (!Object.hasOwn(kiwiConfig, key)) return null;

  const value = kiwiConfig[key];
  return value;
}

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
  } catch (_) {}

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
    /** @type {import('${packageName}').KiwiConfig} */
    const kiwiConfig = ${JSON.stringify(configFile)}

    module.exports = kiwiConfig;
  `);
  put(configFileContent, `${root}/kiwi.config.js`);
}

module.exports = {
  getConfigFile,
  createConfigFile,
  getKiwiConfig,
  defaultConfigFile,
};
