import { useEffect, useState } from 'react';
import { UpdateStatus } from '../../shared/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const statusText = (status: UpdateStatus | null): string => {
  if (!status) return 'Check for updates to get the latest features';
  switch (status.state) {
    case 'checking':
      return 'Checking for updates...';
    case 'available':
      return `Version ${status.version} is available`;
    case 'downloading':
      return `Downloading update... ${status.percent}%`;
    case 'downloaded':
      return `Version ${status.version} is ready to install`;
    case 'not-available':
      return 'CursorX is up to date';
    case 'error':
      return `Update failed: ${status.message}`;
  }
};

export function UpdateSection() {
  const [version, setVersion] = useState<string>('');
  const [status, setStatus] = useState<UpdateStatus | null>(null);

  const isMac = window.settingsAPI.app.platform === 'darwin';

  useEffect(() => {
    void window.settingsAPI.app.getVersion().then(setVersion);
    window.settingsAPI.updater.onStatus(setStatus);
  }, []);

  const checking = status?.state === 'checking' || status?.state === 'downloading';

  const renderAction = () => {
    if (!status || status.state === 'not-available' || status.state === 'error') {
      return (
        <Button
          onClick={() => void window.settingsAPI.updater.check()}
          disabled={checking}
          className="bg-gradient-to-r from-violet-500 to-purple-500 text-white"
        >
          Check for Updates
        </Button>
      );
    }
    if (status.state === 'available' && isMac) {
      return (
        <Button
          onClick={() => window.settingsAPI.updater.install()}
          className="bg-gradient-to-r from-violet-500 to-purple-500 text-white"
        >
          Download & Install
        </Button>
      );
    }
    if (status.state === 'downloaded' && !isMac) {
      return (
        <Button
          onClick={() => window.settingsAPI.updater.quitAndInstall()}
          className="bg-gradient-to-r from-violet-500 to-purple-500 text-white"
        >
          Restart to Install
        </Button>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-lg border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500"></div>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-lg">🔄</span>
          </div>
          <div>
            <CardTitle className="text-xl">Updates</CardTitle>
            <CardDescription className="text-sm">
              Current version: {version || '...'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/50 dark:border-slate-700/50">
          <p className="text-sm text-muted-foreground">{statusText(status)}</p>
          {renderAction()}
        </div>
      </CardContent>
    </Card>
  );
}
