const tsj = require('ts-json-schema-generator');
const {
    fileNameFromPath,
    anycaseToTitle
} = require('../infrastructure/file-system');
const { getKiwiConfig } = require('../infrastructure/commons');

const DEFAULT_TYPES = [
    'RichText',
];

function makeConfig(modulePath) {
    /** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
    const config = {
        path: modulePath,
        tsconfig: './tsconfig.json',
        type: '*',
        expose: 'all',
        jsDoc: 'extended',
    };

    return config;
}

function createSchema(modulePath) {
    try {
        const config = makeConfig(modulePath);
        const schema = tsj.createGenerator(config).createSchema(config.type);

        return schema;
    } catch (e) {
        console.log(`It wasn't possible to generate the schema: module[${modulePath}].`)
    }
}

function getModuleNameByPath(modulePath) {
    const fileName = fileNameFromPath(modulePath);
    if (typeof fileName !== 'string') {
        throw new Error('you must provide the module path with a valid .tsx or .ts module file');
    }

    return fileName;
}

function getInterfaceNameByModuleName(moduleName, sulfix) {
    const moduleCase = getKiwiConfig('moduleFileNameCase');
    const interfaceName = anycaseToTitle(moduleCase, moduleName) + sulfix;

    return interfaceName;
}

function parseRef($ref) {
    if ($ref.charAt(0) === '#') {
        const parsed = $ref.split('/').slice(-1)[0];
        return parsed;
    }

    return $ref;
}

function getInterfaceByRef(schema, $ref) {
    const refName = parseRef($ref);

    if (!Object.hasOwn(schema.definitions, refName)) {
        return null;
    }

    const refInterface = schema.definitions[refName];
    return refInterface;
}

function moduleToArrayModule(name, module) {
    const { type, required, properties } = module;
    return {
        name,
        type: 'array',
        items: { type, required, properties },
    };
}

function buildObjectTypeProperty(schema, property, name) {
    const module = assembleSchema(schema, property);
    return { ...module, name, type: 'object' };
}

function buildRefProperty(schema, property, name) {
    const { $ref } = property;
    const type = parseRef($ref);

    if (DEFAULT_TYPES.includes(type)) {
        return { name, type };
    }

    const refInterface = getInterfaceByRef(schema, $ref);
    const module = buildObjectTypeProperty(schema, refInterface, name);

    return module;
}

function buildArrayTypeProperty(schema, property, name) {
    const { items } = property;

    if (Object.hasOwn(items, '$ref')) {
        const module = buildRefProperty(schema, items, name);
        const { type } = module;

        if (type === 'object') {
            const prop = moduleToArrayModule(name, module);
            return prop;
        }

        return {
            name,
            type: 'array',
            items: { type },
        };
    }

    if (items.type === 'object') {
        const module = buildObjectTypeProperty(schema, items, name);
        const prop = moduleToArrayModule(name, module);

        return prop;
    }

    return { name, type: 'array', items };
}

function buildProperty(schema, properties, name) {
    const property = properties[name];
    const { type } = property;

    if (Object.hasOwn(property, '$ref')) {
        return buildRefProperty(schema, property, name);
    }

    if (type === 'object') {
        return buildObjectTypeProperty(schema, property, name);
    }

    if (type === 'array') {
        return buildArrayTypeProperty(schema, property, name);
    }

    return { name, type };
}

function assembleSchema(schema, module) {
    const { required, type } = module;
    const moduleProperties = Object.keys(module.properties);

    const properties = moduleProperties.reduce((state, prop) => {
        if (prop === 'loader') {
            return state;
        }
        const property = buildProperty(schema, module.properties, prop);
        return [...state, property];
    }, []);

    const assembled = {
        type,
        required,
        properties,
    };

    return assembled;
}

function buildLoader(schema) {
    const loaderParamsInterfaceName = 'NamedParameters<typeof Loader>';
    const loaderParamsInterface = getInterfaceByRef(schema, loaderParamsInterfaceName);

    if (loaderParamsInterface !== null) {
        if (!Object.hasOwn(loaderParamsInterface.properties, 'props')) {
            const loader = {
                propsFromLoaderRequest: true,
            }
            return loader;
        }

        const loaderPropsParamInterfaceName = loaderParamsInterface.properties.props.$ref;
        const loaderPropsParamInterface = getInterfaceByRef(schema, loaderPropsParamInterfaceName);
        if (loaderPropsParamInterface === null) {
            throw new Error('LoderParams (props) must have a interface declared in the schema');
        }

        const loader = assembleSchema(schema, loaderPropsParamInterface);
        return loader;
    }

    return null;
}

function createPropSchema(modulePath) {
    if (typeof modulePath !== 'string') {
        throw new Error('you must provide a valid module path');
    }

    const moduleName = getModuleNameByPath(modulePath);
    const schema = createSchema(modulePath);
    const componentInterfaceName = getInterfaceNameByModuleName(moduleName, 'Props');

    if (!Object.hasOwn(schema.definitions, componentInterfaceName)) {
        throw new Error(`${moduleName}.tsx module needs to define ${componentInterfaceName} interface`);
    }

    const componentRootSchema = schema.definitions[componentInterfaceName];
    const component = assembleSchema(schema, componentRootSchema);
    const loader = buildLoader(schema);

    if (!loader) {
        return { component };
    }

    return { component, loader };
}

module.exports = {
    createPropSchema,
};
