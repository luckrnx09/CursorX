import { useEffect, useState } from 'react';
import { UpdateStatus } from '../../shared/types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

const statusText = (status: UpdateStatus | null): string => {
  if (!status) return '';
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

  const renderButton = () => {
    if (status?.state === 'checking') {
      return <Button disabled>Checking...</Button>;
    }
    if (status?.state === 'available') {
      return isMac ? (
        <Button onClick={() => window.settingsAPI.updater.install()}>Download & Install</Button>
      ) : (
        <Button disabled>Downloading...</Button>
      );
    }
    if (status?.state === 'downloading') {
      return <Button disabled>Downloading... {status.percent}%</Button>;
    }
    if (status?.state === 'downloaded') {
      return isMac ? (
        <Button disabled>Installing...</Button>
      ) : (
        <Button onClick={() => window.settingsAPI.updater.quitAndInstall()}>
          Restart to Install
        </Button>
      );
    }
    return (
      <Button variant="outline" onClick={() => void window.settingsAPI.updater.check()}>
        Check for Updates
      </Button>
    );
  };

  return (
    <Card className="shadow-lg border-slate-200/50 dark:border-slate-800/50">
      <CardContent className="flex flex-col items-center gap-2 py-6 text-center">
        <p className="text-sm font-semibold">CursorX {version}</p>
        {status && <p className="text-xs text-muted-foreground">{statusText(status)}</p>}
        <div className="mt-2">{renderButton()}</div>
      </CardContent>
    </Card>
  );
}
