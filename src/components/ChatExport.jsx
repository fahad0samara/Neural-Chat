import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDownTrayIcon,
  DocumentIcon,
  CodeBracketIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import useChatStore from '../store/chatStore';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ChatExport = ({ conversationId, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState('pdf');
  const { conversations } = useChatStore();

  const conversation = conversations.find(c => c.id === conversationId);
  if (!conversation) return null;

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatMessage = (message) => {
    switch (message.type) {
      case 'voice':
        return '[Voice Message]';
      case 'file':
        return `[File: ${message.fileName}]`;
      default:
        return message.text;
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text(conversation.title || 'Chat Export', 20, 20);
      
      // Metadata
      doc.setFontSize(12);
      doc.text(`Exported on: ${formatTimestamp(new Date())}`, 20, 30);
      doc.text(`Total Messages: ${conversation.messages.length}`, 20, 40);

      // Messages
      doc.autoTable({
        startY: 50,
        head: [['Time', 'Sender', 'Message']],
        body: conversation.messages.map(msg => [
          formatTimestamp(msg.timestamp),
          msg.sender === 'ai' ? 'Assistant' : 'You',
          formatMessage(msg)
        ]),
        styles: {
          overflow: 'linebreak',
          cellWidth: 'wrap'
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 30 },
          2: { cellWidth: 'auto' }
        }
      });

      // Download
      doc.save(`chat-export-${conversation.id}.pdf`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = () => {
    setIsExporting(true);
    try {
      const data = {
        id: conversation.id,
        title: conversation.title,
        createdAt: conversation.timestamp,
        messages: conversation.messages.map(msg => ({
          id: msg.id,
          sender: msg.sender,
          type: msg.type,
          text: msg.text,
          timestamp: msg.timestamp,
          reactions: msg.reactions
        }))
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-export-${conversation.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export JSON:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = () => {
    if (format === 'pdf') {
      exportToPDF();
    } else {
      exportToJSON();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-[color:var(--color-surface)] rounded-xl p-6 max-w-md w-full shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Export Chat</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[color:var(--color-surface-hover)] transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setFormat('pdf')}
            className={`p-4 rounded-xl border-2 transition-colors flex flex-col items-center gap-2
              ${format === 'pdf'
                ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/10'
                : 'border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]'
              }`}
          >
            <DocumentIcon className="w-8 h-8" />
            <span>PDF Document</span>
          </button>

          <button
            onClick={() => setFormat('json')}
            className={`p-4 rounded-xl border-2 transition-colors flex flex-col items-center gap-2
              ${format === 'json'
                ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/10'
                : 'border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]'
              }`}
          >
            <CodeBracketIcon className="w-8 h-8" />
            <span>JSON Data</span>
          </button>
        </div>

        {/* Export Info */}
        <div className="mb-6 p-4 rounded-lg bg-[color:var(--color-surface-hover)]">
          <h3 className="font-medium mb-2">Export Information</h3>
          <ul className="text-sm space-y-1 text-[color:var(--color-text-secondary)]">
            <li>• Chat Title: {conversation.title || 'Untitled'}</li>
            <li>• Total Messages: {conversation.messages.length}</li>
            <li>• Created: {formatTimestamp(conversation.timestamp)}</li>
          </ul>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full p-3 rounded-xl bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-dark)] text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          <span>
            {isExporting 
              ? `Exporting ${format.toUpperCase()}...` 
              : `Export as ${format.toUpperCase()}`
            }
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ChatExport;
