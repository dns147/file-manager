import { 
  inDirectory, 
  exit, 
  listFiles, 
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
} from './runCommands.mjs';

const handleCommand = (cmd) => {
  if (cmd === '.exit') {
    exit();
  } else if (cmd === 'ls') {
    listFiles();
  } else if (cmd.slice(0, 2) === 'cd') {
    inDirectory(cmd);
  } else if (cmd === 'up') {
    upDirectory();
  } else if (cmd.slice(0, 3) === 'cat') {
    readFile(cmd);
  } else if (cmd.slice(0, 3) === 'add') {
    addFile(cmd);
  } else if (cmd.slice(0, 2) === 'rn') {
    renameFile(cmd);
  } else if (cmd.slice(0, 2) === 'cp') {
    copyFile(cmd);
  } else if (cmd.slice(0, 2) === 'mv') {
    moveFile(cmd);
  } else if (cmd.slice(0, 2) === 'rm') {
    deleteFile(cmd);
  } else if (cmd.slice(0, 2) === 'os') {
    runOsCommand(cmd);
  } else if (cmd.slice(0, 4) === 'hash') {
    hashFile(cmd);
  } else if (cmd.slice(0, 8) === 'compress') {
    compressFile(cmd);
  } else if (cmd.slice(0, 10) === 'decompress') {
    decompressFile(cmd);
  } else {
    console.log('\x1b[31m\nInvalid input.\n\x1b[0m');
  }
};

export { handleCommand };