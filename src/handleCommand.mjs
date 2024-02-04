import { createReadStream, open, readdir, rename } from 'node:fs';
import { homedir } from 'node:os';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sortFiles } from './sortFiles.mjs';
import { chdir } from 'node:process';
import { getUserName } from './getUserName.mjs';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const filePath = path.join(__dirname, '../index.js');

let homeDir = homedir();
const userName = getUserName();

const handleCommand = (cmd) => {
  if (cmd === '.exit') {
    console.log(`\x1b[34m\nThank you for using File Manager, ${userName}, goodbye!\x1b[0m`);
    process.exit(0);
  } else if (cmd === 'ls') {
    readdir(homeDir, 'utf8', (err, files) => {
      if (err) {
        throw err;
      }
      
      const filesSorted = sortFiles(files);
      console.table(filesSorted);
      console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
    });
  } else if (cmd.slice(0, 2) === 'cd') {
    const directoryName = cmd.split('cd ')[1];
    const directoryPath = path.join(homeDir, directoryName);

    try {
      chdir(directoryPath);
      homeDir = directoryPath;
      console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
    } catch {
      console.log('\x1b[31m\nOperation failed. Directory not found.\n\x1b[0m');
    }
  } else if (cmd === 'up') {
    const directoryPath = path.join(homeDir, '../');

    try {
      chdir(directoryPath);
      homeDir = directoryPath;
      console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
    } catch {
      console.log('\x1b[31m\nOperation failed. Directory not found.\n\x1b[0m');
    }
  } else if (cmd.slice(0, 3) === 'cat') {
    try {
      const fileName = cmd.split('cat ')[1];
      const filePath = path.join(homeDir, fileName);
      const stream = createReadStream(filePath);

      stream.on('data', (data) => {
        const dataFile = Buffer.from(data);
        console.log(`\n${dataFile.toString()}`);
        console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
      });

      stream.on('error', () => {
        console.log('\x1b[31m\nOperation failed. File not found.\n\x1b[0m');
      });
    } catch {
      console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
    }
  } else if (cmd.slice(0, 3) === 'add') {
    try {
      const fileName = cmd.split('add ')[1];
      const filePath = path.join(homeDir, fileName);

      open(filePath, 'w', (err) => {
        if (err) {
          console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
        }
        console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
      });
    } catch {
      console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
    }
  } else if (cmd.slice(0, 2) === 'rn') {
    try {
      const splitedCmd = cmd.split(' ');
      const fileName = splitedCmd[1];
      const filePath = path.join(homeDir, fileName);
      const newFileName = splitedCmd[2];
      const newFilePath = path.join(homeDir, newFileName);

      rename(filePath, newFilePath, (err) => {
        if (err) {
          console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
        }
        console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
      });
    } catch {
      console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
    }
  } else {
    console.log('\x1b[31m\nInvalid input.\n\x1b[0m');
  }
};

export { handleCommand };