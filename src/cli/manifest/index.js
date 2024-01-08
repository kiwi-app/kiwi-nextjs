const root = require('path').resolve();
const { ls } = require('../infrastructure/file-system');
const { writeFileSync } = require('fs');
const { prettyProtectedFileContent } = require('../infrastructure/commons');
const { name: site } = require(`${root}/package.json`);
const { createPropSchema } = require('./schema');
const { getConfigFile } = require('../infrastructure/config-file');

const SECTION_PATH = `${root}/src/sections`;

function getSections(path, sections) {
  if (!sections?.length) return [];

  const { manifestImportAlias: alias } = getConfigFile();

  const services = sections.map((section) => {
    const component = {
      path: `${alias}sections/${section.split('.')[0]}`,
      key: `@/sections/${section.split('.')[0]}`,
      schema: createPropSchema(`${path}/${section}`),
    };

    return component;
  });

  return services;
}

function getSevices() {
  const sections = ls(SECTION_PATH);

  const services = {
    sections: getSections(SECTION_PATH, sections),
  };

  return services;
}

async function manifest(args) {
  const configFile = getConfigFile();
  const services = getSevices();

  const sections = services.sections
    .map(({ key, schema }, i) => `"${key}": { module: $${i}, schema: ${JSON.stringify(schema)} },`)
    .join('\n    ');

  const imports = services.sections
    .map(({ path }, i) => `import * as $${i} from '${path}';`)
    .join('\n');

  const output = `
    ${imports}

    const manifest = {
      sections: {
        ${sections}
      },
      site: "${site}"
    };

    export default manifest;`;

  const formattedOutput = await prettyProtectedFileContent(output);

  writeFileSync(`${root}/manifest.ts`, formattedOutput, { encoding: 'utf-8' });
  console.log('✔  Manifest assembled');
}

module.exports = manifest;
