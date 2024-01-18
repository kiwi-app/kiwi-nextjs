#!/usr/bin/env node

const init = require('./init');
const manifest = require('./manifest');
const generate = require('./generate');

const [action, ...args] = process.argv.slice(2);

const actions = {
  init: init,
  manifest: manifest,
  generate: generate,
};

async function executeCli() {
  if (Object.hasOwn(actions, action)) {
    try {
      await actions[action](args);
    } catch (e) {
      console.log(`\n\n✖  ${e}\n\n`);
    }
  } else {
    const strActions = Object.keys(actions).join('|');
    console.log(`\nusage: npx kiwi <command> (${strActions})\n`);
  }

  process.exit(0);
}

executeCli();
