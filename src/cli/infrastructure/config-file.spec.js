const { load } = require('./file-system');
const { getConfigFile, defaultConfigFile } = require('./config-file');

jest.mock('../infrastructure/file-system');

describe('config file', () => {
  test('should return the default config file if kiwi.config.js is not created', async () => {
    load.mockImplementation(() => {
      throw new Error('load mock implementation error');
    });

    const configFile = getConfigFile();

    expect(configFile.manifestImportAlias).toBe(defaultConfigFile.manifestImportAlias);
    expect(configFile.sectionFileCase).toBe(defaultConfigFile.sectionFileCase);
    expect(configFile.useRootPage).toBe(defaultConfigFile.useRootPage);
  });

  test('should return the existing config in kiwi.config.js', async () => {
    load.mockImplementation(() => ({
      manifestImportAlias: '@custom-alias',
      sectionFileCase: 'snake',
      useRootPage: false,
    }));

    const configFile = getConfigFile();

    expect(configFile.manifestImportAlias).toBe('@custom-alias');
    expect(configFile.sectionFileCase).toBe('snake');
    expect(configFile.useRootPage).toBe(false);
  });
});
