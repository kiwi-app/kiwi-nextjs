const root = require('path').resolve();
const { setPackageJsonProp, prettyFileContent, deployStructure } = require('./commons');
const fs = require('./file-system');
const packageJson = require('../../../package.json');

jest.mock('./file-system', () => ({
  put: jest.fn(),
}));

describe('setPackageJsonProp()', () => {
  beforeAll(() => {
    jest.resetAllMocks();
  });

  test('should add a key -> value on package.json', async () => {
    const testProp = {
      attr: 'value',
    };
    const expectedPackageJson = await prettyFileContent(
      JSON.stringify({
        ...packageJson,
        testProp,
      }),
      'json',
    );

    await setPackageJsonProp('testProp', testProp);
    expect(fs.put).toHaveBeenCalledWith(expectedPackageJson, `${root}/package.json`);
  });

  test('should update a key value on package.json', async () => {
    const site = 'new-value';
    const expectedPackageJson = await prettyFileContent(
      JSON.stringify({
        ...packageJson,
        site,
      }),
      'json',
    );

    await setPackageJsonProp('site', site);
    expect(fs.put).toHaveBeenCalledWith(expectedPackageJson, `${root}/package.json`);
  });
});

describe('deployStructure()', () => {
  beforeAll(() => {
    jest.resetAllMocks();
  });

  test('should deploy a structure wihtou errors', () => {
    const structure = {
      path: 'path-to-deploy',
      files: {
        'index.js': `this is the index.js content`,
      },
    };
    const deployStructureList = [structure];

    deployStructure(deployStructureList);

    expect(fs.put).toHaveBeenCalledTimes(1);
    expect(fs.put).toHaveBeenCalledWith(structure.files['index.js'], structure.path + '/index.js');
  });
});
