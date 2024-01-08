const { load } = require('./file-system');
const { getConfigFile, getKiwiConfig, defaultConfigFile } = require('./config-file');

jest.mock('../infrastructure/file-system');

describe('getConfigFile()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

describe('getKiwiConfig()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    load.mockImplementation(() => defaultConfigFile);
  });

  test('should return a value for a valid config key', () => {
    expect(typeof getKiwiConfig('sectionFileCase')).toBe('string');
  });

  test('should return the default value', () => {
    expect(getKiwiConfig('sectionFileCase')).toBe('kebab');
  });

  test('should return if key is not a valid config key', () => {
    expect(getKiwiConfig('notValidKey')).toBeNull();
  });
});
