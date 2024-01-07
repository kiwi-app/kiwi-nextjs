const { prettyProtectedFileContent } = require('../infrastructure/commons');

const pageTemplate = prettyProtectedFileContent(`
    import manifest from '@manifest';
    import { CatchAll } from '@kiwi-app/kiwi-nextjs';
    import ClientComponent from './client';
    import ServerComponent from './server';
    
    const Page = CatchAll(manifest, ClientComponent, ServerComponent);

    export default Page;    
`);

const clientCodeTemplate = prettyProtectedFileContent(
  `
    import manifest from '@manifest';
    import { CatchAllClient } from '@kiwi-app/kiwi-nextjs';
    
    const Page = CatchAllClient(manifest);

    export default Page;  
`,
  '"use client"',
);

const serverCodeTemplate = prettyProtectedFileContent(`
    import { CatchAllServer } from '@kiwi-app/kiwi-nextjs';
    export default CatchAllServer;    
`);

const routeTemplate = prettyProtectedFileContent(`
    import manifest from '@manifest';
    import { LiveRoute } from '@kiwi-app/kiwi-nextjs';

    export const { GET, POST, OPTIONS, PATCH } = LiveRoute(manifest);
`);

module.exports = {
  pageTemplate,
  clientCodeTemplate,
  serverCodeTemplate,
  routeTemplate,
};
