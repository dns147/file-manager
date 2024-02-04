import { getUserName } from "./getUserName.mjs";
import { homedir } from 'node:os';
import { sortFiles } from "./sortFiles.mjs";
import path from "node:path";
import { chdir } from "node:process";
import { createReadStream, createWriteStream, open, readdir, rename, unlink } from "node:fs";

const userName = getUserName();
let homeDir = homedir();

const exit = () => {
  console.log(`\x1b[34m\nThank you for using File Manager, ${userName}, goodbye!\x1b[0m`);
  process.exit(0);
};

const listFiles = () => {
  readdir(homeDir, 'utf8', (err, files) => {
    if (err) {
      throw err;
    }
    
    const filesSorted = sortFiles(files);
    console.table(filesSorted);
    console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
  });
};

const inDirectory = (cmd) => {
  const directoryName = cmd.split('cd ')[1];
  const directoryPath = path.join(homeDir, directoryName);

  try {
    chdir(directoryPath);
    homeDir = directoryPath;
    console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
  } catch {
    console.log('\x1b[31m\nOperation failed. Directory not found.\n\x1b[0m');
  }
};

const upDirectory = () => {
  const directoryPath = path.join(homeDir, '../');

  try {
    chdir(directoryPath);
    homeDir = directoryPath;
    console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
  } catch {
    console.log('\x1b[31m\nOperation failed. Directory not found.\n\x1b[0m');
  }
};

const readFile = (cmd) => {
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
};

const addFile = (cmd) => {
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
};

const renameFile = (cmd) => {
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
};

const copyFile = (cmd) => {
  try {
    const splitedCmd = cmd.split(' ');
    const fileName = splitedCmd[1];
    const filePath = path.join(homeDir, fileName);
    const newDirectory = splitedCmd[2];
    const newDirectoryPath = path.join(homeDir, newDirectory);
    const readable = createReadStream(filePath);
    const writable = createWriteStream(newDirectoryPath);

    readable.on('error', () => {
      console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
    });

    writable.on('error', () => {
      console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
    });

    readable.pipe(writable);

    console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
  } catch {
    console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
  }
};

const moveFile = (cmd) => {
  try {
    const splitedCmd = cmd.split(' ');
    const fileName = splitedCmd[1];
    const filePath = path.join(homeDir, fileName);
    const newDirectory = splitedCmd[2];
    const newDirectoryPath = path.join(homeDir, newDirectory);
    const readable = createReadStream(filePath);
    const writable = createWriteStream(newDirectoryPath);

    readable.on('error', () => {
      console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
    });

    writable.on('error', () => {
      console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
    });

    readable.pipe(writable);

    writable.on('finish', () => {
      unlink(filePath, (err) => {
        if (err) {
          console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
        }
      });
    });

    console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
  } catch {
    console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
  }
};

const deleteFile = (cmd) => {
  try {
    const splitedCmd = cmd.split(' ');
    const fileName = splitedCmd[1];
    const filePath = path.join(homeDir, fileName);

    unlink(filePath, (err) => {
      if (err) {
        console.log('\x1b[31m\nOperation failed. File not found.\n\x1b[0m');
      }
    });

    console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
  } catch {
    console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
  }
};

export { 
  exit,
  listFiles,
  inDirectory,
  upDirectory,
  readFile,
  addFile,
  renameFile,
  copyFile,
  moveFile,
  deleteFile,
};