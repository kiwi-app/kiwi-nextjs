const root = require('path').resolve();
const packageJson = require(`${root}/package.json`);
const { prompt } = require('../infrastructure/prompts');
const { unlinkSync } = require('fs');
const { setPackageJsonProp } = require('../infrastructure/commons');

async function getPackageName() {
  const pkg = await prompt({
    type: 'text',
    name: 'name',
    message: 'What is your site named?',
    initial: packageJson.name,
  });

  return pkg.name;
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

async function customUserSetup() {
  const setup = { name: packageJson.name, useKiwiRootPage: false };

  const name = await getPackageName();
  if (name !== packageJson.name) {
    await setPackageJsonProp('name', name);
    setup.name = name;
    console.log(`✔️  Site name changed to ${name}`);
  }

  const indexPagePath = `${root}/src/app/page.tsx`;
  const useKiwiRootPage = await getUseKiwiRootPage();
  if (useKiwiRootPage) {
    setup.useKiwiRootPage = true;

    try {
      unlinkSync(indexPagePath);
      console.log('✔️  Kiwi is on your index page');
    } catch (e) {
      console.log('ℹ  It wasn`t possible to remove your index page component');
    }
  }

  return setup;
}

module.exports = customUserSetup;
