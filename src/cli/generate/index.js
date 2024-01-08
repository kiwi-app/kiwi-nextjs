const getSectionSetup = require('./setup');
const deploySection = require('./deploy');
const manifest = require('../manifest');

async function generate(args) {
    const setup = await getSectionSetup();

    deploySection(setup);
    console.log('✔  Section ${setup.name} generated');

    await manifest();
    console.log('✔  Manifest assembled');
};

module.exports = generate;
