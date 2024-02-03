import { readdir } from 'node:fs';
import { homedir } from 'node:os';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const userHomeDir = homedir();

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);
//const filePath = path.join(__dirname, 'files/fileToRead.txt');

const sortFiles = (files) => {
  const copiedFiles = files.slice();
  const extedFiles = [];
  const nonExtedFiles = [];

  function File(name, type) {
    this['Name'] = name;
    this['Type'] = type;
  }

  const enCollator = new Intl.Collator('en-US');
  const sortEn = copiedFiles.sort((a, b) => enCollator.compare(a, b));

  sortEn.forEach((file) => {
    const fileName = path.parse(file).name;
    const fileExt = path.parse(file).ext.slice(1);

    if (fileExt) {
      const fullFile = new File(file, 'file')
      extedFiles.push(fullFile);
    } else {
      const fullFile = new File(file, 'directory')
      nonExtedFiles.push(fullFile);
    }
  });

  return [...nonExtedFiles, ...extedFiles];
};

const makeCommand = (cmd) => {
  if (cmd === 'ls') {
    readdir(userHomeDir, 'utf8', (err, files) => {
      if (err) {
        throw err;
      }
      
      const filesSorted = sortFiles(files);
      console.table(filesSorted);
    });
  }
};

export { makeCommand };