const fs = require('fs');
const {
    ls,
    kebabToTitle,
    fileNameFromPath,
} = require('./file-system');

jest.mock('fs');

describe('fs()', () => {
    fs.readdirSync.mockImplementation((path) => {
        if (path === 'path/empty') {
            return [];
        }
        if (path === 'path/no-empty') {
            return ['file1.txt', 'file2.txt'];
        }
        throw 'path/exception';
    });

    test('should return a list of files in the directory', () => {
        const files = ls('path/no-empty');
        expect(files.length).toBe(2);
    });

    test('should return an empty list', () => {
        const files = ls('path/empty');
        expect(files.length).toBe(0);
    });

    test('should not thwon an exception and return null', () => {
        expect(() => {
            ls('path/exception');
        }).not.toThrow();

        const files = ls('path/exception');
        expect(files).toBeNull();
    });

    test('should return null case path isn`t valid', () => {
        const files = ls(null);
        expect(files).toBeNull();
    });
});

describe('kebabToTitle()', () => {
    test('should return a TitleCase from kebab-case', () => {
        expect(
            kebabToTitle('this-is-kebab-lowercase')
        ).toEqual('ThisIsKebabLowercase')

        expect(
            kebabToTitle('THIS-IS-KEBAB-UPPERCASE')
        ).toEqual('ThisIsKebabUppercase')
    });

    test('should return null if parameter is != string', () => {
        expect(kebabToTitle(123)).toBeNull();
        expect(kebabToTitle()).toBeNull();
        expect(kebabToTitle(null)).toBeNull();
    });
});

describe('fileNameFromPath()', () => {
    test('should return the correct filename', () => {
        expect(
            fileNameFromPath('./src/sections/header.tsx')
        ).toEqual('header')
        
        expect(
            fileNameFromPath('/Projects/kiwi-nextjs/src/sections/header.tsx')
        ).toEqual('header')

        expect(
            fileNameFromPath('./src/sections/header.txt', ['txt'])
        ).toEqual('header')
    });

    test('should return null case it`s not possible to get the filename', () => {
        expect(
            fileNameFromPath('./src/sections/header.css')
        ).toBeNull()
    });
});
