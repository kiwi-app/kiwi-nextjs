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

const enum_case = {
  kebab: kebabStrToArray,
  snake: snakeStrToArray,
  camel: camelOrTitleStrToArray,
  title: camelOrTitleStrToArray,
};

function anycaseToTitle(caseOrigin, str) {
  if (typeof str !== 'string') {
    return null;
  }

  if (!Object.hasOwn(enum_case, caseOrigin)) {
    return null;
  }

  const words = enum_case[caseOrigin](str);
  const title = words.reduce((title, word) => {
    const title_str = word.charAt(0).toUpperCase() + word.substring(1);
    return `${title}${title_str}`;
  }, '');

  return title;
}

module.exports = {
  ls,
  put,
  load,
  anycaseToTitle,
  fileNameFromPath,
};
