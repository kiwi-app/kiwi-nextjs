const fs = require('fs');
const templates = require('./templates');
const { createKiwiDirectory, createKiwiStructure } = require('./file-structure');

jest.mock('fs');

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('file and folder structure', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createKiwiDirectory()', () => {
    beforeEach(() => {
      fs.mkdirSync.mockImplementation((path, _) => path);
    });

    test('should use double brackets [[kiwi]] for pages and single [kiwi] for api if setup uses kiwi root page', () => {
      createKiwiDirectory({ useRootPage: true });

      expect(fs.mkdirSync).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('/(kiwi)/[[...kiwi]]'),
        {
          recursive: true,
        },
      );

      expect(fs.mkdirSync).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('/(kiwi)/api/kiwi/[...kiwi]'),
        {
          recursive: true,
        },
      );
    });

    test('should use single brackets [kiwi] for pages and api if setup does not uses kiwi root page', () => {
      createKiwiDirectory({ useRootPage: false });

      expect(fs.mkdirSync).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('/(kiwi)/[...kiwi]'),
        {
          recursive: true,
        },
      );

      expect(fs.mkdirSync).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('/(kiwi)/api/kiwi/[...kiwi]'),
        {
          recursive: true,
        },
      );
    });
  });

  describe('createKiwiStructure()', () => {
    beforeEach(() => {
      fs.writeFileSync.mockImplementation((filePath, _) => filePath);
    });

    test('should create structure for api containing a single file called "route.ts" at "/(kiwi)/api/kiwi/[...kiwi]"', async () => {
      await createKiwiStructure({ useRootPage: true });

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining(`/(kiwi)/api/kiwi/[...kiwi]/route.ts`),
        expect.stringContaining(await templates.routeTemplate),
      );
    });

    test('should create structure for pages containing a three files called client.tsx, server.tsx and page.tsx at "/(kiwi)/[...kiwi]" when setup does not uses kiwi root page', async () => {
      await createKiwiStructure({ useRootPage: false });

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining(`/(kiwi)/[...kiwi]/page.tsx`),
        expect.stringContaining(await templates.pageTemplate),
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining(`/(kiwi)/[...kiwi]/client.tsx`),
        expect.stringContaining(await templates.clientCodeTemplate),
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining(`/(kiwi)/[...kiwi]/server.tsx`),
        expect.stringContaining(await templates.serverCodeTemplate),
      );
    });

    test('should create structure for pages containing a three files called client.tsx, server.tsx and page.tsx at "/(kiwi)/[[...kiwi]]" when setup uses kiwi root page', async () => {
      await createKiwiStructure({ useRootPage: true });

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining(`/(kiwi)/[[...kiwi]]/page.tsx`),
        expect.stringContaining(await templates.pageTemplate),
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining(`/(kiwi)/[[...kiwi]]/client.tsx`),
        expect.stringContaining(await templates.clientCodeTemplate),
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining(`/(kiwi)/[[...kiwi]]/server.tsx`),
        expect.stringContaining(await templates.serverCodeTemplate),
      );
    });
  });
});
