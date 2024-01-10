const root = require('path').resolve();
const { existsSync } = require('fs');
const { put, load } = require('../infrastructure/file-system');
const { prettyFileContent } = require('../infrastructure/commons');

function loadTsConfig(tsConfigPath) {
  if (existsSync(tsConfigPath)) {
    try {
      const tsConfig = load(tsConfigPath);
      return tsConfig;
    } catch (e) {
      throw new Error('It was not possible to open the tsconfig.json file.');
    }
  }

  const tsConfig = {};

  return tsConfig;
}

async function updateTsConfig() {
  const tsConfigPath = `${root}/tsconfig.json`;
  const tsConfig = loadTsConfig(tsConfigPath);

  const compilerOptions = tsConfig.compilerOptions || { paths: {} };
  const updatedTsConfig = {
    ...tsConfig,
    compilerOptions: {
      ...compilerOptions,
      paths: {
        ...compilerOptions.paths,
        '@kiwi-options': ['./src/app/(kiwi)/options.ts'],
        '@manifest': ['./manifest.ts'],
      },
    },
  };

  const formattedTsConfig = await prettyFileContent(JSON.stringify(updatedTsConfig), 'json');
  put(formattedTsConfig, tsConfigPath);
}

module.exports = updateTsConfig;
