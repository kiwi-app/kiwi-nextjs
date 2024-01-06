const root = require('path').resolve();
const updateTsConfig = require('./update-ts-config');
const { existsSync } = require('fs');
const { put, load } = require('../infrastructure/file-system');

jest.mock('fs');
jest.mock('../infrastructure/file-system');
jest.mock('../infrastructure/commons', () => ({
  prettyFileContent: (content) => new Promise((resolve) => resolve(content)),
}));

describe('updateTsConfig()', () => {
  test('should add the path for the modules on the tsconfig', async () => {
    existsSync.mockReturnValue(true);
    load.mockReturnValue({
      compilerOptions: {
        paths: {
          '@test': ['./test.ts'],
        },
      },
    });

    expectedNewTsConfig = {
      compilerOptions: {
        paths: {
          '@test': ['./test.ts'],
          '@manifest': ['./manifest.ts'],
        },
      },
    };

    await updateTsConfig();

    expect(load).toHaveBeenCalled();
    expect(put).toHaveBeenCalledWith(JSON.stringify(expectedNewTsConfig), `${root}/tsconfig.json`);
  });

  test('should create a default tsconfig case the file does`t exist', async () => {
    existsSync.mockReturnValue(false);

    expectedNewTsConfig = {
      compilerOptions: {
        paths: {
          '@manifest': ['./manifest.ts'],
        },
      },
    };

    await updateTsConfig();

    expect(load).toHaveBeenCalled();
    expect(put).toHaveBeenCalledWith(JSON.stringify(expectedNewTsConfig), `${root}/tsconfig.json`);
  });

  test('should throw an exception case isn`t possible to open the tsconfig file', async () => {
    existsSync.mockReturnValue(true);
    load.mockImplementation(() => {
      throw new Error('load mock implementation error');
    });

    await expect(updateTsConfig()).rejects.toThrow();
  });
});
