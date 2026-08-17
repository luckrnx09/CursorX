import { app } from 'electron';
import { spawn } from 'child_process';
import { join } from 'path';

export function installMacUpdate(dmgPath: string): void {
  const script = join(process.resourcesPath, 'scripts', 'update-mac.sh');
  const appPath = app.getPath('exe').replace(/\/Contents\/MacOS\/[^/]+$/, '');
  const child = spawn('bash', [script, String(process.pid), appPath, dmgPath], {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
  app.quit();
}
