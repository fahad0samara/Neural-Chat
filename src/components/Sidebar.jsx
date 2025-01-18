import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import ChatFolders from './ChatFolders';
import SearchPanel from './SearchPanel';
import useChatStore from '../store/chatStore';

const Sidebar = ({ isOpen, onClose }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { addConversation } = useChatStore();

  const handleNewChat = () => {
    addConversation();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -300 }}
        className="fixed inset-y-0 left-0 w-80 bg-[color:var(--color-surface)] border-r border-[color:var(--color-border)] z-40"
      >
        {/* Header */}
        <div className="h-16 border-b border-[color:var(--color-border)] flex items-center justify-between px-4">
          <h1 className="text-xl font-bold text-gradient">Neural Chat</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-[color:var(--color-surface-hover)] transition-colors"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[color:var(--color-surface-hover)] transition-colors lg:hidden"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-dark)] text-white transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat Folders */}
        <div className="flex-1 overflow-y-auto p-2">
          <ChatFolders />
        </div>
      </motion.div>

      {/* Search Panel */}
      <SearchPanel 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Sidebar;
