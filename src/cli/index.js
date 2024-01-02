#!/usr/bin/env node

const init = require('./init');
const manifest = require('./manifest');

const [action, ...args] = process.argv.slice(2);

const actions = {
  'init': init,
  'manifest': manifest,
}

async function executeCli() {
  if (Object.hasOwn(actions, action)) {
    await actions[action](args);
  }
  else {
    const strActions = Object.keys(actions).join('|');
    console.log(`\nusage: npx kiwi <command> (${strActions})\n`);
  }

  process.exit(0);
}

executeCli();
