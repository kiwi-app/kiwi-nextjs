const root = require('path').resolve('./src/app/');
const { writeFileSync, mkdirSync } = require('fs');
const manifest = require('../manifest');
const {
  prettyFileContent,
  prettyProtectedFileContent
} = require('../infrastructure/commons');
const templates = require('./templates');

const SERVER_COMPONENT_PATH = `${root}/(kiwi)/[...kiwi]`;
const API_PATH = `${root}/(kiwi)/api/kiwi/[...kiwi]`;

function deployStructure(structure) {
  structure.map(struct => {
    const path = struct.path
    const files = Object.keys(struct.files);

    files.map(file => {
      const prettyContent = prettyProtectedFileContent(struct[file]);
      writeFileSync(`${path}/${file}`, prettyContent);
    });
  });
}

const createKiwiDirectory = () => {
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

const updateTsConfig = () => {
  let newTsConfig;
  const tsConfigRoot = path.resolve();

  try {
    const configFile = require(`${tsConfigRoot}/tsconfig.json`);

    if (configFile.compilerOptions) {
      configFile.compilerOptions.paths = {
        ...configFile.compilerOptions.paths,
        '@manifest': ['./manifest.ts'],
      };
    } else {
      configFile['compilerOptions'] = {
        paths: {
          '@manifest': ['./manifest.ts'],
        },
      };
    }

    newTsConfig = { ...configFile };
  } catch (_) {
    newTsConfig = {
      compilerOptions: {
        paths: {
          '@manifest': ['./manifest.ts'],
        },
      },
    };
  }

  const formattedTsConfig = prettyFileContent(newTsConfig);
  writeFileSync(`${tsConfigRoot}/tsconfig.json`, JSON.stringify(formattedTsConfig), {
    encoding: 'utf-8',
  });
};

function init(args) {
  manifest();
  console.log('✔️ Manifest Assembled');

  updateTsConfig();
  console.log('✔️ Manifest alias');

  createKiwiDirectory();
  console.log('✔️ Kiwi directories');

  createKiwiStructure();
  console.log('✔️ Kiwi structure');
}

module.exports = init;
