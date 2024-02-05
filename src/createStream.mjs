import { createReadStream, createWriteStream } from "node:fs";
import path from "node:path";
import { createBrotliCompress, createBrotliDecompress } from "node:zlib";

const createCompressStream = (cmd, homeDir) => {
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

  const brotli = createBrotliCompress();
  const stream = readable.pipe(brotli).pipe(writable);

  return stream;
};

const createDecompressStream = (cmd, homeDir) => {
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

  const brotli = createBrotliDecompress();
  const stream = readable.pipe(brotli).pipe(writable);

  return stream;
};

export { createCompressStream, createDecompressStream };
