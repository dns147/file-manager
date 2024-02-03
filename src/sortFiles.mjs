import path from 'path';

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

export { sortFiles };
