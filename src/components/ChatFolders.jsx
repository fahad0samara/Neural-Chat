import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderIcon,
  FolderPlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import useChatStore from '../store/chatStore';

const ChatFolders = () => {
  const [folders, setFolders] = useState([
    { id: 'default', name: 'All Chats', isDefault: true, isOpen: true },
    { id: 'important', name: 'Important', isOpen: false },
    { id: 'archived', name: 'Archived', isOpen: false },
  ]);
  const [isEditing, setIsEditing] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);

  const { 
    conversations,
    activeConversationId,
    setActiveConversation,
    updateConversation
  } = useChatStore();

  const handleFolderClick = (folderId) => {
    setFolders(prev => prev.map(f => ({
      ...f,
      isOpen: f.id === folderId ? !f.isOpen : f.isOpen
    })));
  };

  const handleEditFolder = (e, folder) => {
    e.stopPropagation();
    setIsEditing(folder.id);
    setNewFolderName(folder.name);
  };

  const handleSaveFolder = (e, folderId) => {
    e.stopPropagation();
    if (newFolderName.trim()) {
      setFolders(prev => prev.map(f => 
        f.id === folderId ? { ...f, name: newFolderName } : f
      ));
    }
    setIsEditing(null);
    setNewFolderName('');
  };

  const handleDeleteFolder = (e, folderId) => {
    e.stopPropagation();
    // Move all conversations to default folder
    conversations
      .filter(c => c.folderId === folderId)
      .forEach(c => {
        updateConversation(c.id, { ...c, folderId: 'default' });
      });
    
    setFolders(prev => prev.filter(f => f.id !== folderId));
  };

  const handleNewFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now().toString(),
        name: newFolderName,
        isOpen: true,
      };
      setFolders(prev => [...prev, newFolder]);
      setNewFolderName('');
      setShowNewFolder(false);
    }
  };

  const handleMoveToFolder = (e, conversationId, folderId) => {
    e.stopPropagation();
    updateConversation(conversationId, { folderId });
  };

  return (
    <div className="space-y-2">
      {/* Folder List */}
      {folders.map(folder => (
        <div key={folder.id}>
          <motion.div
            onClick={() => handleFolderClick(folder.id)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-[color:var(--color-surface-hover)] cursor-pointer group"
          >
            <div className="w-5">
              {folder.isOpen ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </div>
            <FolderIcon className="w-5 h-5" />
            
            {isEditing === folder.id ? (
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveFolder(e, folder.id)}
                onBlur={(e) => handleSaveFolder(e, folder.id)}
                className="flex-1 bg-transparent outline-none"
                autoFocus
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <span className="flex-1">{folder.name}</span>
            )}

            {!folder.isDefault && (
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                <button
                  onClick={(e) => handleEditFolder(e, folder)}
                  className="p-1 rounded hover:bg-[color:var(--color-surface)] transition-colors"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleDeleteFolder(e, folder.id)}
                  className="p-1 rounded hover:bg-[color:var(--color-surface)] transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Conversations in Folder */}
          <AnimatePresence>
            {folder.isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-7 space-y-1"
              >
                {conversations
                  .filter(c => c.folderId === folder.id)
                  .map(conversation => (
                    <motion.div
                      key={conversation.id}
                      onClick={() => setActiveConversation(conversation.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer group
                        ${conversation.id === activeConversationId
                          ? 'bg-[color:var(--color-primary)] text-white'
                          : 'hover:bg-[color:var(--color-surface-hover)]'
                        }`}
                    >
                      <ChatBubbleLeftRightIcon className="w-5 h-5" />
                      <span className="flex-1 truncate">
                        {conversation.title || 'New Chat'}
                      </span>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* New Folder Button */}
      {showNewFolder ? (
        <div className="flex items-center gap-2 p-2">
          <FolderPlusIcon className="w-5 h-5" />
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNewFolder()}
            onBlur={handleNewFolder}
            placeholder="Folder name..."
            className="flex-1 bg-transparent outline-none"
            autoFocus
          />
        </div>
      ) : (
        <button
          onClick={() => setShowNewFolder(true)}
          className="flex items-center gap-2 p-2 w-full rounded-lg hover:bg-[color:var(--color-surface-hover)] transition-colors"
        >
          <FolderPlusIcon className="w-5 h-5" />
          <span>New Folder</span>
        </button>
      )}
    </div>
  );
};

export default ChatFolders;
