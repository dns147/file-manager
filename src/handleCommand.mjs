import { readdir } from 'node:fs';
import { homedir } from 'node:os';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sortFiles } from './sortFiles.mjs';
import { chdir } from 'node:process';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const filePath = path.join(__dirname, '../index.js');

let homeDir = homedir();

const handleCommand = (cmd) => {
  if (cmd === '.exit') {
    console.log(`\nThank you for using File Manager, ${userName}, goodbye!`);
    process.exit(0);
  } else if (cmd === 'ls') {
    readdir(homeDir, 'utf8', (err, files) => {
      if (err) {
        throw err;
      }
      
      const filesSorted = sortFiles(files);
      console.table(filesSorted);
      console.log(`\nYou are currently in ${homeDir}\n`);
    });
  } else if (cmd.slice(0, 2) === 'cd') {
    const directoryName = cmd.split('cd ')[1];
    const directoryPath = path.join(homeDir, directoryName);

    try {
      chdir(directoryPath);
      homeDir = directoryPath;
      console.log(`\nYou are currently in ${homeDir}\n`);
    } catch {
      console.log('\nOperation failed. Directory not found.\n');
    }
  } else if (cmd === 'up') {
    const directoryPath = path.join(homeDir, '../');

    try {
      chdir(directoryPath);
      homeDir = directoryPath;
      console.log(`\nYou are currently in ${homeDir}\n`);
    } catch {
      console.log('\nOperation failed. Directory not found.\n');
    }
  } else {
    console.log('\nInvalid input.\n');
  }
};

export { handleCommand };