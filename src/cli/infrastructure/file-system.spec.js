const fs = require('fs');
const {
  ls,
  put,
  anyCaseToAnyCase,
  anycaseToTitle,
  fileNameFromPath,
} = require('./file-system');

jest.mock('fs');

describe('ls()', () => {
  beforeAll(() => {
    fs.readdirSync.mockImplementation((path) => {
      if (path === 'path/empty') {
        return [];
      }
      if (path === 'path/no-empty') {
        return ['file1.txt', 'file2.txt'];
      }
      throw new Error('path/exception');
    });
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

describe('put()', () => {
  beforeAll(() => {
    fs.writeFileSync.mockImplementation((filePath, content) => {
      if (filePath === 'path/sucess') {
        return;
      }

      throw new Error('path/exception');
    });
  });

  test('should write the file without errors', () => {
    const filePath = 'path/sucess';
    const content = 'This is the test content';

    expect(() => {
      put(content, filePath);
    }).not.toThrow();
    expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, content);
  });

  test('should throw exception in case of error', () => {
    const filePath = 'path/exception';
    const content = 'This is the test content';

    expect(() => {
      put(content, filePath);
    }).toThrow();
  });
});

describe('anycaseToTitle()', () => {
  test('should return a TitleCase from kebab-case, snake_case, TitleCase and camelCase', () => {
    expect(anycaseToTitle('kebab', 'this-is-kebab-lowercase')).toEqual('ThisIsKebabLowercase');

    expect(anycaseToTitle('kebab', 'THIS-IS-KEBAB-UPPERCASE')).toEqual('ThisIsKebabUppercase');

    expect(anycaseToTitle('snake', 'this_is_snake_lowercase')).toEqual('ThisIsSnakeLowercase');

    expect(anycaseToTitle('snake', 'THIS_IS_SNAKE_UPPERCASE')).toEqual('ThisIsSnakeUppercase');

    expect(anycaseToTitle('camel', 'thisIsCamelCase')).toEqual('ThisIsCamelCase');

    expect(anycaseToTitle('title', 'ThisIsTitleCase')).toEqual('ThisIsTitleCase');
  });

  test('should return null if parameter is != string or originCase is not valid', () => {
    expect(anycaseToTitle('kebab', 123)).toBeNull();
    expect(anycaseToTitle('kebab')).toBeNull();
    expect(anycaseToTitle('kebab', null)).toBeNull();
    expect(anycaseToTitle('not-valid', 'kebab-case')).toBeNull();
  });
});

describe('anycaseToAnyCase()', () => {
  test('should return camelCase', () => {
    expect(anyCaseToAnyCase('kebab', 'camel', 'this-is-kebab')).toEqual('thisIsKebab');
    expect(anyCaseToAnyCase('snake', 'camel', 'this_is_snake')).toEqual('thisIsSnake');
    expect(anyCaseToAnyCase('camel', 'camel', 'thisIsCamelCase')).toEqual('thisIsCamelCase');
    expect(anyCaseToAnyCase('title', 'camel', 'ThisIsTitleCase')).toEqual('thisIsTitleCase');
  });

  test('should return kebabCase', () => {
    expect(anyCaseToAnyCase('kebab', 'kebab', 'this-is-kebab')).toEqual('this-is-kebab');
    expect(anyCaseToAnyCase('snake', 'kebab', 'this_is_snake')).toEqual('this-is-snake');
    expect(anyCaseToAnyCase('camel', 'kebab', 'thisIsCamelCase')).toEqual('this-is-camel-case');
    expect(anyCaseToAnyCase('title', 'kebab', 'ThisIsTitleCase')).toEqual('this-is-title-case');
  });

  test('should return snakeCase', () => {
    expect(anyCaseToAnyCase('kebab', 'snake', 'this-is-kebab')).toEqual('this_is_kebab');
    expect(anyCaseToAnyCase('snake', 'snake', 'this_is_snake')).toEqual('this_is_snake');
    expect(anyCaseToAnyCase('camel', 'snake', 'thisIsCamelCase')).toEqual('this_is_camel_case');
    expect(anyCaseToAnyCase('title', 'snake', 'ThisIsTitleCase')).toEqual('this_is_title_case');
  });

  test('should return null if parameter is != string or originCase is not valid', () => {
    expect(anyCaseToAnyCase('kebab', 'title', 123)).toBeNull();
    expect(anyCaseToAnyCase('kebab', 'title')).toBeNull();
    expect(anyCaseToAnyCase('kebab', 'title', null)).toBeNull();
    expect(anyCaseToAnyCase('not-valid', 'kebab-case', 'str')).toBeNull();
  });
});

describe('fileNameFromPath()', () => {
  test('should return the correct filename', () => {
    expect(fileNameFromPath('./src/sections/header.tsx')).toEqual('header');

    expect(fileNameFromPath('/Projects/kiwi-nextjs/src/sections/header.tsx')).toEqual('header');

    expect(fileNameFromPath('/Projects/kiwi-nextjs/src/sections/header-kebab.tsx')).toEqual(
      'header-kebab',
    );

    expect(fileNameFromPath('/Projects/kiwi-nextjs/src/sections/header-kebab-case.tsx')).toEqual(
      'header-kebab-case',
    );

    expect(fileNameFromPath('/Projects/kiwi-nextjs/src/sections/header_snake.tsx')).toEqual(
      'header_snake',
    );

    expect(fileNameFromPath('/Projects/kiwi-nextjs/src/sections/header_snake_case.tsx')).toEqual(
      'header_snake_case',
    );

    expect(fileNameFromPath('./src/sections/header.txt', ['txt'])).toEqual('header');
  });

  test('should return null case it`s not possible to get the filename', () => {
    expect(fileNameFromPath('./src/sections/header.css')).toBeNull();
  });
});
