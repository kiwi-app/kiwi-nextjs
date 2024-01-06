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

function createKiwiDirectory() {
  mkdirSync(SERVER_COMPONENT_PATH, { recursive: true });
  mkdirSync(API_PATH, { recursive: true });
};

function createApiStructure() {
  const structure = {
    path: API_PATH,
    files: {
      'route.ts': templates.routeTemplate,
    }
  };

  return structure;
}

function createPageStructure() {
  const structure = {
    path: SERVER_COMPONENT_PATH,
    files: {
      'page.tsx': templates.pageTemplate,
      'client.tsx': templates.clientCodeTemplate,
      'server.tsx': templates.serverCodeTemplate,
    }
  };

  return structure;
}

function createKiwiStructure() {
  const apiStructure = createApiStructure();
  const pageStructure = createPageStructure();

  const kiwiStructureTemplate = [
    apiStructure,
    pageStructure,
  ];

  deployStructure(kiwiStructureTemplate);
}

async function init(args) {
  await customUserSetup();

  await manifest();
  console.log('✔️ Manifest Assembled');

  updateTsConfig();
  console.log('✔️ Manifest alias');

  createKiwiDirectory();
  console.log('✔️ Kiwi directories');

  createKiwiStructure();
  console.log('✔️ Kiwi structure');
}

module.exports = init;
