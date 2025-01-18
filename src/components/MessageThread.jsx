import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  ArrowSmallLeftIcon,
} from '@heroicons/react/24/outline';
import MessageBubble from './MessageBubble';
import useChatStore from '../store/chatStore';

const MessageThread = ({ message, onClose }) => {
  const [newReply, setNewReply] = useState('');
  const { updateMessage } = useChatStore();

  const handleAddReply = (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    const reply = {
      id: Date.now().toString(),
      text: newReply,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    const thread = message.thread || [];
    updateMessage(message.conversationId, message.id, {
      thread: [...thread, reply]
    });

    setNewReply('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="bg-[color:var(--color-surface)] w-full max-w-2xl h-[80vh] rounded-xl shadow-xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[color:var(--color-border)]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[color:var(--color-surface-hover)] transition-colors"
            >
              <ArrowSmallLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-medium">Message Thread</h2>
              <p className="text-sm text-[color:var(--color-text-secondary)]">
                {message.thread?.length || 0} replies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[color:var(--color-surface-hover)] transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Thread Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Original Message */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[color:var(--color-primary)]" />
            <div className="ml-4">
              <MessageBubble message={message} />
            </div>
          </div>

          {/* Replies */}
          <div className="space-y-4 ml-8">
            {message.thread?.map(reply => (
              <MessageBubble
                key={reply.id}
                message={reply}
                isReply
              />
            ))}

            {!message.thread?.length && (
              <div className="text-center text-[color:var(--color-text-secondary)] py-8">
                No replies yet. Start the conversation!
              </div>
            )}
          </div>
        </div>

        {/* Reply Input */}
        <form onSubmit={handleAddReply} className="p-4 border-t border-[color:var(--color-border)]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newReply}
              onChange={e => setNewReply(e.target.value)}
              placeholder="Type your reply..."
              className="flex-1 bg-[color:var(--color-surface-hover)] rounded-xl px-4 py-3 outline-none"
            />
            <button
              type="submit"
              disabled={!newReply.trim()}
              className="px-4 py-3 rounded-xl bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-dark)] text-white transition-colors disabled:opacity-50"
            >
              Reply
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MessageThread;
