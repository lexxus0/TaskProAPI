import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import {
  TEMP_UPLOAD_DIR,
  UPLOAD_DIR,
} from 'src/common/constants/app.constants';
import { createDir } from './createDir.js';

export const saveToDir = async (file) => {
  if (!file) {
    throw new Error('File object is undefined');
  }
  console.log('File received in saveToDir:', file);
  const filename = path.basename(file.filename);

  try {
    await createDir(UPLOAD_DIR);

    await fs.rename(
      path.join(TEMP_UPLOAD_DIR, filename),
      path.join(UPLOAD_DIR, filename),
    );
  } catch (err) {
    throw new Error(err.message);
  }

  return `${process.env.APP_DOMAIN}/uploads/${filename}`;
};
