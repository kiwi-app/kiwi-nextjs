const { prompt } = require('../infrastructure/prompts');
const { getKiwiConfig } = require('../infrastructure/commons');
const getSectionSetup = require('./setup');

jest.mock('../infrastructure/prompts');
jest.mock('../infrastructure/commons');

describe('getSectionSetup()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return a setup for simple component', async () => {
    prompt.mockImplementation((config) => {
      if (config.name === 'name') {
        return new Promise((resolve) => resolve({ name: 'Main header' }));
      }
      if (config.name === 'type') {
        return new Promise((resolve) => resolve({ type: 'Simple' }));
      }
    });

    getKiwiConfig.mockReturnValue('kebab');

    const setup = await getSectionSetup();

    expect(setup.name).toBe('main header');
    expect(setup.type).toBe('simple');
    expect(setup.file).toBe('main-header.tsx');
    expect(setup.module).toBe('MainHeader');
  });

  test('should return a setup for loader component', async () => {
    prompt.mockImplementation((config) => {
      if (config.name === 'name') {
        return new Promise((resolve) => resolve({ name: 'Products ShowCase' }));
      }
      if (config.name === 'type') {
        return new Promise((resolve) => resolve({ type: 'Loader' }));
      }
    });

    getKiwiConfig.mockReturnValue('camel');

    const setup = await getSectionSetup();

    expect(setup.name).toBe('products showcase');
    expect(setup.type).toBe('loader');
    expect(setup.file).toBe('productsShowcase.tsx');
    expect(setup.module).toBe('ProductsShowcase');
  });
});
