const root = require('path').resolve();
const { deployStructure } = require('../infrastructure/commons');
const templates = require('./templates');
const deploySection = require('./deploy');

jest.mock('../infrastructure/commons');

describe('deploySection()', () => {
    test('should deploy the section correctly when it`s a simple section', async () => {
        const setup = {
            name: 'main header',
            type: 'simple',
            file: 'main-header.tsx',
            module: 'MainHeader',
        };

        const expectedStructure = [{
            path: `${root}/src/sections`,
            files: {
                'main-header.tsx': await templates.simpleSection(setup)
            }
        }];

        await deploySection(setup);

        expect(deployStructure).toHaveBeenCalledWith(expectedStructure);
    });

    test('should deploy the section correctly when it`s a loader section', () => {
        const setup = {
            name: 'product list',
            type: 'loader',
            file: 'product-list.tsx',
            module: 'ProductList',
        };

        const expectedStructure = [{
            path: `${root}/src/sections`,
            files: {
                'product-list.tsx': templates.loaderSection(setup)
            }
        }];

        deploySection(setup);

        expect(deployStructure).toHaveBeenCalledWith(expectedStructure);
    });
});
