import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const themes = {
  dark: {
    id: 'dark',
    name: 'Dark',
    icon: '🌙'
  },
  light: {
    id: 'light',
    name: 'Light',
    icon: '☀️'
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    icon: '🤖'
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    icon: '🌲'
  }
};

const useThemeStore = create(
  persist(
    (set, get) => ({
      currentTheme: 'dark',
      fontSize: 'base',
      themes,

      setTheme: (themeId) => {
        document.documentElement.setAttribute('data-theme', themeId);
        set({ currentTheme: themeId });
      },

      setFontSize: (size) => {
        set({ fontSize: size });
      },

      getCurrentTheme: () => {
        const state = get();
        return themes[state.currentTheme];
      },

      getFontSizeClass: () => {
        const state = get();
        return {
          sm: 'text-sm',
          base: 'text-base',
          lg: 'text-lg'
        }[state.fontSize] || 'text-base';
      }
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Apply theme when store is rehydrated
        if (state) {
          document.documentElement.setAttribute('data-theme', state.currentTheme);
        }
      }
    }
  )
);

export default useThemeStore;
