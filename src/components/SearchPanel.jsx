import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  CalendarIcon,
  PhotoIcon,
  DocumentIcon,
  MicrophoneIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import useChatStore from '../store/chatStore';

const SearchPanel = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    text: true,
    images: true,
    files: true,
    voice: true,
    code: true,
    startDate: '',
    endDate: '',
  });

  const { getAllMessages } = useChatStore();
  const allMessages = getAllMessages();

  const filteredMessages = useMemo(() => {
    return allMessages.filter(message => {
      // Text search
      const matchesQuery = message.text.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesQuery) return false;

      // Type filters
      if (message.type === 'image' && !filters.images) return false;
      if (message.type === 'file' && !filters.files) return false;
      if (message.type === 'voice' && !filters.voice) return false;
      if (message.text.includes('```') && !filters.code) return false;
      if (!message.type && !filters.text) return false;

      // Date filters
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        if (new Date(message.timestamp) < startDate) return false;
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        if (new Date(message.timestamp) > endDate) return false;
      }

      return true;
    });
  }, [allMessages, searchQuery, filters]);

  const toggleFilter = (key) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDateChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          className="fixed inset-y-0 right-0 w-96 bg-[color:var(--color-surface)] border-l border-[color:var(--color-border)] z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="h-16 border-b border-[color:var(--color-border)] flex items-center justify-between px-4">
            <h2 className="text-lg font-semibold">Search Messages</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[color:var(--color-surface-hover)] transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[color:var(--color-text-secondary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[color:var(--color-surface-hover)] focus:ring-2 ring-[color:var(--color-primary)] outline-none transition-all"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-t border-[color:var(--color-border)]">
            <div className="flex items-center gap-2 mb-4">
              <FunnelIcon className="w-5 h-5" />
              <span className="font-medium">Filters</span>
            </div>

            <div className="space-y-4">
              {/* Message Types */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleFilter('text')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
                    filters.text 
                      ? 'bg-[color:var(--color-primary)] text-white'
                      : 'bg-[color:var(--color-surface-hover)]'
                  }`}
                >
                  <span className="text-sm">Text</span>
                </button>
                <button
                  onClick={() => toggleFilter('images')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
                    filters.images
                      ? 'bg-[color:var(--color-primary)] text-white'
                      : 'bg-[color:var(--color-surface-hover)]'
                  }`}
                >
                  <PhotoIcon className="w-4 h-4" />
                  <span className="text-sm">Images</span>
                </button>
                <button
                  onClick={() => toggleFilter('files')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
                    filters.files
                      ? 'bg-[color:var(--color-primary)] text-white'
                      : 'bg-[color:var(--color-surface-hover)]'
                  }`}
                >
                  <DocumentIcon className="w-4 h-4" />
                  <span className="text-sm">Files</span>
                </button>
                <button
                  onClick={() => toggleFilter('voice')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
                    filters.voice
                      ? 'bg-[color:var(--color-primary)] text-white'
                      : 'bg-[color:var(--color-surface-hover)]'
                  }`}
                >
                  <MicrophoneIcon className="w-4 h-4" />
                  <span className="text-sm">Voice</span>
                </button>
                <button
                  onClick={() => toggleFilter('code')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
                    filters.code
                      ? 'bg-[color:var(--color-primary)] text-white'
                      : 'bg-[color:var(--color-surface-hover)]'
                  }`}
                >
                  <CodeBracketIcon className="w-4 h-4" />
                  <span className="text-sm">Code</span>
                </button>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Date Range</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-[color:var(--color-surface-hover)] outline-none"
                  />
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-[color:var(--color-surface-hover)] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-4 border-t border-[color:var(--color-border)]">
            <div className="text-sm text-[color:var(--color-text-secondary)] mb-4">
              {filteredMessages.length} results found
            </div>
            <div className="space-y-4">
              {filteredMessages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-[color:var(--color-surface-hover)]"
                >
                  <div className="text-sm mb-1">{message.text}</div>
                  <div className="text-xs text-[color:var(--color-text-secondary)]">
                    {new Date(message.timestamp).toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchPanel;
