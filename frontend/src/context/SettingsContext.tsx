import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
  assistantName: string;
  systemPersona: string;
  memoryEnabled: boolean;
  theme: 'dark' | 'light';
  voiceActive: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateAssistantName: (name: string) => void;
  updateSystemPersona: (persona: string) => void;
  toggleMemory: () => void;
  toggleTheme: () => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  assistantName: 'Saarthi AI',
  systemPersona: 'You are Saarthi AI, a highly intuitive and powerful agentic companion. Act as a practical digital helper, prioritizing logic, deep understanding, clear explanations, and clean code output. Address the user with respect, use formatting where useful, and remember context across exchanges.',
  memoryEnabled: true,
  theme: 'dark',
  voiceActive: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem('saarthi_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        // Fallback to default
      }
    }
  }, []);

  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('saarthi_settings', JSON.stringify(newSettings));
  };

  const updateAssistantName = (name: string) => {
    saveSettings({ ...settings, assistantName: name });
  };

  const updateSystemPersona = (persona: string) => {
    saveSettings({ ...settings, systemPersona: persona });
  };

  const toggleMemory = () => {
    saveSettings({ ...settings, memoryEnabled: !settings.memoryEnabled });
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    saveSettings({ ...settings, theme: nextTheme });
    
    // Apply class to html tag for Tailwind
    const root = window.document.documentElement;
    if (nextTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const resetSettings = () => {
    saveSettings(defaultSettings);
    const root = window.document.documentElement;
    root.classList.add('dark'); // defaults to dark theme
  };

  useEffect(() => {
    // Initial theme classes check
    const root = window.document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  const value = {
    settings,
    updateAssistantName,
    updateSystemPersona,
    toggleMemory,
    toggleTheme,
    resetSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
