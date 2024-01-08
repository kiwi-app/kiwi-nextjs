const { prompt } = require('../infrastructure/prompts');
const { anyCaseToAnyCase } = require('../infrastructure/file-system');
const {
    getKiwiConfig,
} = require('../infrastructure/commons');

async function getSectionName() {
    const section = await prompt({
        type: 'text',
        name: 'name',
        hing: `words MUST be separated by space`,
        message: 'What is your section name?',
    });

    const sectionName = section.name.toLowerCase();
    return sectionName;
}

async function getSectionType(sectionName) {
    const section = await prompt({
        type: 'toggle',
        name: 'type',
        message: `What kind of section ${sectionName} will be?`,
        initial: 'Simple',
        active: 'Simple',
        inactive: 'Loader',
    });

    const type = section.type.toLowerCase();
    return type;
}

async function getSectionSetup() {
    const moduleFileNameCase = getKiwiConfig('moduleFileNameCase');
    const name = await getSectionName();
    if (!name) { // TODO - improve this validation
        throw new Error('the name $(name) isn`t a valid');
    }

    const type = await getSectionType(name);
    const formatedName = name.split(' ').join('-');
    const file = anyCaseToAnyCase('kebab', moduleFileNameCase, formatedName) + '.tsx';
    const module = anyCaseToAnyCase('kebab', 'title', formatedName);

    const section = { name, type, file, module };

    return section;
}

module.exports = getSectionSetup;
