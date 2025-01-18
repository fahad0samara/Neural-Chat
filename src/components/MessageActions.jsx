import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  ClipboardIcon, 
  PencilIcon,
  TrashIcon,
  ShareIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid';
import { useState } from 'react';

const MessageActions = ({ message, onDelete, onEdit, onShare }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Add like animation here
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Add bookmark animation here
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-1 absolute -bottom-4 left-0 bg-black/40 
                 backdrop-blur-xl rounded-full px-2 py-1 border border-white/10
                 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <button
        onClick={handleLike}
        className="p-1 hover:bg-white/10 rounded-full transition-colors"
        title="Like"
      >
        {isLiked ? (
          <HeartIconSolid className="w-4 h-4 text-red-500" />
        ) : (
          <HeartIcon className="w-4 h-4" />
        )}
      </button>

      <button
        onClick={handleCopy}
        className="p-1 hover:bg-white/10 rounded-full transition-colors relative"
        title="Copy to clipboard"
      >
        <ClipboardIcon className="w-4 h-4" />
        {showCopied && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 
                     rounded bg-black/60 text-xs whitespace-nowrap"
          >
            Copied!
          </motion.div>
        )}
      </button>

      {message.sender === 'user' && (
        <button
          onClick={onEdit}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
          title="Edit message"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
      )}

      <button
        onClick={onDelete}
        className="p-1 hover:bg-white/10 rounded-full transition-colors"
        title="Delete message"
      >
        <TrashIcon className="w-4 h-4" />
      </button>

      <button
        onClick={onShare}
        className="p-1 hover:bg-white/10 rounded-full transition-colors"
        title="Share message"
      >
        <ShareIcon className="w-4 h-4" />
      </button>

      <button
        onClick={handleBookmark}
        className="p-1 hover:bg-white/10 rounded-full transition-colors"
        title="Bookmark message"
      >
        {isBookmarked ? (
          <BookmarkIconSolid className="w-4 h-4 text-primary" />
        ) : (
          <BookmarkIcon className="w-4 h-4" />
        )}
      </button>
    </motion.div>
  );
};

export default MessageActions;
