const root = require('path').resolve();
const { deployStructure } = require('../infrastructure/commons');
const templates = require('./templates');

function getTempleateByType(type) {
  if (type === 'loader') {
    return templates.loaderSection;
  }

  return templates.simpleSection;
}

async function getSectionDeployStructure(setup) {
  const structure = {
    path: `${root}/src/sections`,
    files: {
      [setup.file]: await getTempleateByType(setup.type)(setup),
    },
  };

  return structure;
}

async function deploySection(setup) {
  const structure = await getSectionDeployStructure(setup);
  deployStructure([structure]);
}

module.exports = deploySection;
