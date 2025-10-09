import { existsSync } from 'fs';
import { join } from 'path';

export const getPreload = (name: string) => {
  const preload = join(__dirname, `../preload/${name}.js`);
  if (!existsSync(preload)) {
    throw new Error(`Preload script not found at ${preload}`);
  }
  return preload;
};
