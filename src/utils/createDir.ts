import * as fs from 'fs/promises';

export const createDir = async (url) => {
  try {
    await fs.access(url);
  } catch (err) {
    if (err.code === 'ENOENT') {
      try {
        await fs.mkdir(url, { recursive: true });
      } catch (mkdirErr) {
        throw new Error(`Failed to create directory: ${mkdirErr.message}`);
      }
    } else {
      throw err;
    }
  }
};
