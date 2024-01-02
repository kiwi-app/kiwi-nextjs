const { readdirSync } = require('fs');

function ls(path) {
    if (!path && typeof path != 'string')
        return null;

    try {
        const files = readdirSync(path);
        return files;
    } catch (e) {
        return null;
    }
}

function kebabToTitle(str) {
    if (typeof str !== 'string')
        return null;

    const separator = '-';
    const title = str
        .toLocaleLowerCase()
        .split(separator)
        .reduce((title, word) => {
            const title_word = word.charAt(0).toUpperCase() + word.substring(1);
            return `${title}${title_word}`
        }, '');

    return title;
}

function fileNameFromPath(filePath, extensions = ['tsx', 'ts']) {
    const acceptedExt = extensions.map(ext => `\\.${ext}`).join('|');
    const regex = new RegExp(`[^\\/](\\w+)(?=${acceptedExt})`, 'g');
    const fileName = filePath.match(regex);

    if (!Array.isArray(fileName)) {
        return null;
    }

    return fileName[0];
}

module.exports = {
    ls,
    kebabToTitle,
    fileNameFromPath,
};
