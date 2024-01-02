const tsj = require('ts-json-schema-generator');
const {
    fileNameFromPath,
    kebabToTitle
} = require('../infrastructure/file-system');

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
    const config = makeConfig(modulePath);
    const schema = tsj.createGenerator(config).createSchema(config.type);

    return schema;
}

function getModuleNameByPath(modulePath) {
    const fileName = fileNameFromPath(modulePath);
    if (typeof fileName !== 'string') {
        throw 'you must provide the module path with a valid .tsx or .ts module file';
    }

    return fileName;
}

function getInterfaceNameByModuleName(schema, moduleName, sulfix) {
    const interfaceName = kebabToTitle(moduleName) + sulfix;

    if (!Object.hasOwn(schema.definitions, interfaceName)) {
        return null;
    }

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

function buildProperty(schema, properties, prop) {
    if (Object.hasOwn(properties[prop], '$ref')) {
        const { $ref } = properties[prop];
        const refType = parseRef($ref);

        if (DEFAULT_TYPES.includes(refType)) {
            return {
                name: prop,
                type: refType,
            };
        }

        const refInterface = getInterfaceByRef(schema, $ref);
        if (refInterface === null) {
            throw `the type ${$ref} wasn't found in the schema`;
        }

        const module = assembleSchema(schema, refInterface);
        return {
            ...module,
            name: prop,
            type: 'object',
        };
    }

    if (properties[prop].type === 'object') {
        const objInterface = properties[prop];
        const module = assembleSchema(schema, objInterface);

        return {
            ...module,
            name: prop,
            type: 'object',
        };
    }

    return {
        name: prop,
        type: properties[prop].type
    };
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
            throw 'LoderParams (props) must have a interface declared in the schema';
        }

        const loader = assembleSchema(schema, loaderPropsParamInterface);
        return loader;
    }

    return null;
}

function createPropSchema(modulePath) {
    if (typeof modulePath !== 'string') {
        throw 'you must provide a valid module path';
    }

    const moduleName = getModuleNameByPath(modulePath);
    const schema = createSchema(modulePath);

    const componentInterfaceName = getInterfaceNameByModuleName(schema, moduleName, 'Props');
    if (!componentInterfaceName) {
        throw `${modulePath} needs to define the ${componentInterfaceName} interface`;
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
