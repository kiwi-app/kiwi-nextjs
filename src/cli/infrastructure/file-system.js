const { readdirSync, writeFileSync } = require('fs');

function ls(path) {
  if (!path && typeof path != 'string') return null;

  try {
    const files = readdirSync(path);
    return files;
  } catch (e) {
    return null;
  }
}

function put(content, filePath) {
  writeFileSync(filePath, content);
}

function load(filePath) {
  return require(filePath);
}

function fileNameFromPath(filePath, extensions = ['tsx', 'ts']) {
  const acceptedExt = extensions.map((ext) => `\\.${ext}`).join('|');
  const regex = new RegExp(`\\w+([-_]\\w+)*(?=${acceptedExt})`, 'g');
  const fileName = filePath.match(regex);

  if (!Array.isArray(fileName)) {
    return null;
  }

  return fileName[0];
}

function kebabStrToArray(str) {
  const separator = '-';
  const words = str.toLocaleLowerCase().split(separator);
  return words;
}

function snakeStrToArray(str) {
  const separator = '_';
  const words = str.toLocaleLowerCase().split(separator);
  return words;
}

function camelOrTitleStrToArray(str) {
  const words = str.split(/(?=[A-Z0-9])/g).map((word) => word.toLowerCase());
  return words;
}

const enum_case_destructor = {
  kebab: kebabStrToArray,
  snake: snakeStrToArray,
  camel: camelOrTitleStrToArray,
  title: camelOrTitleStrToArray,
};

function arrToCamelCase(arr) {
  const words = arr
    .map((word, i) => (i ? `${word.charAt(0).toUpperCase()}${word.substr(1)}` : word))
    .join('');
  return words;
}

function arrToTitleCase(arr) {
  const words = arr.map((word, i) => `${word.charAt(0).toUpperCase()}${word.substr(1)}`).join('');
  return words;
}

const cases = {
  kebab: 'kebab-case',
  snake: 'snake_case',
  camel: 'camelCase',
};

const enum_case_assemble = {
  kebab: (words) => words.join('-'),
  snake: (words) => words.join('_'),
  camel: arrToCamelCase,
  title: arrToTitleCase,
};

function anyCaseToAnyCase(caseFrom, caseTo, str) {
  if (typeof str !== 'string') {
    return null;
  }

  if (!Object.hasOwn(enum_case_destructor, caseFrom)) {
    return null;
  }

  if (!Object.hasOwn(enum_case_assemble, caseTo)) {
    return null;
  }

  const words = enum_case_destructor[caseFrom](str);
  const converted = enum_case_assemble[caseTo](words);

  return converted;
}

function anycaseToTitle(caseOrigin, str) {
  const title = anyCaseToAnyCase(caseOrigin, 'title', str);
  return title;
}

module.exports = {
  ls,
  put,
  load,
  anycaseToTitle,
  anyCaseToAnyCase,
  fileNameFromPath,
  cases,
};
