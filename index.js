import * as readline from 'node:readline';
import { eventSigint } from './src/app.mjs';
import { handleCommand } from './src/handleCommand.mjs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', handleCommand)
  .on('SIGINT', eventSigint);
