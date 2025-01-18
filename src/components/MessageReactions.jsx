import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaceSmileIcon } from '@heroicons/react/24/outline';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const defaultReactions = ['👍', '❤️', '😄', '🎉', '🤔', '👀', '🚀', '💯'];

const MessageReactions = ({ message, onAddReaction, onRemoveReaction }) => {
  const [showPicker, setShowPicker] = useState(false);
  const reactions = message.reactions || {};

  const handleAddReaction = (emoji) => {
    onAddReaction(emoji);
    setShowPicker(false);
  };

  const handleToggleReaction = (emoji) => {
    if (reactions[emoji]?.includes('user')) {
      onRemoveReaction(emoji);
    } else {
      onAddReaction(emoji);
    }
  };

  return (
    <div className="relative">
      {/* Quick Reactions */}
      <div className="flex items-center gap-1 mt-2">
        {Object.entries(reactions).map(([emoji, users]) => (
          <motion.button
            key={emoji}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            onClick={() => handleToggleReaction(emoji)}
            className={`px-2 py-1 rounded-full text-sm 
              ${users.includes('user')
                ? 'bg-[color:var(--color-primary)] text-white'
                : 'bg-[color:var(--color-surface-hover)]'
              } hover:bg-[color:var(--color-primary)] hover:text-white transition-colors`}
          >
            <span className="mr-1">{emoji}</span>
            <span className="text-xs">{users.length}</span>
          </motion.button>
        ))}

        {/* Add Reaction Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowPicker(prev => !prev)}
          className="p-1.5 rounded-full hover:bg-[color:var(--color-surface-hover)] transition-colors"
        >
          <FaceSmileIcon className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Quick Reaction Panel */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-full mb-2 right-0 z-50"
          >
            <div className="p-2 rounded-xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)] shadow-xl">
              {/* Quick Reactions */}
              <div className="grid grid-cols-4 gap-1 p-2 border-b border-[color:var(--color-border)]">
                {defaultReactions.map(emoji => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAddReaction(emoji)}
                    className="p-2 rounded-lg hover:bg-[color:var(--color-surface-hover)] transition-colors text-xl"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>

              {/* Full Emoji Picker */}
              <div className="p-2">
                <Picker
                  data={data}
                  onEmojiSelect={(emoji) => handleAddReaction(emoji.native)}
                  theme="dark"
                  skinTonePosition="none"
                  previewPosition="none"
                  searchPosition="none"
                  maxFrequentRows={0}
                  perLine={8}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageReactions;
