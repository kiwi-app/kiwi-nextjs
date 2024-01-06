const customUserSetup = require('./custom-user-setup');
const { existsSync, unlinkSync } = require('fs');
const { prompt } = require('../infrastructure/prompts');
const { setPackageJsonProp } = require('../infrastructure/commons');

jest.mock('fs');
jest.mock('../infrastructure/prompts');
jest.mock('../infrastructure/commons', () => ({
    setPackageJsonProp: jest.fn(),
}));
jest.mock('../../../package.json', () => ({
    name: 'mock-package'
}));

jest.spyOn(console, 'log').mockImplementation(() => { });

describe('customUserSetup()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should setup the project with all features on', async () => {
        existsSync.mockReturnValue(true);
        prompt.mockImplementation((config) => {
            if (config.name === 'name') {
                return new Promise((resolve) => resolve({ name: 'my-website' }))
            }
            if (config.name === 'root') {
                return new Promise((resolve) => resolve({ root: true }))
            }
        });

        await customUserSetup();

        expect(prompt).toHaveBeenCalledTimes(2);
        expect(setPackageJsonProp).toHaveBeenCalledWith('name', 'my-website');
        expect(unlinkSync).toHaveBeenCalled();
    });

    test('should setup the project changing the package name and not acepting kiwi as index page', async () => {
        existsSync.mockReturnValue(true);
        prompt.mockImplementation((config) => {
            if (config.name === 'name') {
                return new Promise((resolve) => resolve({ name: 'my-website' }))
            }
            if (config.name === 'root') {
                return new Promise((resolve) => resolve({ root: false }))
            }
        });

        await customUserSetup();

        expect(prompt).toHaveBeenCalledTimes(2);
        expect(setPackageJsonProp).toHaveBeenCalledWith('name', 'my-website');
        expect(unlinkSync).not.toHaveBeenCalled();
    });

    test('should setup the project keeping the package name and acepting kiwi as index page', async () => {
        existsSync.mockReturnValue(true);
        prompt.mockImplementation((config) => {
            if (config.name === 'name') {
                return new Promise((resolve) => resolve({ name: 'mock-package' }))
            }
            if (config.name === 'root') {
                return new Promise((resolve) => resolve({ root: true }))
            }
        });

        await customUserSetup();

        expect(prompt).toHaveBeenCalledTimes(2);
        expect(setPackageJsonProp).not.toHaveBeenCalled();
        expect(unlinkSync).toHaveBeenCalled();
    });

    test('should have all modifications denied by the user', async () => {
        existsSync.mockReturnValue(true);
        prompt.mockImplementation((config) => {
            if (config.name === 'name') {
                return new Promise((resolve) => resolve({ name: 'mock-package' }))
            }
            if (config.name === 'root') {
                return new Promise((resolve) => resolve({ root: false }))
            }
        });

        await customUserSetup();

        expect(prompt).toHaveBeenCalledTimes(2);
        expect(setPackageJsonProp).not.toHaveBeenCalled();
        expect(unlinkSync).not.toHaveBeenCalled();
    });

    test('should not throw an error while trying to remove the root page ', async () => {
        existsSync.mockReturnValue(true);
        unlinkSync.mockImplementation(() => { throw Error; })
        const log = jest.spyOn(console, 'log');
        prompt.mockImplementation((config) => {
            if (config.name === 'name') {
                return new Promise((resolve) => resolve({ name: 'my-website' }))
            }
            if (config.name === 'root') {
                return new Promise((resolve) => resolve({ root: true }))
            }
        });

        await customUserSetup();

        expect(prompt).toHaveBeenCalledTimes(2);
        expect(setPackageJsonProp).toHaveBeenCalled();
        expect(unlinkSync).toHaveBeenCalled();
        expect(log).toHaveBeenCalledWith('✖️ It wasn`t possible to remove your index page component');
    });

    test('should not prompt for kiwi index if index page file doesnt exist', async () => {
        existsSync.mockReturnValue(false);
        unlinkSync.mockImplementation(() => { throw Error; })
        const log = jest.spyOn(console, 'log');
        prompt.mockImplementation((config) => {
            if (config.name === 'name') {
                return new Promise((resolve) => resolve({ name: 'my-website' }))
            }
        });

        await customUserSetup();

        expect(prompt).toHaveBeenCalledTimes(1);
        expect(setPackageJsonProp).toHaveBeenCalled();
        expect(unlinkSync).not.toHaveBeenCalled();
    });
});
