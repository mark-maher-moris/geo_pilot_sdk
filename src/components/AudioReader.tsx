import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AutoBlogifyConfig, BlogPost } from '../types';

export interface AudioReaderProps {
  post: BlogPost;
  config: AutoBlogifyConfig;
  className?: string;
  style?: any;
}

const DEFAULT_COLORS = {
  primary: '#3B82F6', secondary: '#6B7280', accent: '#10B981', background: '#FFFFFF',
  surface: '#F9FAFB', text: '#111827', textSecondary: '#6B7280', border: '#E5E7EB',
  success: '#10B981', warning: '#F59E0B', error: '#EF4444'
};

const getStyles = (colors: typeof DEFAULT_COLORS) => `.audio-reader{background:${colors.primary};border-radius:16px;padding:20px;margin:20px 0;box-shadow:0 8px 32px rgba(0,0,0,0.1);backdrop-filter:blur(10px);border:1px solid ${colors.border};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}.audio-reader-container{display:flex;align-items:center;gap:16px}.audio-reader-play-btn{background:rgba(255,255,255,0.2);border:2px solid rgba(255,255,255,0.3);border-radius:50%;width:56px;height:56px;display:flex;align-items:center;justify-content:center;color:white;cursor:pointer;transition:all 0.3s ease;backdrop-filter:blur(10px);position:relative}.audio-reader-play-btn:hover:not(:disabled){background:rgba(255,255,255,0.3);border-color:rgba(255,255,255,0.5);transform:scale(1.05)}.audio-reader-play-btn:disabled{opacity:0.6;cursor:not-allowed}.audio-reader-play-btn.playing{background:rgba(255,255,255,0.3);border-color:rgba(255,255,255,0.6);animation:pulse 2s infinite}.audio-reader-play-btn.loading{background:rgba(255,255,255,0.2)}@keyframes pulse{0%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,255,255,0.4)}70%{transform:scale(1.05);box-shadow:0 0 0 10px rgba(255,255,255,0)}100%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,255,255,0)}}.spin{animation:spin 1s linear infinite}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.audio-reader-info{flex:1;color:white;min-width:0}.audio-reader-title{font-weight:600;font-size:16px;margin-bottom:4px;text-shadow:0 2px 4px rgba(0,0,0,0.1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.audio-reader-duration{font-size:14px;opacity:0.9;font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.audio-reader-controls{display:flex;gap:8px;align-items:center}.audio-reader-control-btn,.audio-reader-settings-btn{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:8px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;color:white;cursor:pointer;transition:all 0.3s ease}.audio-reader-control-btn:hover,.audio-reader-settings-btn:hover{background:rgba(255,255,255,0.2);border-color:rgba(255,255,255,0.4);transform:translateY(-1px)}.audio-reader-settings-btn.active{background:rgba(255,255,255,0.25);border-color:rgba(255,255,255,0.5)}.audio-reader-progress-container{margin-top:16px;padding:0 4px}.audio-reader-progress-slider{width:100%;height:8px;border-radius:4px;background:rgba(255,255,255,0.2);outline:none;cursor:pointer;-webkit-appearance:none;transition:all 0.3s ease}.audio-reader-progress-slider:disabled{opacity:0.5;cursor:not-allowed}.audio-reader-progress-slider::-webkit-slider-track{height:8px;border-radius:4px;background:rgba(255,255,255,0.2)}.audio-reader-progress-slider::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:white;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.3);transition:all 0.3s ease;border:2px solid rgba(255,255,255,0.8);margin-top:-8px}.audio-reader-progress-slider::-webkit-slider-thumb:hover{transform:scale(1.1);box-shadow:0 4px 16px rgba(0,0,0,0.4)}.audio-reader-progress-slider::-moz-range-track{height:8px;border-radius:4px;background:rgba(255,255,255,0.2);border:none}.audio-reader-progress-slider::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:white;cursor:pointer;border:2px solid rgba(255,255,255,0.8);box-shadow:0 2px 8px rgba(0,0,0,0.3)}.audio-reader-progress-labels{display:flex;justify-content:space-between;margin-top:8px;font-size:12px;color:rgba(255,255,255,0.7)}.audio-reader-settings{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:12px;padding:16px;margin-top:16px;backdrop-filter:blur(10px)}.audio-reader-setting{display:flex;flex-direction:column;gap:12px}.audio-reader-setting label{color:white;font-size:14px;font-weight:500;text-shadow:0 1px 2px rgba(0,0,0,0.1)}.audio-reader-slider{width:100%;height:6px;border-radius:3px;background:rgba(255,255,255,0.2);outline:none;cursor:pointer;-webkit-appearance:none}.audio-reader-slider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:white;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.2);transition:all 0.3s ease;margin-top:-7px}.audio-reader-slider::-webkit-slider-thumb:hover{transform:scale(1.1);box-shadow:0 4px 12px rgba(0,0,0,0.3)}.audio-reader-slider::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:white;cursor:pointer;border:none;box-shadow:0 2px 6px rgba(0,0,0,0.2)}.audio-reader-speed-presets{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.audio-reader-preset-btn{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 12px;color:white;font-size:12px;font-weight:500;cursor:pointer;transition:all 0.3s ease;min-width:44px}.audio-reader-preset-btn:hover{background:rgba(255,255,255,0.2);border-color:rgba(255,255,255,0.4)}.audio-reader-preset-btn.active{background:rgba(255,255,255,0.3);border-color:rgba(255,255,255,0.6);box-shadow:0 2px 8px rgba(0,0,0,0.2)}.audio-reader-error{display:flex;align-items:center;gap:8px;background:${colors.error}20;color:${colors.error};border:1px solid ${colors.error}50;border-radius:8px;padding:12px 16px;margin-top:16px;font-size:14px;backdrop-filter:blur(10px);position:relative}.audio-reader-error span{flex:1}.audio-reader-error-close{background:none;border:none;color:${colors.error};font-size:18px;font-weight:bold;cursor:pointer;padding:0;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:4px;transition:all 0.2s ease}.audio-reader-error-close:hover{background:rgba(255,255,255,0.1)}.audio-reader svg{width:24px;height:24px;flex-shrink:0}.audio-reader-settings-btn svg,.audio-reader-control-btn svg{width:18px;height:18px}.audio-reader-error svg{width:16px;height:16px}@media (max-width:640px){.audio-reader{padding:16px;margin:16px 0}.audio-reader-container{gap:12px}.audio-reader-play-btn{width:48px;height:48px}.audio-reader-title{font-size:14px}.audio-reader-duration{font-size:12px}.audio-reader-controls{gap:6px}.audio-reader-control-btn,.audio-reader-settings-btn{width:36px;height:36px}.audio-reader-speed-presets{gap:6px}.audio-reader-preset-btn{padding:4px 8px;font-size:11px;min-width:36px}.audio-reader-settings{padding:12px}}@media (prefers-color-scheme:dark){.audio-reader{box-shadow:0 8px 32px rgba(0,0,0,0.3)}}@media (prefers-contrast:high){.audio-reader{border:2px solid white}.audio-reader-play-btn,.audio-reader-control-btn,.audio-reader-settings-btn{border-width:2px}}@media (prefers-reduced-motion:reduce){.audio-reader-play-btn,.audio-reader-control-btn,.audio-reader-settings-btn,.audio-reader-preset-btn,.audio-reader-progress-slider::-webkit-slider-thumb,.audio-reader-slider::-webkit-slider-thumb{transition:none}.audio-reader-play-btn.playing{animation:none}.spin{animation:none}}.audio-reader-play-btn:focus,.audio-reader-control-btn:focus,.audio-reader-settings-btn:focus,.audio-reader-preset-btn:focus{outline:2px solid rgba(255,255,255,0.8);outline-offset:2px}.audio-reader-progress-slider:focus,.audio-reader-slider:focus{outline:2px solid rgba(255,255,255,0.8);outline-offset:2px;border-radius:4px}`;

