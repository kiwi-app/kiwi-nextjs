const appRoot = require('path').resolve('./src/app/');
const { mkdirSync } = require('fs');
const {
  deployStructure,
} = require('../infrastructure/commons');
const templates = require('./templates');

const manifest = require('../manifest');
const customUserSetup = require('./custom-user-setup');
const updateTsConfig = require('./update-ts-config');

const SERVER_COMPONENT_PATH = `${appRoot}/(kiwi)/[...kiwi]`;
const API_PATH = `${appRoot}/(kiwi)/api/kiwi/[...kiwi]`;

async function createKiwiDirectory() {
  mkdirSync(SERVER_COMPONENT_PATH, { recursive: true });
  mkdirSync(API_PATH, { recursive: true });
};

async function createApiStructure() {
  const structure = {
    path: API_PATH,
    files: {
      'route.ts': await templates.routeTemplate,
    }
  };

  return structure;
}

async function createPageStructure() {
  const structure = {
    path: SERVER_COMPONENT_PATH,
    files: {
      'page.tsx': await templates.pageTemplate,
      'client.tsx': await templates.clientCodeTemplate,
      'server.tsx': await templates.serverCodeTemplate,
    }
  };

  return structure;
}

async function createKiwiStructure() {
  const apiStructure = await createApiStructure();
  const pageStructure = await createPageStructure();

  const kiwiStructureTemplate = [
    apiStructure,
    pageStructure,
  ];

  deployStructure(kiwiStructureTemplate);
}

async function init(args) {
  await customUserSetup();

  await manifest();

  await updateTsConfig();
  console.log('✔️  Manifest alias');

  await createKiwiDirectory();
  console.log('✔️  Kiwi directories');

  await createKiwiStructure();
  console.log('✔️  Kiwi structure');
}

module.exports = init;
