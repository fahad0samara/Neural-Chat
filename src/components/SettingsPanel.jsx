import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import useThemeStore from '../store/themeStore';

const SettingsPanel = ({ isOpen, onClose }) => {
  const { themes, currentTheme, fontSize, setTheme, setFontSize } = useThemeStore();

  const fontSizes = [
    { value: 'sm', label: 'Small' },
    { value: 'base', label: 'Medium' },
    { value: 'lg', label: 'Large' },
  ];

  return (
    <motion.div
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed right-0 top-0 h-full w-80 bg-black/40 backdrop-blur-xl border-l border-white/10 z-40 flex flex-col"
    >
      {/* Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-4">
        <h2 className="text-xl font-semibold">Settings</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Theme Selection */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Theme</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={`p-3 rounded-xl border transition-all ${
                  currentTheme === key
                    ? 'border-primary bg-primary/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <span>{theme.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Font Size</h3>
          <div className="flex gap-2">
            {fontSizes.map(size => (
              <button
                key={size.value}
                onClick={() => setFontSize(size.value)}
                className={`flex-1 p-2 rounded-lg border transition-all ${
                  fontSize === size.value
                    ? 'border-primary bg-primary/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Keyboard Shortcuts</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>New Chat</span>
              <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10">⌘ N</kbd>
            </div>
            <div className="flex justify-between">
              <span>Toggle Sidebar</span>
              <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10">⌘ B</kbd>
            </div>
            <div className="flex justify-between">
              <span>Search</span>
              <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10">⌘ K</kbd>
            </div>
            <div className="flex justify-between">
              <span>Settings</span>
              <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10">⌘ ,</kbd>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">About</h3>
          <div className="p-4 rounded-xl bg-white/5 space-y-2">
            <p className="text-sm text-white/60">
              Neural Chat v1.0.0
            </p>
            <p className="text-sm text-white/60">
              Built with React, Tailwind CSS, and Gemini AI
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPanel;
