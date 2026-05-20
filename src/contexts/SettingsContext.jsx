import { createContext, useContext, useEffect, useState } from 'react';

const defaultSettings = {
  themeMode: 'light',
  themeColor: '#D6AD60', // Gold
  collapseSidebar: false,
  inquiryAlerts: true,
  bookingAlerts: true,
  currency: 'inr',
  timezone: 'ist',
  dateFormat: 'ddmm'
};

const SettingsContext = createContext(undefined);

export function SettingsProvider({ children }) {
  // Load initial settings from localStorage, or fallback to defaults
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('tk_admin_settings');
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Failed to parse settings from local storage', error);
    }
    return defaultSettings;
  });

  // Update a single setting
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Persist to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('tk_admin_settings', JSON.stringify(settings));
  }, [settings]);

  // Apply Theme Mode (Light/Dark) to HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.themeMode]);

  // Apply Theme Colors to HTML element using data-theme attribute
  useEffect(() => {
    const root = document.documentElement;
    // We map the hex color codes to a specific theme name
    let themeName = 'gold';
    if (settings.themeColor === '#F4EBD0') themeName = 'cream';
    else if (settings.themeColor === '#122620') themeName = 'green';
    
    root.setAttribute('data-theme', themeName);
  }, [settings.themeColor]);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
