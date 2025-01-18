import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  MicrophoneIcon, 
  PhotoIcon,
  XMarkIcon,
  Bars3Icon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import MessageBubble from './MessageBubble';
import ParticleBackground from './ParticleBackground';
import AutoResizeTextarea from './AutoResizeTextarea';
import Sidebar from './Sidebar';
import SettingsPanel from './SettingsPanel';
import VoiceRecorder from './VoiceRecorder';
import FileUploader from './FileUploader';
import { generateResponse } from '../services/geminiService';
import useChatStore from '../store/chatStore';
import useThemeStore from '../store/themeStore';

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const {
    activeConversationId,
    addConversation,
    addMessage,
    getActiveConversation,
  } = useChatStore();

  const { getCurrentTheme, getFontSizeClass } = useThemeStore();
  const fontSizeClass = getFontSizeClass();

  useEffect(() => {
    if (!activeConversationId) {
      addConversation();
    }
  }, [activeConversationId, addConversation]);

  const activeChat = getActiveConversation();
  const messages = activeChat?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);
    scrollToBottom();

    try {
      const response = await generateResponse(userMessage.text);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'ai',
        timestamp: new Date(),
      };

      addMessage(aiMessage);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I encountered an error. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
        isError: true,
      };
      addMessage(errorMessage);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleVoiceMessage = (audioUrl) => {
    const voiceMessage = {
      id: Date.now(),
      type: 'voice',
      text: '[Voice Message]',
      audioUrl,
      sender: 'user',
      timestamp: new Date(),
    };
    
    addMessage(voiceMessage);
    setIsRecording(false);
    scrollToBottom();
  };

  const handleFileUpload = (files) => {
    files.forEach(({ file, preview }) => {
      const isImage = file.type.startsWith('image/');
      const fileMessage = {
        id: Date.now(),
        type: isImage ? 'image' : 'file',
        text: isImage 
          ? `![${file.name}](${preview})`
          : `[${file.name}](${URL.createObjectURL(file)})`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        sender: 'user',
        timestamp: new Date(),
      };
      
      addMessage(fileMessage);
    });
    
    setIsUploading(false);
    scrollToBottom();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(prev => !prev);
  };

  return (
    <div className="w-full h-screen">
      <ParticleBackground />

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <>
            <Sidebar isOpen={true} onClose={() => setIsSidebarOpen(false)} />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            />
          </>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence mode="wait">
        {isSettingsOpen && (
          <>
            <SettingsPanel isOpen={true} onClose={() => setIsSettingsOpen(false)} />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            />
          </>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <motion.div 
        layout
        className={`h-full flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'lg:pl-80' : ''
        }`}
      >
        {/* Chat Header */}
        <div className="h-16 border-b border-[color:var(--color-border)] glass sticky top-0 z-20">
          <div className="h-full px-4 max-w-6xl mx-auto w-full">
            <div className="flex items-center h-full gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-[color:var(--color-surface-hover)] transition-colors"
              >
                {isSidebarOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
              <h2 className="text-xl font-semibold text-gradient">
                {activeChat?.title || 'Neural Chat'}
              </h2>
              <div className="flex-1" />
              <button
                onClick={toggleSettings}
                className="p-2 rounded-lg hover:bg-[color:var(--color-surface-hover)] transition-colors"
              >
                <Cog6ToothIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <div className="max-w-6xl mx-auto w-full">
              <div className={`p-4 md:p-6 space-y-6 min-h-full ${fontSizeClass}`}>
                <AnimatePresence>
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      onDelete={() => {
                        const updatedMessages = messages.filter(m => m.id !== message.id);
                        // Update messages in the active chat
                      }}
                      onEdit={() => {
                        setInputValue(message.text);
                        // Remove the message from chat
                      }}
                      onShare={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'Neural Chat Message',
                            text: message.text
                          }).catch(console.error);
                        }
                      }}
                    />
                  ))}
                </AnimatePresence>
                
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex gap-2 items-center text-[color:var(--color-text-secondary)] p-2"
                  >
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200" />
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-[color:var(--color-border)] glass sticky bottom-0 z-20">
          <div className="max-w-6xl mx-auto w-full">
            <div className="p-4">
              {isRecording ? (
                <VoiceRecorder
                  onSave={handleVoiceMessage}
                  onCancel={() => setIsRecording(false)}
                />
              ) : isUploading ? (
                <FileUploader
                  onUpload={handleFileUpload}
                  onCancel={() => setIsUploading(false)}
                />
              ) : (
                <div className="flex items-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsRecording(true)}
                    className="p-3 rounded-xl bg-[color:var(--color-surface)] hover:bg-[color:var(--color-surface-hover)] transition-colors flex-shrink-0"
                    aria-label="Voice input"
                  >
                    <MicrophoneIcon className="w-6 h-6" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsUploading(true)}
                    className="p-3 rounded-xl bg-[color:var(--color-surface)] hover:bg-[color:var(--color-surface-hover)] transition-colors flex-shrink-0"
                    aria-label="Upload files"
                  >
                    <PhotoIcon className="w-6 h-6" />
                  </motion.button>

                  <div className="flex-1 relative">
                    <AutoResizeTextarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onSubmit={handleSendMessage}
                      disabled={isLoading}
                      placeholder="Type your message..."
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="px-4 py-3 rounded-xl bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-dark)]
                             transition-colors flex items-center gap-2 min-w-[100px]
                             disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Send</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;
