import * as readline from 'node:readline';
import { getUserName } from "./src/getUserName.mjs";
import { homedir } from 'node:os';
import { handleCommand } from './src/handleCommand.mjs';

const userName = getUserName();
console.log(`Welcome to the File Manager, ${userName}!`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const userHomeDir = homedir();
console.log(`\nYou are currently in ${userHomeDir}\n`);

const eventSigint = () => {
  console.log(`\nThank you for using File Manager, ${userName}, goodbye!`);
  process.exit(0);
};

rl.on('line', handleCommand)
  .on('SIGINT', eventSigint);
