import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  PlayIcon, 
  PauseIcon,
  DocumentIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import MessageActions from './MessageActions';
import MessageReactions from './MessageReactions';
import MessageThread from './MessageThread';
import CodeSandbox from './CodeSandbox';
import useThemeStore from '../store/themeStore';
import useChatStore from '../store/chatStore';

const MessageBubble = ({ message, onDelete, onEdit, onShare, isReply }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThread, setShowThread] = useState(false);
  const { getFontSizeClass } = useThemeStore();
  const { updateMessage } = useChatStore();
  const fontSizeClass = getFontSizeClass();
  const isAI = message.sender === 'ai';

  const handlePlayPause = () => {
    const audio = new Audio(message.audioUrl);
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
      audio.onended = () => setIsPlaying(false);
    }
    setIsPlaying(!isPlaying);
  };

  const handleAddReaction = (emoji) => {
    const reactions = message.reactions || {};
    const users = reactions[emoji] || [];
    
    if (!users.includes('user')) {
      updateMessage(message.conversationId, message.id, {
        reactions: {
          ...reactions,
          [emoji]: [...users, 'user']
        }
      });
    }
  };

  const handleRemoveReaction = (emoji) => {
    const reactions = message.reactions || {};
    const users = reactions[emoji] || [];
    
    updateMessage(message.conversationId, message.id, {
      reactions: {
        ...reactions,
        [emoji]: users.filter(u => u !== 'user')
      }
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderContent = () => {
    switch (message.type) {
      case 'voice':
        return (
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className="p-3 rounded-full bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-dark)] transition-colors"
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </button>
            <div className="text-sm">Voice Message</div>
          </div>
        );
      
      case 'file':
        return (
          <div className="flex items-center gap-3">
            <DocumentIcon className="w-10 h-10 p-2 rounded bg-[color:var(--color-surface)]" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm">{message.fileName}</p>
              <p className="text-xs text-[color:var(--color-text-secondary)]">
                {formatFileSize(message.fileSize)}
              </p>
            </div>
            <a
              href={message.text.match(/\((.*?)\)/)[1]}
              download={message.fileName}
              className="p-2 rounded-lg hover:bg-[color:var(--color-surface)] transition-colors"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
            </a>
          </div>
        );
      
      default:
        return (
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const code = String(children).replace(/\n$/, '');
                
                return !inline && match ? (
                  <>
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg my-2"
                      {...props}
                    >
                      {code}
                    </SyntaxHighlighter>
                    <CodeSandbox 
                      code={code}
                      language={match[1]}
                    />
                  </>
                ) : (
                  <code 
                    className="bg-black/20 px-1 py-0.5 rounded"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              p: ({ children }) => (
                <p className="mb-2 last:mb-0">
                  {children}
                </p>
              ),
              a: ({ children, href }) => (
                <a 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[color:var(--color-primary)] hover:underline"
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-2 space-y-1">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-2 space-y-1">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="ml-2">{children}</li>
              ),
              img: ({ src, alt }) => (
                <img 
                  src={src} 
                  alt={alt} 
                  className="max-w-full rounded-lg my-2 max-h-[300px] object-contain"
                />
              ),
            }}
            className={`whitespace-pre-wrap ${fontSizeClass}`}
          >
            {message.text}
          </ReactMarkdown>
        );
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`flex ${isAI ? 'justify-start' : 'justify-end'} group relative`}
      >
        <div className={`message-bubble ${isAI ? 'ai-message' : 'user-message'} ${message.isError ? 'border border-red-500/50' : ''}`}>
          {renderContent()}

          <div className="flex items-center justify-between gap-4 mt-1">
            <div className="text-[10px] text-[color:var(--color-text-secondary)]">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>

            {!isReply && (
              <button
                onClick={() => setShowThread(true)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-[color:var(--color-surface-hover)] transition-all flex items-center gap-1"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                {message.thread?.length > 0 && (
                  <span className="text-xs">{message.thread.length}</span>
                )}
              </button>
            )}
          </div>

          <MessageActions
            message={message}
            onDelete={onDelete}
            onEdit={onEdit}
            onShare={onShare}
          />

          <MessageReactions
            message={message}
            onAddReaction={handleAddReaction}
            onRemoveReaction={handleRemoveReaction}
          />
        </div>
      </motion.div>

      {showThread && (
        <MessageThread 
          message={message}
          onClose={() => setShowThread(false)}
        />
      )}
    </>
  );
};

export default MessageBubble;
