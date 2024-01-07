const root = require('path').resolve();
const manifest = require('./index');
const fs = require('fs');
const fileSystem = require('../infrastructure/file-system');
const tsj = require('ts-json-schema-generator');
const { prettyProtectedFileContent } = require('../infrastructure/commons');

jest.mock('fs');
jest.mock('../infrastructure/file-system');
jest.mock('ts-json-schema-generator');

const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('manifest()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should generate the manifest with a simple section', async () => {
    fileSystem.ls.mockReturnValue(['header.tsx']);
    fileSystem.fileNameFromPath.mockReturnValue('header');
    fileSystem.anycaseToTitle.mockReturnValue('Header');

    tsj.createGenerator.mockImplementationOnce(() => ({
      createSchema: () => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        definitions: {
          HeaderProps: {
            type: 'object',
            properties: { title: { type: 'string' }, lead: { type: 'string' } },
            required: ['title', 'lead'],
            additionalProperties: false,
          },
        },
      }),
    }));

    const expectedOutput = `
            import * as $0 from "@/sections/header";
            
            const manifest = {
                sections: {
                    "@/sections/header": {
                        module: $0,
                        schema: {
                            component: {
                                type: "object",
                                required: ["title", "lead"],
                                properties: [
                                    { name: "title", type: "string" },
                                    { name: "lead", type: "string" },
                                ],
                            },
                        },
                    },
                },
                site: "@kiwi-app/kiwi-nextjs",
            };
            
            export default manifest;`;

    const formattedExpectedOutput = await prettyProtectedFileContent(expectedOutput);
    await manifest();

    expect(writeFileSyncSpy).toHaveBeenCalledWith(`${root}/manifest.ts`, formattedExpectedOutput, {
      encoding: 'utf-8',
    });
  });

  test('should include the loader in the manifest', async () => {
    fileSystem.ls.mockReturnValue(['products.tsx']);
    fileSystem.fileNameFromPath.mockReturnValue('products');
    fileSystem.anycaseToTitle.mockReturnValue('Products');

    tsj.createGenerator.mockImplementationOnce(() => ({
      createSchema: () => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        definitions: {
          ProductsProps: {
            type: 'object',
            properties: {
              loader: { $ref: '#/definitions/ProductsLoader' },
              title: { type: 'string' },
              lead: { type: 'string' },
            },
            required: ['loader', 'title', 'lead'],
            additionalProperties: false,
          },
          ProductsLoaderProps: {
            type: 'object',
            properties: { category: { type: 'string' } },
            required: ['category'],
            additionalProperties: false,
          },
          'NamedParameters<typeof Loader>': {
            type: 'object',
            properties: {
              req: { $ref: '#/definitions/LoaderRequest' },
              props: { $ref: '#/definitions/ProductsLoaderProps' },
            },
            required: ['req', 'props'],
            additionalProperties: false,
          },
        },
      }),
    }));

    const expectedOutput = `
            import * as $0 from "@/sections/products";
                
            const manifest = {
                sections: {
                    "@/sections/products": {
                        module: $0,
                        schema: {
                            component: {
                                type: "object",
                                required: ["loader", "title", "lead"],
                                properties: [
                                    { name: "title", type: "string" },
                                    { name: "lead", type: "string" },
                                ],
                            },
                            loader: {
                                type: "object",
                                required: ["category"],
                                properties: [
                                    { name: "category", type: "string" }
                                ],
                            }
                        },
                    },
                },
                site: "@kiwi-app/kiwi-nextjs",
            };
            
            export default manifest;`;

    const formattedExpectedOutput = await prettyProtectedFileContent(expectedOutput);
    await manifest();

    expect(writeFileSyncSpy).toHaveBeenCalledWith(`${root}/manifest.ts`, formattedExpectedOutput, {
      encoding: 'utf-8',
    });
  });

  test('should include the generic loader in the manifest', async () => {
    fileSystem.ls.mockReturnValue(['products.tsx']);
    fileSystem.fileNameFromPath.mockReturnValue('products');
    fileSystem.anycaseToTitle.mockReturnValue('Products');

    tsj.createGenerator.mockImplementationOnce(() => ({
      createSchema: () => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        definitions: {
          ProductsProps: {
            type: 'object',
            properties: {
              loader: { $ref: '#/definitions/ProductsLoader' },
              title: { type: 'string' },
              lead: { type: 'string' },
            },
            required: ['loader', 'title', 'lead'],
            additionalProperties: false,
          },
          'NamedParameters<typeof Loader>': {
            type: 'object',
            properties: {
              req: { $ref: '#/definitions/LoaderRequest' },
            },
            required: ['req', 'props'],
            additionalProperties: false,
          },
        },
      }),
    }));

    const expectedOutput = `
            import * as $0 from "@/sections/products";
                
            const manifest = {
                sections: {
                    "@/sections/products": {
                        module: $0,
                        schema: {
                            component: {
                                type: "object",
                                required: ["loader", "title", "lead"],
                                properties: [
                                    { name: "title", type: "string" },
                                    { name: "lead", type: "string" },
                                ],
                            },
                            loader: { propsFromLoaderRequest: true }
                        },
                    },
                },
                site: "@kiwi-app/kiwi-nextjs",
            };
            
            export default manifest;`;

    const formattedExpectedOutput = await prettyProtectedFileContent(expectedOutput);
    await manifest();

    expect(writeFileSyncSpy).toHaveBeenCalledWith(`${root}/manifest.ts`, formattedExpectedOutput, {
      encoding: 'utf-8',
    });
  });

  test('should include the nested complex interface', async () => {
    fileSystem.ls.mockReturnValue(['header.tsx']);
    fileSystem.fileNameFromPath.mockReturnValue('header');
    fileSystem.anycaseToTitle.mockReturnValue('Header');

    tsj.createGenerator.mockImplementationOnce(() => ({
      createSchema: () => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        definitions: {
          Cta: {
            type: 'object',
            properties: { label: { type: 'string' }, action: { type: 'string' } },
            required: ['label', 'action'],
            additionalProperties: false,
          },
          HeaderProps: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              lead: { type: 'string' },
              c2a: { $ref: '#/definitions/Cta' },
              banner: {
                type: 'object',
                properties: {
                  image: { type: 'string' },
                },
                required: ['image'],
                additionalProperties: false,
              },
            },
            required: ['title', 'lead', 'c2a', 'banner'],
            additionalProperties: false,
          },
        },
      }),
    }));

    const expectedOutput = `
            import * as $0 from "@/sections/header";
                
            const manifest = {
                sections: {
                    "@/sections/header": {
                        module: $0,
                        schema: {
                            component: {
                                type: "object",
                                required: ["title", "lead", "c2a", "banner"],
                                properties: [
                                    { name: "title", type: "string" },
                                    { name: "lead", type: "string" },
                                    {
                                        type: "object",
                                        required: ["label", "action"],
                                        properties: [
                                            { name: "label", type: "string" },
                                            { name: "action", type: "string" },
                                        ],
                                        name: "c2a",
                                    },
                                    {
                                        type: "object",
                                        required: ["image"],
                                        properties: [{ name: "image", type: "string" }],
                                        name: "banner",
                                    },
                                ],
                            },
                        },
                    },
                },
                site: "@kiwi-app/kiwi-nextjs",
            };
            
            export default manifest;`;

    const formattedExpectedOutput = await prettyProtectedFileContent(expectedOutput);
    await manifest();

    expect(writeFileSyncSpy).toHaveBeenCalledWith(`${root}/manifest.ts`, formattedExpectedOutput, {
      encoding: 'utf-8',
    });
  });

  test('should generate the manifest with multiple sections', async () => {
    fileSystem.ls.mockReturnValue(['header.tsx', 'content.tsx']);
    fileSystem.fileNameFromPath.mockImplementation((path) => {
      return path.indexOf('header') !== -1 ? 'header' : 'content';
    });
    fileSystem.anycaseToTitle.mockImplementation((originCase, str) => {
      return str.indexOf('header') !== -1 ? 'Header' : 'Content';
    });

    tsj.createGenerator.mockImplementation((config) => ({
      createSchema: () => {
        if (config.path.indexOf('header') !== -1) {
          return {
            $schema: 'http://json-schema.org/draft-07/schema#',
            definitions: {
              HeaderProps: {
                type: 'object',
                properties: { title: { type: 'string' }, lead: { type: 'string' } },
                required: ['title', 'lead'],
                additionalProperties: false,
              },
            },
          };
        }

        return {
          $schema: 'http://json-schema.org/draft-07/schema#',
          definitions: {
            ContentProps: {
              type: 'object',
              properties: { body: { type: 'string' } },
              required: ['body'],
              additionalProperties: false,
            },
          },
        };
      },
    }));

    const expectedOutput = `
            import * as $0 from "@/sections/header";
            import * as $1 from "@/sections/content";
            
            const manifest = {
                sections: {
                    "@/sections/header": {
                        module: $0,
                        schema: {
                            component: {
                                type: "object",
                                required: ["title", "lead"],
                                properties: [
                                    { name: "title", type: "string" },
                                    { name: "lead", type: "string" },
                                ],
                            },
                        },
                    },
                    "@/sections/content": {
                        module: $1,
                        schema: {
                            component: {
                                type: "object",
                                required: ["body"],
                                properties: [{ name: "body", type: "string" }],
                            },
                        },
                    },
                },
                site: "@kiwi-app/kiwi-nextjs",
            };
            
            export default manifest;`;

    const formattedExpectedOutput = await prettyProtectedFileContent(expectedOutput);
    await manifest();

    expect(writeFileSyncSpy).toHaveBeenCalledWith(`${root}/manifest.ts`, formattedExpectedOutput, {
      encoding: 'utf-8',
    });
  });

  test('should generate a manifest without sections', async () => {
    fileSystem.ls.mockReturnValue([]);

    const expectedOutput = `

            const manifest = {
                sections: {},
                site: "@kiwi-app/kiwi-nextjs",
            };
            
            export default manifest;`;

    const formattedExpectedOutput = await prettyProtectedFileContent(expectedOutput);
    await manifest();

    expect(writeFileSyncSpy).toHaveBeenCalledWith(`${root}/manifest.ts`, formattedExpectedOutput, {
      encoding: 'utf-8',
    });
  });
});
