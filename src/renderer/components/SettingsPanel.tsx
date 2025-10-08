import React, { useState } from 'react';
import { Settings } from '../../shared/types';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Input } from './ui/input';

interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState({ ...settings });

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Partial<Settings[K]>
  ) => {
    let finalValue = value;
    if (typeof value === 'object') { 
      finalValue = { ...localSettings[key] as object, ...value };
    }
    const newSettings = {
      ...localSettings, [key]: finalValue
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  // Update local settings when props change
  React.useEffect(() => {
    setLocalSettings({ ...settings });
  }, [settings]);

  return (
    <div className="space-y-6">
      {/* General Settings Card */}
      <Card className="shadow-lg border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500"></div>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">⚙️</span>
            </div>
            <div>
              <CardTitle className="text-xl">General Settings</CardTitle>
              <CardDescription className="text-sm">Configure the main CursorX functionality</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/50 dark:border-slate-700/50">
            <div className="space-y-1">
              <Label htmlFor="enable-cursorx" className="text-base font-semibold">Enable CursorX</Label>
              <p className="text-xs text-muted-foreground">Turn cursor enhancement on or off</p>
            </div>
            <Switch
              id="enable-cursorx"
              checked={localSettings.enabled}
              onCheckedChange={(enabled) => updateSetting('enabled', enabled)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-violet-500 data-[state=checked]:to-purple-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cursor Highlight Card */}
      <Card className="shadow-lg border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"></div>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">🎯</span>
            </div>
            <div>
              <CardTitle className="text-xl">Background Styles</CardTitle>
              <CardDescription className="text-sm">Customize the appearance of your cursor background</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold">Size</Label>
              </div>
              <span className="text-sm font-mono px-3 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                {localSettings.size}px
              </span>
            </div>
            <Slider
              value={[localSettings.size]}
              onValueChange={([size]) => updateSetting('size', size)}
              min={20}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-800" />

          <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-2 mb-3">
              <Label className="text-sm font-semibold">Color</Label>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Input
                  type="color"
                  value={localSettings.background.color}
                  onChange={(e) => updateSetting('background', { color: e.target.value })}
                  className="w-20 h-12 cursor-pointer rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary transition-colors"
                />
                <div className="absolute inset-0 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ boxShadow: `0 0 20px ${localSettings.background.color}` }} />
              </div>
              <Input
                type="text"
                value={localSettings.background.color}
                onChange={(e) => updateSetting('background', { color: e.target.value })}
                className="flex-1 font-mono text-sm h-12 rounded-xl"
                placeholder="#000000"
              />
            </div>
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-800" />

          <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold">Opacity</Label>
              </div>
              <span className="text-sm font-mono px-3 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                {Math.round(localSettings.background.opacity * 100)}%
              </span>
            </div>
            <Slider
              value={[localSettings.background.opacity]}
              onValueChange={([opacity]) => updateSetting('background', { opacity })}
              min={0.1}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Outline Styles Card */}
      <Card className="shadow-lg border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"></div>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">⭕</span>
            </div>
            <div>
              <CardTitle className="text-xl">Outline Styles</CardTitle>
              <CardDescription className="text-sm">Customize the appearance of your cursor outline</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-2 mb-3">
              <Label className="text-sm font-semibold">Color</Label>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Input
                  type="color"
                  value={localSettings.outline.color}
                  onChange={(e) => updateSetting('outline', { color: e.target.value })}
                  className="w-20 h-12 cursor-pointer rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary transition-colors"
                />
                <div className="absolute inset-0 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ boxShadow: `0 0 20px ${localSettings.outline.color}` }} />
              </div>
              <Input
                type="text"
                value={localSettings.outline.color}
                onChange={(e) => updateSetting('outline', { color: e.target.value })}
                className="flex-1 font-mono text-sm h-12 rounded-xl"
                placeholder="#000000"
              />
            </div>
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-800" />

          <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold">Opacity</Label>
              </div>
              <span className="text-sm font-mono px-3 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                {Math.round(localSettings.outline.opacity * 100)}%
              </span>
            </div>
            <Slider
              value={[localSettings.outline.opacity]}
              onValueChange={([opacity]) => updateSetting('outline', { opacity })}
              min={0.1}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-800" />

          <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold">Width</Label>
              </div>
              <span className="text-sm font-mono px-3 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                {localSettings.outline.width}px
              </span>
            </div>
            <Slider
              value={[localSettings.outline.width]}
              onValueChange={([width]) => updateSetting('outline', { width })}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-800" />

          <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold">Offset</Label>
              </div>
              <span className="text-sm font-mono px-3 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                {localSettings.outline.offset}px
              </span>
            </div>
            <Slider
              value={[localSettings.outline.offset]}
              onValueChange={([offset]) => updateSetting('outline', { offset })}
              min={0}
              max={20}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}