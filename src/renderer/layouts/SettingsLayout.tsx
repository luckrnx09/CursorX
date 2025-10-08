import React, { useState, useEffect } from 'react';
import { SettingsPanel } from '../components/SettingsPanel';

import { Settings } from '../../shared/types';

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  size: 80,
  background: {
    color: "#13bef6",
    opacity: 0.5,
  },
  outline: {
    offset: 2,
    width: 5,
    color: "#00FF00",
    opacity: 0.5,
  },
};

export function SettingsLayout() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  // Apply dark mode on mount and when it changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('cursorx-theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
    }
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (window.settingsAPI) {
          const currentSettings = await window.settingsAPI.settings.get();
          setSettings(currentSettings);
          
          // Setup listener for settings updates
          window.settingsAPI.settings.onUpdated((updatedSettings) => {
            setSettings(updatedSettings);
          });
        } else { 
          setSettings(DEFAULT_SETTINGS);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSettingsChange = async (newSettings: Settings) => {
    try {
      if (window.settingsAPI) {
        await window.settingsAPI.settings.set(newSettings);
      }
      setSettings(newSettings);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary/40 rounded-full animate-spin [animation-duration:1.5s]" />
        </div>
        <p className="mt-6 text-foreground/80 text-lg font-medium animate-pulse">Loading settings...</p>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8 text-center">
        <div className="max-w-md space-y-6 p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-destructive/20">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
            <p className="text-base text-muted-foreground">Failed to load settings. Please restart the application.</p>
          </div>
          <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
            <p className="text-sm text-destructive font-mono">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="select-none min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-y-auto">
      {/* Modern Header with Glass Morphism */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl blur-xl opacity-20"></div>
                <div className="relative w-24 h-24  flex items-center justify-center">
                  <img src="../../assets/icon.svg" alt="CursorX Logo" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  CursorX
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Professional cursor enhancement
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center space-y-4 mb-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Customize Your Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fine-tune your cursor highlighting and click visualization effects for optimal visibility and style
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
          {/* Settings Panel */}
           <SettingsPanel
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Made with <span className="text-red-500 animate-pulse">❤️</span> for better cursor visibility
            </p>
            <p className="text-xs text-muted-foreground/60">
              © 2025 CursorX. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}