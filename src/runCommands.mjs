import { getUserName } from "./getUserName.mjs";
import { EOL, arch, cpus, homedir, userInfo } from 'node:os';
import { sortFiles } from "./sortFiles.mjs";
import path from "node:path";
import { chdir } from "node:process";
import { createReadStream, createWriteStream, open, readdir, rename, unlink } from "node:fs";
import { createHash } from "node:crypto";
import { createCompressStream, createDecompressStream } from "./createStream.mjs";

const userName = getUserName();
let homeDir = homedir();

const exit = () => {
  console.log(`\x1b[34m\nThank you for using File Manager, ${userName}, goodbye!\x1b[0m`);
  process.exit(0);
};

const listFiles = () => {
  readdir(homeDir, 'utf8', (err, files) => {
    if (err) {
      console.log('\x1b[31m\nOperation failed. Directory not found.\n\x1b[0m');
    }
    
    const filesSorted = sortFiles(files);
    console.table(filesSorted);
    console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
  });
};

const inDirectory = (cmd) => {
  try {
    const directoryName = cmd.split('cd ')[1];
    const directoryPath = path.join(homeDir, directoryName);

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
      console.log(`\x1b[32m\nYou are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
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

    const newDirectory = splitedCmd[2] + fileName;
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

    console.log(`\x1b[32m\nYou are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
  } catch {
    console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
  }
};

const moveFile = (cmd) => {
  try {
    const splitedCmd = cmd.split(' ');
    const fileName = splitedCmd[1];
    const filePath = path.join(homeDir, fileName);

    const newDirectory = splitedCmd[2] + fileName;
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

    console.log(`\x1b[32m\nYou are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
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

    console.log(`\x1b[32m\nYou are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
  } catch {
    console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
  }
};

const runOsCommand = (cmd) => {
  const splitedCmd = cmd.split(' ');
  const currentUserInfo = userInfo();

  switch (splitedCmd[1]) {
    case '--EOL':
      console.log('\n', JSON.stringify(EOL));
      console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
      break;
    
    case '--cpus':
      const cpuCores = cpus();
      const cpuCoresFilter = cpuCores.map((value) => value.model);

      console.table(cpuCoresFilter);
      console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
      break;
    
    case '--homedir':
      console.log('\n', currentUserInfo.homedir);
      console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
      break;

    case '--username':
      console.log('\n', currentUserInfo.username);
      console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
      break;

    case '--architecture':
      console.log('\n', arch());
      console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
      break;
  
    default:
      console.log('\x1b[31m\nOperation failed. Command not found.\n\x1b[0m');
      break;
  }
};

const hashFile = (cmd) => {
  try {
    const splitedCmd = cmd.split(' ');
    const fileName = splitedCmd[1];
    const filePath = path.join(homeDir, fileName);
    const hash = createHash('sha256').setEncoding('hex');

    const readable = createReadStream(filePath);

    readable.on('error', () => {
      console.log('\x1b[31m\nOperation failed. File not found.\n\x1b[0m');
    });

    readable.pipe(hash).on('finish', () => {
      const fileHash = hash.read();
      const stream = new WritableStream({
        write(chunk) {
          console.log('\n', chunk);
          console.log(`\x1b[32m\nDone! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
        },
      });

      stream.getWriter().write(fileHash);
    });
  } catch {
    console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
  }
};

const compressFile = (cmd) => {
  try {
    const stream = createCompressStream(cmd, homeDir);

    stream.on('error', () => {
      console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
    });

    stream.on('finish', () => {
      console.log(`\x1b[32m\nDone compressing! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
    });
  } catch {
    console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
  }
};

const decompressFile = (cmd) => {
  try {
    const stream = createDecompressStream(cmd, homeDir);

    stream.on('error', () => {
      console.log('\x1b[31m\nOperation failed.\n\x1b[0m');
    });

    stream.on('finish', () => {
      console.log(`\x1b[32m\nDone decompressing! You are currently in\x1b[0m \x1b[33m${homeDir}\n\x1b[0m`);
    });
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
  runOsCommand,
  hashFile,
  compressFile,
  decompressFile,
};