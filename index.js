import * as readline from 'node:readline';
import { getUserName } from "./src/user.mjs";
import { homedir } from 'node:os';
import { makeCommand } from './src/nwd.mjs';

const userName = getUserName();
const userHomeDir = homedir();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: `\nYou are currently in ${userHomeDir}\n\n`,
});

console.log(`Welcome to the File Manager, ${userName}!`);
rl.prompt();

const eventCommand = (line) => {
  if (line === '.exit') {
    console.log(`\nThank you for using File Manager, ${userName}, goodbye!`);
    process.exit(0);
  }

  makeCommand(line);
  rl.prompt();
};

const eventSigint = () => {
  console.log(`\nThank you for using File Manager, ${userName}, goodbye!`);
  process.exit(0);
};

rl.on('line', eventCommand)
  .on('SIGINT', eventSigint);
