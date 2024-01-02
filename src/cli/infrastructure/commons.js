const prettier = require('prettier');

async function prettyProtectedFileContent(content) {
    const template = `
        // DO NOT EDIT. This file is generated by Kiwi.
        // This file SHOULD be checked into source version control.

        ${content}
    `;
    const formattedOutput = await prettier.format(template, {
        parser: "babel-ts",
    });

    return formattedOutput;
}

module.exports = {
    prettyProtectedFileContent,
};