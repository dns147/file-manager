import * as readline from 'node:readline';
import { getUserName } from "./src/getUserName.mjs";
import { homedir } from 'node:os';
import { handleCommand } from './src/handleCommand.mjs';

const userName = getUserName();
console.log(`\x1b[37;44mWelcome to the File Manager, ${userName}!\x1b[0m`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const userHomeDir = homedir();
console.log(`\x1b[32m\nYou are currently in\x1b[0m \x1b[33m${userHomeDir}\n\x1b[0m`);

const eventSigint = () => {
  console.log(`\x1b[37;44m\nThank you for using File Manager, ${userName}, goodbye!\x1b[0m`);
  process.exit(0);
};

rl.on('line', handleCommand)
  .on('SIGINT', eventSigint);
