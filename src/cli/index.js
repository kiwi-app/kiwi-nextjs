#!/usr/bin/env node

const init = require('./init');
const manifest = require('./manifest');

const [action, ...args] = process.argv.slice(2);

if (action === 'init') {
  init(args);
}

if (action === 'manifest') {
  manifest(args);
}

process.exit(0);
