const customUserSetup = require('./custom-user-setup');
const { existsSync, unlinkSync } = require('fs');
const { prompt } = require('../infrastructure/prompts');
const { setPackageJsonProp } = require('../infrastructure/commons');
const { defaultConfigFile } = require('../infrastructure/config-file');

jest.mock('fs');
jest.mock('../infrastructure/prompts');
jest.mock('../infrastructure/commons', () => ({
  setPackageJsonProp: jest.fn(),
}));
jest.mock('../../../package.json', () => ({
  name: 'mock-package',
}));

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('customUserSetup()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return the chosen setup', async () => {
    existsSync.mockReturnValue(true);
    prompt.mockImplementation((config) => {
      if (config.name === 'name') {
        return Promise.resolve({ name: 'my-website' });
      }

      if (config.name === 'root') {
        return Promise.resolve({ root: true });
      }

      if (config.name === 'alias') {
        return Promise.resolve({ alias: defaultConfigFile.manifestImportAlias });
      }

      if (config.name === 'type') {
        return Promise.resolve({ type: defaultConfigFile.sectionFileCase });
      }
    });

    const chosenSetup = await customUserSetup();

    expect(chosenSetup.name).toBe('my-website');
    expect(chosenSetup.useRootPage).toBe(true);
  });

  test('should setup the project with all features on', async () => {
    existsSync.mockReturnValue(true);
    prompt.mockImplementation((config) => {
      if (config.name === 'name') {
        return Promise.resolve({ name: 'my-website' });
      }

      if (config.name === 'root') {
        return Promise.resolve({ root: true });
      }

      if (config.name === 'alias') {
        return Promise.resolve({ alias: defaultConfigFile.manifestImportAlias });
      }

      if (config.name === 'type') {
        return Promise.resolve({ type: defaultConfigFile.sectionFileCase });
      }
    });

    await customUserSetup();

    expect(prompt).toHaveBeenCalledTimes(4);
    expect(setPackageJsonProp).toHaveBeenCalledWith('name', 'my-website');
    expect(unlinkSync).toHaveBeenCalled();
  });

  test('should setup the project changing the package name and not acepting kiwi as index page', async () => {
    existsSync.mockReturnValue(true);
    prompt.mockImplementation((config) => {
      if (config.name === 'name') {
        return Promise.resolve({ name: 'my-website' });
      }

      if (config.name === 'root') {
        return Promise.resolve({ root: false });
      }

      if (config.name === 'alias') {
        return Promise.resolve({ alias: defaultConfigFile.manifestImportAlias });
      }

      if (config.name === 'type') {
        return Promise.resolve({ type: defaultConfigFile.sectionFileCase });
      }
    });

    await customUserSetup();

    expect(prompt).toHaveBeenCalledTimes(4);
    expect(setPackageJsonProp).toHaveBeenCalledWith('name', 'my-website');
    expect(unlinkSync).not.toHaveBeenCalled();
  });

  test('should setup the project keeping the package name and acepting kiwi as index page', async () => {
    existsSync.mockReturnValue(true);
    prompt.mockImplementation((config) => {
      if (config.name === 'name') {
        return Promise.resolve({ name: 'mock-package' });
      }
      if (config.name === 'root') {
        return Promise.resolve({ root: true });
      }

      if (config.name === 'alias') {
        return Promise.resolve({ alias: defaultConfigFile.manifestImportAlias });
      }

      if (config.name === 'type') {
        return Promise.resolve({ type: defaultConfigFile.sectionFileCase });
      }
    });

    await customUserSetup();

    expect(prompt).toHaveBeenCalledTimes(4);
    expect(setPackageJsonProp).not.toHaveBeenCalled();
    expect(unlinkSync).toHaveBeenCalled();
  });

  test('should have all modifications denied by the user', async () => {
    existsSync.mockReturnValue(true);
    prompt.mockImplementation((config) => {
      if (config.name === 'name') {
        return Promise.resolve({ name: 'mock-package' });
      }
      if (config.name === 'root') {
        return Promise.resolve({ root: false });
      }

      if (config.name === 'alias') {
        return Promise.resolve({ alias: defaultConfigFile.manifestImportAlias });
      }

      if (config.name === 'type') {
        return Promise.resolve({ type: defaultConfigFile.sectionFileCase });
      }
    });

    await customUserSetup();

    expect(prompt).toHaveBeenCalledTimes(4);
    expect(setPackageJsonProp).not.toHaveBeenCalled();
    expect(unlinkSync).not.toHaveBeenCalled();
  });

  test('should not throw an error while trying to remove the root page ', async () => {
    existsSync.mockReturnValue(true);
    unlinkSync.mockImplementation(() => {
      throw Error;
    });
    const log = jest.spyOn(console, 'log');
    prompt.mockImplementation((config) => {
      if (config.name === 'name') {
        return Promise.resolve({ name: 'my-website' });
      }
      if (config.name === 'root') {
        return Promise.resolve({ root: true });
      }

      if (config.name === 'alias') {
        return Promise.resolve({ alias: defaultConfigFile.manifestImportAlias });
      }

      if (config.name === 'type') {
        return Promise.resolve({ type: defaultConfigFile.sectionFileCase });
      }
    });

    await customUserSetup();

    expect(prompt).toHaveBeenCalledTimes(4);
    expect(setPackageJsonProp).toHaveBeenCalled();
    expect(unlinkSync).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith('-  It wasn`t possible to remove your index page component');
  });
});
