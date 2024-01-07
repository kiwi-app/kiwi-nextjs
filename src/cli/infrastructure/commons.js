const root = require('path').resolve();
const { put } = require('./file-system');
const prettier = require('prettier');
const packageJson = require(`${root}/package.json`);

const userKiwiConfig = packageJson.kiwiConfig || {};
const kiwiConfig = {
  moduleFileNameCase: 'kebab',
  ...userKiwiConfig,
};

async function prettyFileContent(content, parser = 'babel-ts') {
  const formattedOutput = await prettier.format(content, { parser });
  return formattedOutput;
}

async function prettyProtectedFileContent(content, directive = '') {
  const template = `${directive}

        // DO NOT EDIT. This file is generated by Kiwi.
        // This file SHOULD be checked into source version control.

        ${content}
    `;
  const formattedOutput = prettyFileContent(template);
  return formattedOutput;
}

function getKiwiConfig(key) {
  if (!Object.hasOwn(kiwiConfig, key)) return null;

  const value = kiwiConfig[key];
  return value;
}

async function setPackageJsonProp(prop, value) {
  const newPackageJson = {
    ...packageJson,
    [prop]: value,
  };

  const formattedContent = await prettyFileContent(JSON.stringify(newPackageJson), 'json');

  await put(formattedContent, `${root}/package.json`);
}

function deployStructure(structure) {
  for (const struct of structure) {
    const path = struct.path;
    const files = Object.keys(struct.files);

    for (const file of files) {
      const content = struct.files[file];
      put(content, `${path}/${file}`);
    }
  }
}

module.exports = {
  prettyFileContent,
  prettyProtectedFileContent,
  getKiwiConfig,
  setPackageJsonProp,
  deployStructure,
};
