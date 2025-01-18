import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DocumentIcon, 
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

const FileUploader = ({ onUpload, onCancel }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      id: Math.random().toString(36).substring(7)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setFiles(prev => {
      const updatedFiles = prev.filter(f => f.id !== id);
      // Cleanup previews
      prev.forEach(f => {
        if (f.id === id && f.preview) {
          URL.revokeObjectURL(f.preview);
        }
      });
      return updatedFiles;
    });
  };

  const handleUpload = () => {
    if (files.length > 0) {
      onUpload(files);
      setFiles([]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-4 rounded-xl bg-[color:var(--color-surface)] min-w-[300px] max-w-[500px]">
      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          ${dragActive 
            ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/10' 
            : 'border-[color:var(--color-border)]'
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleChange}
          className="hidden"
        />
        
        <ArrowUpTrayIcon className="w-12 h-12 mx-auto mb-4 text-[color:var(--color-text-secondary)]" />
        <p className="text-[color:var(--color-text)]">
          Drop files here or click to upload
        </p>
        <p className="text-sm text-[color:var(--color-text-secondary)]">
          Supports images, documents, and more
        </p>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {files.map(({ file, preview, id }) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-[color:var(--color-surface-hover)]"
              >
                {preview ? (
                  <img 
                    src={preview} 
                    alt={file.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                ) : (
                  <DocumentIcon className="w-10 h-10 p-2 rounded bg-[color:var(--color-surface)]" />
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm">{file.name}</p>
                  <p className="text-xs text-[color:var(--color-text-secondary)]">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(id);
                  }}
                  className="p-1 rounded-full hover:bg-[color:var(--color-surface)] transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </motion.div>
            ))}

            {/* Upload Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-end gap-2 mt-4"
            >
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg hover:bg-[color:var(--color-surface-hover)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 rounded-lg bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-dark)] transition-colors"
              >
                Upload {files.length} {files.length === 1 ? 'file' : 'files'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;