export function AudioReader({ post, config, className, style }: AudioReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speed, setSpeed] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const themeColors = useMemo(() => 
    config.design?.theme?.customColors ? { ...DEFAULT_COLORS, ...config.design.theme.customColors } : DEFAULT_COLORS,
    [config.design?.theme?.customColors]
  );

  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textChunksRef = useRef<string[]>([]);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const totalPausedTimeRef = useRef<number>(0);
  const voicesLoadedRef = useRef<boolean>(false);
  const isIntentionallyStoppedRef = useRef<boolean>(false);

  // Wait for voices to load
  useEffect(() => {
    const loadVoices = () => {
      voicesLoadedRef.current = true;
    };

    if (speechSynthesis.getVoices().length > 0) {
      voicesLoadedRef.current = true;
    } else {
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
      return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    }
  }, []);

  const prepareTextForSpeech = useCallback((): string => {
    const parts = [post.title, post.excerpt].filter(Boolean);
    if (post.content) {
      const cleanContent = post.content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .trim();
      parts.push(cleanContent);
    }
    return parts.join('. ');
  }, [post]);

  const splitTextIntoChunks = useCallback((text: string): string[] => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chunks: string[] = [];
    let currentChunk = '';
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (currentChunk.length + trimmed.length > 150 && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = trimmed;
      } else {
        currentChunk += (currentChunk ? '. ' : '') + trimmed;
      }
    }
    
    if (currentChunk.trim()) chunks.push(currentChunk.trim());
    return chunks.length > 0 ? chunks : [text];
  }, []);

  const getEstimatedDuration = useCallback((): number => {
    const text = prepareTextForSpeech();
    const wordsPerMinute = 150 / speed;
    const estimatedWords = text.length / 5;
    return Math.ceil(estimatedWords / wordsPerMinute * 60);
  }, [prepareTextForSpeech, speed]);

  const formatTime = useCallback((time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const startProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    const estimatedDuration = getEstimatedDuration();
    setDuration(estimatedDuration);
    startTimeRef.current = Date.now();
    
    progressIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current + totalPausedTimeRef.current) / 1000;
      const newCurrentTime = Math.min(elapsed, estimatedDuration);
      const newProgress = estimatedDuration > 0 ? (newCurrentTime / estimatedDuration) * 100 : 0;
      
      setCurrentTime(newCurrentTime);
      setProgress(Math.min(newProgress, 100));
      
      // Auto-stop when estimated duration is reached
      if (newCurrentTime >= estimatedDuration && isPlaying) {
        stopAudio();
      }
    }, 100);
  }, [getEstimatedDuration, isPlaying]);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(0);
    setCurrentTime(0);
    setCurrentTextIndex(0);
    totalPausedTimeRef.current = 0;
    pausedTimeRef.current = 0;
    stopProgressTracking();
  }, [stopProgressTracking]);

  const getBestVoice = useCallback(() => {
    const voices = speechSynthesis.getVoices();
    const englishVoices = voices.filter(v => v.lang.startsWith('en') && v.localService);
    
    if (englishVoices.length > 0) {
      return englishVoices.find(v => v.lang === 'en-US') ||
             englishVoices.find(v => v.lang === 'en-GB') ||
             englishVoices[0];
    }
    
    return voices.find(v => v.lang.startsWith('en')) || voices[0];
  }, []);

  const playWithBrowserTTS = useCallback((startFromIndex: number = 0) => {
    if (!('speechSynthesis' in window)) {
      setError('Text-to-speech not supported in this browser');
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    const text = prepareTextForSpeech();
    if (!text.trim()) {
      setError('No content to read');
      return;
    }

    textChunksRef.current = splitTextIntoChunks(text);
    
    if (startFromIndex >= textChunksRef.current.length) {
      setIsPlaying(false);
      resetProgress();
      return;
    }

    const currentChunk = textChunksRef.current[startFromIndex];
    const utterance = new SpeechSynthesisUtterance(currentChunk);
    
    // Configure voice
    const selectedVoice = getBestVoice();
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = Math.max(0.5, Math.min(2.0, speed));
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setError(null);
      setCurrentTextIndex(startFromIndex);
      if (startFromIndex === 0) {
        resetProgress();
      }
      startProgressTracking();
    };
    
    utterance.onend = () => {
      const nextIndex = startFromIndex + 1;
      if (nextIndex < textChunksRef.current.length && isPlaying) {
        // Small delay between chunks
        setTimeout(() => playWithBrowserTTS(nextIndex), 50);
      } else {
        // Finished reading
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(100);
        setCurrentTime(duration);
        stopProgressTracking();
      }
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      
      // Don't show error for intentional interruptions (stop/pause)
      if (isIntentionallyStoppedRef.current) {
        isIntentionallyStoppedRef.current = false;
        return;
      }
      
      // Only show error for actual speech synthesis errors
      if (event.error !== 'interrupted') {
        const errorMessage = event.error || 'Unknown speech synthesis error';
        setError(`Speech error: ${errorMessage}`);
      }
      
      setIsPlaying(false);
      setIsPaused(false);
      stopProgressTracking();
    };

    speechSynthesisRef.current = utterance;
    
    // Small delay to ensure proper initialization
    setTimeout(() => {
      try {
        if (speechSynthesis.speaking) {
          speechSynthesis.cancel();
        }
        speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('Error starting speech:', err);
        setError('Failed to start speech synthesis');
        setIsPlaying(false);
        stopProgressTracking();
      }
    }, 10);
  }, [prepareTextForSpeech, splitTextIntoChunks, speed, getBestVoice, resetProgress, startProgressTracking, isPlaying, duration, stopProgressTracking]);

  const togglePlayPause = useCallback(() => {
    if (!voicesLoadedRef.current && speechSynthesis.getVoices().length === 0) {
      setError('Voices are still loading, please try again in a moment');
      return;
    }

    if (isPlaying) {
      // Pause
      isIntentionallyStoppedRef.current = true;
      speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(true);
      pausedTimeRef.current = Date.now();
      stopProgressTracking();
    } else if (isPaused) {
      // Resume from where we left off
      totalPausedTimeRef.current += Date.now() - pausedTimeRef.current;
      playWithBrowserTTS(currentTextIndex);
    } else {
      // Start from beginning or resume from current position
      if (progress > 0) {
        // Resume from current position (user stopped and wants to continue)
        playWithBrowserTTS(currentTextIndex);
      } else {
        // Start from beginning (first time playing)
        resetProgress();
        playWithBrowserTTS(0);
      }
    }
  }, [voicesLoadedRef, isPlaying, isPaused, currentTextIndex, stopProgressTracking, playWithBrowserTTS, resetProgress, progress]);

  const stopAudio = useCallback(() => {
    isIntentionallyStoppedRef.current = true;
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    // Don't reset progress when stopping - preserve position for resume
    stopProgressTracking();
  }, [stopProgressTracking]);

  const handleProgressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    
    const text = prepareTextForSpeech();
    const chunks = splitTextIntoChunks(text);
    const targetIndex = Math.floor((newProgress / 100) * chunks.length);
    const clampedIndex = Math.max(0, Math.min(targetIndex, chunks.length - 1));
    
    // Update time based on progress
    const newTime = (newProgress / 100) * duration;
    setCurrentTime(newTime);
    
    if (isPlaying || isPaused) {
      // Stop current speech and start from new position
      isIntentionallyStoppedRef.current = true;
      speechSynthesis.cancel();
      setCurrentTextIndex(clampedIndex);
      
      // Reset timing for new position
      totalPausedTimeRef.current = newTime * 1000;
      
      if (isPlaying) {
        // Continue playing from new position
        setTimeout(() => playWithBrowserTTS(clampedIndex), 100);
      } else {
        // Just paused at new position
        setIsPaused(true);
        setIsPlaying(false);
      }
    }
  }, [prepareTextForSpeech, splitTextIntoChunks, duration, isPlaying, isPaused, playWithBrowserTTS]);

  const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
    
    // If currently playing, restart with new speed
    if (isPlaying) {
      isIntentionallyStoppedRef.current = true;
      speechSynthesis.cancel();
      setTimeout(() => playWithBrowserTTS(currentTextIndex), 100);
    }
  }, [isPlaying, currentTextIndex, playWithBrowserTTS]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopProgressTracking();
      speechSynthesis.cancel();
    };
  }, [stopProgressTracking]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        // Page became hidden, pause to prevent issues
        togglePlayPause();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying, togglePlayPause]);

  return (
    <div className={`audio-reader ${className || ''}`} style={style}>
      <div className="audio-reader-container">
        {/* Main Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          className={`audio-reader-play-btn ${isPlaying ? 'playing' : ''} ${isLoading ? 'loading' : ''}`}
          title={isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Listen to article'}
        >
          {isLoading ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="spin">
              <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8Z"/>
            </svg>
          ) : isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        {/* Article Info */}
        <div className="audio-reader-info">
          <div className="audio-reader-title">
            {isLoading ? 'Loading...' : isPlaying ? 'Now Playing' : isPaused ? 'Paused' : 'Listen to Article'}
          </div>
          <div className="audio-reader-duration">
            {(isPlaying || isPaused || progress > 0) ? 
              `${formatTime(currentTime)} / ${formatTime(duration)} • ${Math.round(progress)}%` :
              `~${formatTime(getEstimatedDuration())} estimated`
            }
          </div>
        </div>

        {/* Control Buttons */}
        <div className="audio-reader-controls">
          {/* Stop Button */}
          {(isPlaying || isPaused) && (
            <button
              onClick={stopAudio}
              className="audio-reader-control-btn"
              title="Stop"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h12v12H6V6z"/>
              </svg>
            </button>
          )}

          {/* Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`audio-reader-settings-btn ${showSettings ? 'active' : ''}`}
            title="Audio Settings"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Slider */}
      {(isPlaying || isPaused || progress > 0) && (
        <div className="audio-reader-progress-container">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleProgressChange}
            className="audio-reader-progress-slider"
            disabled={isLoading}
          />
          <div className="audio-reader-progress-labels">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="audio-reader-settings">
          <div className="audio-reader-setting">
            <label>Speed: {speed.toFixed(1)}x</label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={speed}
              onChange={handleSpeedChange}
              className="audio-reader-slider"
            />
            <div className="audio-reader-speed-presets">
              {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(preset => (
                <button
                  key={preset}
                  onClick={() => {
                    setSpeed(preset);
                    if (isPlaying) {
                      isIntentionallyStoppedRef.current = true;
                      speechSynthesis.cancel();
                      setTimeout(() => playWithBrowserTTS(currentTextIndex), 100);
                    }
                  }}
                  className={`audio-reader-preset-btn ${speed === preset ? 'active' : ''}`}
                >
                  {preset}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="audio-reader-error">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="audio-reader-error-close"
            title="Close"
          >
            ×
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: getStyles(themeColors) }} />
    </div>
  );
}