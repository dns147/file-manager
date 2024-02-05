import { getUserName } from "./getUserName.mjs";
import { homedir } from 'node:os';

const userName = getUserName();
console.log(`\x1b[34mWelcome to the File Manager, ${userName}!\x1b[0m`);

const userHomeDir = homedir();
console.log(`\x1b[32m\nYou are currently in\x1b[0m \x1b[33m${userHomeDir}\n\x1b[0m`);

const eventSigint = () => {
  console.log(`\x1b[34m\nThank you for using File Manager, ${userName}, goodbye!\x1b[0m`);
  process.exit(0);
};

export { eventSigint };
