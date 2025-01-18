import { useEffect, useRef } from 'react';

const AutoResizeTextarea = ({ value, onChange, onSubmit, disabled, placeholder }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Set new height
    const newHeight = Math.min(textarea.scrollHeight, 200); // Max height of 200px
    textarea.style.height = `${newHeight}px`;
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      placeholder={placeholder}
      rows={1}
      className="w-full bg-white/5 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 
                 focus:ring-white/10 placeholder-white/30 resize-none overflow-y-auto
                 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent
                 disabled:opacity-50 disabled:cursor-not-allowed
                 min-h-[48px] max-h-[200px]"
      style={{
        lineHeight: '1.5',
      }}
    />
  );
};

export default AutoResizeTextarea;
