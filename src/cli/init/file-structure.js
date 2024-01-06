const appRoot = require('path').resolve('./src/app/');

const templates = require('./templates');
const { mkdirSync } = require('fs');
const { deployStructure } = require('../infrastructure/commons');

const SERVER_COMPONENT_PATH = `${appRoot}/(kiwi)/[...kiwi]`;
const SERVER_COMPONENT_PATH_KIWI_ROOT = `${appRoot}/(kiwi)/[[...kiwi]]`;
const API_PATH = `${appRoot}/(kiwi)/api/kiwi/[...kiwi]`;

function createKiwiDirectory({ useKiwiRootPage }) {
  let serverPath = useKiwiRootPage ? SERVER_COMPONENT_PATH_KIWI_ROOT : SERVER_COMPONENT_PATH;

  mkdirSync(serverPath, { recursive: true });
  mkdirSync(API_PATH, { recursive: true });
}

async function createApiStructure() {
  const structure = {
    path: API_PATH,
    files: {
      'route.ts': await templates.routeTemplate,
    },
  };

  return structure;
}

async function createPageStructure({ useKiwiRootPage }) {
  let serverPath = useKiwiRootPage ? SERVER_COMPONENT_PATH_KIWI_ROOT : SERVER_COMPONENT_PATH;

  const structure = {
    path: serverPath,
    files: {
      'page.tsx': await templates.pageTemplate,
      'client.tsx': await templates.clientCodeTemplate,
      'server.tsx': await templates.serverCodeTemplate,
    },
  };

  return structure;
}

async function createKiwiStructure(setup) {
  const apiStructure = await createApiStructure();
  const pageStructure = await createPageStructure(setup);

  const kiwiStructureTemplate = [apiStructure, pageStructure];

  deployStructure(kiwiStructureTemplate);
}

module.exports = {
  createKiwiDirectory,
  createKiwiStructure,
};
