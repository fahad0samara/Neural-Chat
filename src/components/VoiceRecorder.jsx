import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MicrophoneIcon, 
  StopIcon, 
  XMarkIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';

const VoiceRecorder = ({ onSave, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        audioRef.current.src = url;
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSave = () => {
    if (audioUrl) {
      onSave(audioUrl);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-xl bg-[color:var(--color-surface)] min-w-[200px]">
      {/* Recording Time */}
      <div className="text-2xl font-medium text-[color:var(--color-text)]">
        {formatTime(recordingTime)}
      </div>

      {/* Visualizer (placeholder) */}
      <div className="w-full h-8 bg-[color:var(--color-surface-hover)] rounded-lg overflow-hidden">
        <motion.div
          className="h-full bg-[color:var(--color-primary)]"
          animate={{
            width: isRecording ? ['0%', '100%'] : '0%',
          }}
          transition={{
            duration: 2,
            repeat: isRecording ? Infinity : 0,
            ease: 'linear',
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {!audioUrl ? (
          <>
            {!isRecording ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={startRecording}
                className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <MicrophoneIcon className="w-6 h-6" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={stopRecording}
                className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <StopIcon className="w-6 h-6" />
              </motion.button>
            )}
          </>
        ) : (
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlayPause}
              className="p-3 rounded-full bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-dark)] transition-colors"
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-dark)] transition-colors"
            >
              Send
            </motion.button>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onCancel}
          className="p-3 rounded-full hover:bg-[color:var(--color-surface-hover)] transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
};

export default VoiceRecorder;
