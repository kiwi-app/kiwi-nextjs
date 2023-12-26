const path = require('path');
const { execSync } = require('child_process');
const { readdirSync, writeFileSync } = require('fs');
const tsj = require('ts-json-schema-generator');

const SCHEMA_FUNCTION_DEFINITION = 'NamedParameters<typeof';
const LOADER_DEFINITION = 'NamedParameters<typeof Loader>';
const LOADER_RESERVATED_WORD = 'loader';

function createSchemaFromRef(ref, schema, hasLoaderExported = false) {
  const [_, ...propPath] = ref.split('/');

  let currentSchema = schema;
  for (const prop of propPath) {
    currentSchema = currentSchema[prop];
  }

  const props = [];
  for (const prop in currentSchema.properties) {
    if (hasLoaderExported && prop === LOADER_RESERVATED_WORD) continue;

    if (currentSchema.properties[prop]['$ref']) {
      props.push({
        name: prop,
        type: currentSchema.properties[prop]['$ref'].split('/').pop(),
      });
    } else {
      props.push({ name: prop, ...currentSchema.properties[prop] });
    }
  }

  return {
    properties: props,
    required: currentSchema.required,
    type: currentSchema.type,
    description: currentSchema.description,
  };
}

function createPropSchema(file, isLoaderFolder = false) {
  /** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
  const config = {
    path: file,
    tsconfig: './tsconfig.json',
    type: '*',
    expose: 'all',
    jsDoc: 'extended',
  };

  const schema = tsj.createGenerator(config).createSchema(config.type);

  let loader = null;
  let component = {};
  for (const definition in schema.definitions) {
    const isExportedModule = definition.includes(SCHEMA_FUNCTION_DEFINITION);

    if (isExportedModule) {
      const isLoader = definition.toLowerCase() === LOADER_DEFINITION.toLowerCase();

      if (isLoader) {
        const loaderProps = { ...schema.definitions[definition].properties };

        if (!isLoaderFolder) {
          delete loaderProps[Object.keys(loaderProps)[0]];
        }

        if (Object.keys(loaderProps).length === 0) {
          loader = { propsFromLoaderRequest: true };
        } else {
          loader = loaderProps;
        }
      } else {
        component = schema.definitions[definition].properties;
      }
    }
  }

  const propSchema = {};
  const componentProps = Object.values(component ?? {});
  for (const prop of componentProps) {
    if (prop['$ref']) {
      propSchema['component'] = createSchemaFromRef(prop['$ref'], schema, !!loader);
    }
  }

  if (loader?.propsFromLoaderRequest) {
    propSchema['loader'] = loader;
  } else {
    const loaderProps = Object.values(loader ?? {});
    for (const prop of loaderProps) {
      if (prop['$ref']) {
        propSchema['loader'] = createSchemaFromRef(prop['$ref'], schema);
      }
    }
  }

  return propSchema;
}

module.exports = function (args) {
  const root = path.resolve();

  const package = require(`${root}/package.json`);

  const serviceMap = {
    sections: [],
    loaders: [],
  };

  let sections = [];
  try {
    sections = readdirSync(`${root}/src/sections`);
  } catch (_) {}

  let loaders = [];
  try {
    loaders = readdirSync(`${root}/src/loaders`);
  } catch (_) {}

  sections.forEach(function (file) {
    serviceMap.sections.push({
      path: `@/sections/${file.split('.')[0]}`,
      schema: createPropSchema(`${root}/src/sections/${file}`),
    });
  });

  loaders.forEach(function (file) {
    const { loader } = createPropSchema(`${root}/src/loaders/${file}`, true);

    serviceMap.loaders.push({
      path: `@/loaders/${file.split('.')[0]}`,
      schema: { loader },
    });
  });

  const output = `// DO NOT EDIT. This file is generated by Kiwi.
        // This file SHOULD be checked into source version control.

        ${serviceMap.sections.map(({ path }, i) => `import * as $${i} from '${path}';`).join('\n')}
        ${serviceMap.loaders.map(({ path }, i) => `import * as $$${i} from '${path}';`).join('\n')}

        const manifest = {
          sections: {
            ${serviceMap.sections
              .map(
                ({ path, schema }, i) =>
                  `"${path}": { module: $${i}, schema: ${JSON.stringify(schema)} },`,
              )
              .join('\n    ')}
          },
          loaders: {
            ${serviceMap.loaders
              .map(
                ({ path, schema }, i) =>
                  `"${path}": { module: $$${i}, schema: ${JSON.stringify(schema)} },`,
              )
              .join('\n    ')}
          },
          site: "${package.name}"
        };

        export default manifest;
        `;

  console.log('Writing manifest...');

  writeFileSync(`${root}/manifest.ts`, output, { encoding: 'utf-8' });
  execSync(`npx prettier '${root}/manifest.ts' --write`);
};
