const appRoot = require('path').resolve('./src/app/');

const templates = require('./templates');
const { mkdirSync } = require('fs');
const { deployStructure } = require('../infrastructure/commons');

const OPTIONS_PATH = `${appRoot}/(kiwi)`;
const SERVER_COMPONENT_PATH = `${appRoot}/(kiwi)/[...kiwi]`;
const SERVER_COMPONENT_PATH_KIWI_ROOT = `${appRoot}/(kiwi)/[[...kiwi]]`;
const API_PATH = `${appRoot}/(kiwi)/api/kiwi/[...kiwi]`;

function createKiwiDirectory({ useRootPage }) {
  let serverPath = useRootPage ? SERVER_COMPONENT_PATH_KIWI_ROOT : SERVER_COMPONENT_PATH;

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

async function createPageStructure({ useRootPage }) {
  let serverPath = useRootPage ? SERVER_COMPONENT_PATH_KIWI_ROOT : SERVER_COMPONENT_PATH;

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

async function createOptionsStructure() {
  const structure = {
    path: OPTIONS_PATH,
    files: {
      'options.ts': await templates.optionsTemplate,
    },
  };

  return structure;
}

async function createKiwiStructure(setup) {
  const optionsStructure = await createOptionsStructure();
  const apiStructure = await createApiStructure();
  const pageStructure = await createPageStructure(setup);

  const kiwiStructureTemplate = [optionsStructure, apiStructure, pageStructure];

  deployStructure(kiwiStructureTemplate);
}

module.exports = {
  createKiwiDirectory,
  createKiwiStructure,
};
