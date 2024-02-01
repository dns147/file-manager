import * as readline from 'node:readline';
import { getUserName } from "./src/user.mjs";

const userName = getUserName();
console.log(`Welcome to the File Manager, ${userName}!\n`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const eventExit = (line) => {
  if (line === '.exit') {
    console.log(`\nThank you for using File Manager, ${userName}, goodbye!`);
    process.exit(0);
  }
};

const eventSigint = () => {
  console.log(`\nThank you for using File Manager, ${userName}, goodbye!`);
  process.exit(0);
};

rl.on('line', eventExit)
  .on('SIGINT', eventSigint);
