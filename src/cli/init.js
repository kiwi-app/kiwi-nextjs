const path = require('path');
const { writeFileSync, mkdirSync } = require('fs');
const { execSync } = require('child_process');

module.exports = function (args) {
  console.log('args:', args?.join(','));

  const root = path.resolve('./src/app/');

  const SERVER_COMPONENT_PATH = `${root}/(kiwi)/[...kiwi]`;
  const CLIENT_COMPONENT_PATH = `${root}/(kiwi)/kiwi/[...kiwi]`;
  const API_PATH = `${root}/(kiwi)/api/kiwi/[...kiwi]`;

  const createKiwiFolder = () => {
    // server component
    mkdirSync(SERVER_COMPONENT_PATH, { recursive: true });

    // api routes
    mkdirSync(API_PATH, { recursive: true });

    // client component
    mkdirSync(CLIENT_COMPONENT_PATH, { recursive: true });
  };

  const createKiwiLiveFiles = () => {
    const code = `'use client';

    // DO NOT EDIT. This file is generated by Kiwi.
    // This file SHOULD be checked into source version control.

    import manifest from '@manifest';
    import { CatchAll } from 'kiwi-nexjs';
    
    const Page = CatchAll(manifest, true);
    
    export default Page;
    `;

    writeFileSync(`${CLIENT_COMPONENT_PATH}/page.tsx`, code);
    execSync(`npx prettier '${CLIENT_COMPONENT_PATH}/page.tsx' --write`);
  };

  const createKiwiServerFiles = () => {
    const code = `// DO NOT EDIT. This file is generated by Kiwi.
    // This file SHOULD be checked into source version control.

    import manifest from '@manifest';
    import { CatchAll } from 'kiwi-nexjs';
    
    const Page = CatchAll(manifest);
    
    export default Page;    
    `;

    writeFileSync(`${SERVER_COMPONENT_PATH}/page.tsx`, code);
    execSync(`npx prettier '${SERVER_COMPONENT_PATH}/page.tsx' --write`);
  };

  const createKiwiRouteFiles = () => {
    const code = `// DO NOT EDIT. This file is generated by Kiwi.
    // This file SHOULD be checked into source version control.

    import manifest from '@manifest';
    import { LiveRoute } from 'kiwi-nexjs';

    export const { GET, POST, OPTIONS, PATCH } = LiveRoute(manifest);
    `;

    writeFileSync(`${API_PATH}/route.ts`, code);
    execSync(`npx prettier '${API_PATH}/route.ts' --write`);
  };

  createKiwiFolder();
  createKiwiLiveFiles();
  createKiwiServerFiles();
  createKiwiRouteFiles();

  console.log('Files created!');
};
