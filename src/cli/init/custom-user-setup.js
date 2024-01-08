const root = require('path').resolve();
const packageJson = require(`${root}/package.json`);
const { prompt } = require('../infrastructure/prompts');
const { unlinkSync } = require('fs');
const { setPackageJsonProp } = require('../infrastructure/commons');
const { cases } = require('../infrastructure/file-system');

async function getPackageName() {
  const pkg = await prompt({
    type: 'text',
    name: 'name',
    message: 'What is your site named?',
    initial: packageJson.name,
  });

  return pkg.name;
}

async function getManifestImportAlias() {
  const result = await prompt({
    type: 'text',
    name: 'alias',
    message: 'What is your default import alias?',
    initial: '@/',
  });

  return result.alias;
}

async function getUseKiwiRootPage() {
  const isKiwiRootPage = await prompt({
    type: 'toggle',
    name: 'root',
    message: 'Enable kiwi to manage your index page (/)?',
    hint: 'danger: it will remove your root page component',
    initial: 'Yes',
    active: 'Yes',
    inactive: 'No',
  });

  return isKiwiRootPage.root;
}

async function getSectionCase() {
  const sectionCase = await prompt({
    type: 'select',
    name: 'type',
    message: 'What case you will use to name your sections?',
    choices: Object.keys(cases).map((type) => ({
      title: `${type} (${cases[type]})`,
      value: type,
    })),
  });

  const selectedCase = sectionCase.type.toLowerCase();
  return selectedCase;
}

async function customUserSetup() {
  const setup = {
    name: packageJson.name,
    useRootPage: false,
    sectionFileCase: 'kebab',
    manifestImportAlias: '@/',
  };

  const name = await getPackageName();
  if (name !== packageJson.name) {
    await setPackageJsonProp('name', name);
    setup.name = name;
    console.log(`✔  Site name changed to ${name}`);
  }

  const useKiwiRootPage = await getUseKiwiRootPage();
  setup.useRootPage = useKiwiRootPage;

  const sectionCase = await getSectionCase();
  setup.sectionFileCase = sectionCase;

  const manifestImportAlias = await getManifestImportAlias();
  setup.manifestImportAlias = manifestImportAlias;

  if (useKiwiRootPage) {
    const indexPagePath = `${root}/src/app/page.tsx`;

    try {
      unlinkSync(indexPagePath);
      console.log('✔  Kiwi is on your index page');
    } catch (e) {
      console.log('-  It wasn`t possible to remove your index page component');
    }
  }

  return setup;
}

module.exports = customUserSetup;
