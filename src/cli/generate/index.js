const getSectionSetup = require('./setup');
const deploySection = require('./deploy');
const manifest = require('../manifest');

async function generate(args) {
  const setup = await getSectionSetup();

  await deploySection(setup);
  console.log(`✔  Section ${setup.module} generated`);

  await manifest();
}

module.exports = generate;
