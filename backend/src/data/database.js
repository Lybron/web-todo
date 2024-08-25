import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if folder exists
const folderExists = (folderPath) => {
  return fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory();
};

// Read files from disk with a matching substring in the file name
const readWithFilter = (destinationPath, filter) => {
  const path = resolve(__dirname, `db/${destinationPath}`);

  if (!folderExists(path)) {
    return [];
  }

  const files = fs.readdirSync(path);
  const matches = files.filter((file) => file.includes(filter));
  const objects = matches.map((file) => {
    const filePath = join(path, file);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  });

  return objects;
};

// Read files from disk
const read = (destinationPath) => {
  const path = resolve(__dirname, `db/${destinationPath}`);

  if (!folderExists(path)) {
    return [];
  }

  const files = fs.readdirSync(path);
  const objects = files.map((file) => {
    const filePath = join(path, file);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  });

  return objects;
};

// Create file and write data to disk
const write = (filePath, data) => {
  const path = dirname(filePath);
  fs.mkdirSync(path, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
const save = (folderName, fileName, data) => {
  const filePath = resolve(__dirname, `db/${folderName}/${fileName}`);
  write(filePath, JSON.stringify(data, null, 2));
};

// Remove file from disk
const remove = (folderPath, filePath) => {
  const path = resolve(__dirname, `db/${folderPath}/${filePath}`);
  fs.unlinkSync(path);
};

export default {
  read,
  readWithFilter,
  save,
  remove,
};