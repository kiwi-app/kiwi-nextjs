const tsj = require('ts-json-schema-generator');
const { createPropSchema } = require('./schema');

jest.mock('ts-json-schema-generator');

describe('createPropSchema()', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('should generate a valid component schema without loader', () => {
        const desiredComponent = {
            type: 'object',
            required: ['title', 'lead'],
            properties: [
                { name: 'title', type: 'string' },
                { name: 'lead', type: 'string' },
            ],
        };

        tsj.createGenerator.mockImplementationOnce(() => ({
            createSchema: () => ({
                '$schema': 'http://json-schema.org/draft-07/schema#',
                definitions: {
                    HeaderProps: {
                        type: 'object',
                        properties: { title: { type: 'string' }, lead: { type: 'string' } },
                        required: ['title', 'lead'],
                        additionalProperties: false
                    },
                    LeadProps: {
                        type: 'object',
                        properties: { text: { type: 'string' } },
                        required: ['text'],
                        additionalProperties: false
                    },
                }
            })
        }));

        const modulePath = './src/sections/header.tsx';
        const { component, loader } = createPropSchema(modulePath);

        expect(loader).toBe(undefined);
        expect(component.type).toEqual(desiredComponent.type);
        expect(component.properties).toEqual(desiredComponent.properties);
        expect(component.required).toEqual(desiredComponent.required);
    });

    test('should generate a valid component schema with loader', () => {
        const desiredComponent = {
            type: 'object',
            properties: [
                { name: 'title', type: 'string' },
                { name: 'lead', type: 'string' },
            ],
            required: ['loader', 'title', 'lead'],
        };

        const desiredLoader = {
            type: "object",
            properties: [
                { name: "category", type: "string" }
            ],
            required: ["category"],
        };

        tsj.createGenerator.mockImplementationOnce(() => ({
            createSchema: () => ({
                '$schema': 'http://json-schema.org/draft-07/schema#',
                definitions: {
                    ProductsProps: {
                        type: 'object',
                        properties: {
                            loader: { '$ref': '#/definitions/ProductsLoader' },
                            title: { type: 'string' },
                            lead: { type: 'string' }
                        },
                        required: ['loader', 'title', 'lead'],
                        additionalProperties: false
                    },
                    ProductsLoaderProps: {
                        type: 'object',
                        properties: { category: { type: 'string' } },
                        required: ['category'],
                        additionalProperties: false
                    },
                    'NamedParameters<typeof Loader>': {
                        type: 'object',
                        properties: {
                            req: { '$ref': '#/definitions/LoaderRequest' },
                            props: { '$ref': '#/definitions/ProductsLoaderProps' }
                        },
                        required: ['req', 'props'],
                        additionalProperties: false
                    },
                }
            })
        }));

        const modulePath = './src/sections/products.tsx';
        const { component, loader } = createPropSchema(modulePath);

        expect(loader).not.toBe(undefined);

        expect(loader.type).toEqual(desiredLoader.type);
        expect(loader.properties).toEqual(desiredLoader.properties);
        expect(loader.required).toEqual(desiredLoader.required);

        expect(component.type).toEqual(desiredComponent.type);
        expect(component.properties).toEqual(desiredComponent.properties);
        expect(component.required).toEqual(desiredComponent.required);
    });

    test('should generate a valid component schema dynamic page loader', () => {
        const desiredComponent = {
            type: 'object',
            properties: [
                { name: 'title', type: 'string' },
                { name: 'lead', type: 'string' },
            ],
            required: ['loader', 'title', 'lead'],
        };

        const desiredLoader = {
            propsFromLoaderRequest: true
        };

        tsj.createGenerator.mockImplementationOnce(() => ({
            createSchema: () => ({
                '$schema': 'http://json-schema.org/draft-07/schema#',
                definitions: {
                    ProductsProps: {
                        type: 'object',
                        properties: {
                            loader: { '$ref': '#/definitions/ProductsLoader' },
                            title: { type: 'string' },
                            lead: { type: 'string' }
                        },
                        required: ['loader', 'title', 'lead'],
                        additionalProperties: false
                    },
                    'NamedParameters<typeof Loader>': {
                        type: 'object',
                        properties: {
                            req: { '$ref': '#/definitions/LoaderRequest' },
                        },
                        required: ['req', 'props'],
                        additionalProperties: false
                    },
                }
            })
        }));

        const modulePath = './src/sections/products.tsx';
        const { component, loader } = createPropSchema(modulePath);

        expect(loader).not.toBe(undefined);
        expect(loader).toEqual(desiredLoader);

        expect(component.type).toEqual(desiredComponent.type);
        expect(component.properties).toEqual(desiredComponent.properties);
        expect(component.required).toEqual(desiredComponent.required);
    });

    test('should throw exception case LoaderProps interface is not defined', () => {
        tsj.createGenerator.mockImplementationOnce(() => ({
            createSchema: () => ({
                '$schema': 'http://json-schema.org/draft-07/schema#',
                definitions: {
                    ProductsProps: {
                        type: 'object',
                        properties: {
                            loader: { '$ref': '#/definitions/ProductsLoader' },
                            title: { type: 'string' },
                            lead: { type: 'string' }
                        },
                        required: ['loader', 'title', 'lead'],
                        additionalProperties: false
                    },
                    'NamedParameters<typeof Loader>': {
                        type: 'object',
                        properties: {
                            req: { '$ref': '#/definitions/LoaderRequest' },
                            props: { '$ref': '#/definitions/ProductsLoaderProps' }
                        },
                        required: ['req', 'props'],
                        additionalProperties: false
                    },
                }
            })
        }));

        const modulePath = './src/sections/products.tsx';
        expect(() => {
            createPropSchema(modulePath);
        }).toThrow();
    });

    test('should generate a valid component schema complex type interface', () => {
        const desiredComponent = {
            type: 'object',
            required: ['title', 'lead', 'c2a'],
            properties: [
                { name: 'title', type: 'string' },
                { name: 'lead', type: 'string' },
                {
                    name: 'c2a',
                    type: 'object',
                    required: ['label', 'action'],
                    properties: [
                        { name: 'label', type: 'string' },
                        { name: 'action', type: 'string' },
                    ],
                },
            ],
        };

        tsj.createGenerator.mockImplementationOnce(() => ({
            createSchema: () => ({
                '$schema': 'http://json-schema.org/draft-07/schema#',
                definitions: {
                    Cta: {
                        type: 'object',
                        properties: { label: { type: 'string' }, action: { type: 'string' } },
                        required: ['label', 'action'],
                        additionalProperties: false
                    },
                    HeaderProps: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            lead: { type: 'string' },
                            c2a: { '$ref': '#/definitions/Cta' }
                        },
                        required: ['title', 'lead', 'c2a'],
                        additionalProperties: false
                    },
                    LeadProps: {
                        type: 'object',
                        properties: { text: { type: 'string' } },
                        required: ['text'],
                        additionalProperties: false
                    },
                }
            })
        }));

        const modulePath = './src/sections/header.tsx';
        const { component, loader } = createPropSchema(modulePath);

        expect(loader).toBe(undefined);
        expect(component.type).toEqual(desiredComponent.type);
        expect(component.properties).toEqual(desiredComponent.properties);
        expect(component.required).toEqual(desiredComponent.required);
    });

    test('should generate a valid component using system default types', () => {
        const desiredComponent = {
            type: 'object',
            required: ['title', 'lead'],
            properties: [
                { name: 'title', type: 'string' },
                { name: 'lead', type: 'RichText' },
            ],
        };

        tsj.createGenerator.mockImplementationOnce(() => ({
            createSchema: () => ({
                '$schema': 'http://json-schema.org/draft-07/schema#',
                definitions: {
                    HeaderProps: {
                        type: 'object',
                        properties: { title: { type: 'string' }, lead: { '$ref': '#/definitions/RichText' } },
                        required: ['title', 'lead'],
                        additionalProperties: false
                    },
                    LeadProps: {
                        type: 'object',
                        properties: { text: { type: 'string' } },
                        required: ['text'],
                        additionalProperties: false
                    },
                }
            })
        }));

        const modulePath = './src/sections/header.tsx';
        const { component, loader } = createPropSchema(modulePath);

        expect(loader).toBe(undefined);
        expect(component.type).toEqual(desiredComponent.type);
        expect(component.properties).toEqual(desiredComponent.properties);
        expect(component.required).toEqual(desiredComponent.required);
    });

    test('should generate a valid component using nested object schema', () => {
        const desiredComponent = {
            type: 'object',
            required: ['title', 'lead', 'banner'],
            properties: [
                { name: 'title', type: 'string' },
                { name: 'lead', type: 'string' },
                {
                    name: 'banner',
                    type: 'object',
                    required: ['image'],
                    properties: [
                        { name: 'image', type: 'string' }
                    ],
                },
            ],
        };

        tsj.createGenerator.mockImplementationOnce(() => ({
            createSchema: () => ({
                '$schema': 'http://json-schema.org/draft-07/schema#',
                definitions: {
                    HeaderProps: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            lead: { type: 'string' },
                            banner: {
                                type: 'object',
                                properties: { image: { type: 'string' } },
                                required: ['image'],
                                additionalProperties: false
                            }
                        },
                        required: ['title', 'lead', 'banner'],
                        additionalProperties: false
                    },
                    LeadProps: {
                        type: 'object',
                        properties: { text: { type: 'string' } },
                        required: ['text'],
                        additionalProperties: false
                    },
                }
            })
        }));

        const modulePath = './src/sections/header.tsx';
        const { component, loader } = createPropSchema(modulePath);

        expect(loader).toBe(undefined);
        expect(component.type).toEqual(desiredComponent.type);
        expect(component.properties).toEqual(desiredComponent.properties);
        expect(component.required).toEqual(desiredComponent.required);
    });

    test('should generate a valid component using with data type array', () => {
        const desiredComponent = {
            type: 'object',
            required: ['title', 'lead', 'banner', 'c2a', 'regulaments', 'complex'],
            properties: [
                { name: 'title', type: 'string' },
                { name: 'lead', type: 'string' },
                {
                    name: 'banner',
                    type: 'object',
                    required: ['images'],
                    properties: [{ name: 'images', type: 'array', items: { type: 'RichText' } }],
                },
                {
                    name: 'regulaments',
                    type: 'object',
                    required: ['link'],
                    properties: [{ name: 'link', type: 'array', items: { type: 'string' } }],
                },
                {
                    name: 'complex',
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['name', 'age'],
                        properties: [{ name: 'name', type: 'string' }, { name: 'age', type: 'number' }],
                    }
                },
                {
                    name: 'c2a',
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['label', 'action'],
                        properties: [{ name: 'label', type: 'string' }, { name: 'action', type: 'string' }]
                    }
                }
            ],
        };

        tsj.createGenerator.mockImplementationOnce(() => ({
            createSchema: () => ({
                '$schema': 'http://json-schema.org/draft-07/schema#',
                definitions: {
                    HeaderProps: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            lead: { type: 'string' },
                            banner: {
                                type: 'object',
                                properties: { images: { type: 'array', items: { '$ref': '#/definitions/RichText' } } },
                                required: ['images'],
                                additionalProperties: false
                            },
                            regulaments: {
                                type: 'object',
                                properties: { link: { type: 'array', items: { type: 'string' } } },
                                required: ['link'],
                                additionalProperties: false
                            },
                            complex: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: { name: { type: 'string' }, age: { type: 'number' } },
                                    required: ['name', 'age'],
                                    additionalProperties: false
                                }
                            },
                            c2a: { type: 'array', items: { '$ref': '#/definitions/Cta' } },
                        },
                        required: ['title', 'lead', 'banner', 'c2a', 'regulaments', 'complex'],
                        additionalProperties: false
                    },
                    Cta: {
                        type: 'object',
                        properties: { label: { type: 'string' }, action: { type: 'string' } },
                        required: ['label', 'action'],
                        additionalProperties: false
                    },
                }
            })
        }));

        const modulePath = './src/sections/header.tsx';
        const { component, loader } = createPropSchema(modulePath);

        expect(loader).toBe(undefined);
        expect(component.type).toEqual(desiredComponent.type);
        expect(component.properties).toEqual(desiredComponent.properties);
        expect(component.required).toEqual(desiredComponent.required);
    });

    test('should throw an exception case the modulePath is invalid', () => {
        expect(() => {
            createPropSchema();
        }).toThrow()

        expect(() => {
            createPropSchema('wrong/module/file');
        }).toThrow()
    });

    test('should throw an exception case the schema can`t be generated', () => {
        jest.spyOn(console, "log").mockImplementation(() => { });
        tsj.createGenerator.mockImplementationOnce(() => {
            throw Error;
        });
        expect(() => {
            createPropSchema('./src/sections/header.tsx');
        }).toThrow()
    });

    test('should throw an exception case the [Module]Props interface is not defined', () => {
        tsj.createGenerator.mockImplementationOnce(() => ({
            createSchema: () => ({
                '$schema': 'http://json-schema.org/draft-07/schema#',
                definitions: {
                    LeadProps: {
                        type: 'object',
                        properties: { text: { type: 'string' } },
                        required: ['text'],
                        additionalProperties: false
                    },
                }
            })
        }));

        const modulePath = './src/sections/header.tsx';
        expect(() => {
            createPropSchema(modulePath);
        }).toThrow()
    });

    test('should throw an exception case a $ref type is not defined', () => {
        tsj.createGenerator.mockImplementationOnce(() => ({
            createSchema: () => ({
                '$schema': 'http://json-schema.org/draft-07/schema#',
                definitions: {
                    LeadProps: {
                        type: 'object',
                        properties: { text: { type: 'string' }, c2a: { '$ref': '#/definitions/Cta' } },
                        required: ['text'],
                        additionalProperties: false
                    },
                }
            })
        }));

        const modulePath = './src/sections/Lead.tsx';
        expect(() => {
            createPropSchema(modulePath);
        }).toThrow()
    });
});
