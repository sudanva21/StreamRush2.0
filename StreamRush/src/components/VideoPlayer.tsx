import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  SkipBack, 
  SkipForward,
  Rewind,
  FastForward
} from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  autoplay?: boolean;
  volume?: number;
  playbackSpeed?: number;
  subtitles?: boolean;
  onProgress?: (state: any) => void;
  onDuration?: (duration: number) => void;
  onEnded?: () => void;
  onError?: (error: any) => void;
  settings?: {
    autoplay: boolean;
    quality: string;
    volume: number;
    playbackSpeed: number;
    subtitles: boolean;
  };
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  autoplay = false,
  volume = 80,
  playbackSpeed = 1,
  subtitles = false,
  onProgress,
  onDuration,
  onEnded,
  onError,
  settings
}) => {
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [playing, setPlaying] = useState(autoplay);
  const [currentVolume, setCurrentVolume] = useState(settings?.volume || volume);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentPlaybackSpeed, setCurrentPlaybackSpeed] = useState(settings?.playbackSpeed || playbackSpeed);
  const [showSettings, setShowSettings] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [buffering, setBuffering] = useState(false);

  let hideControlsTimeout: NodeJS.Timeout;

  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    const resetTimeout = () => {
      clearTimeout(hideControlsTimeout);
      setShowControls(true);
      hideControlsTimeout = setTimeout(() => {
        if (playing) setShowControls(false);
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', resetTimeout);
      container.addEventListener('click', resetTimeout);
    }

    return () => {
      clearTimeout(hideControlsTimeout);
      if (container) {
        container.removeEventListener('mousemove', resetTimeout);
        container.removeEventListener('click', resetTimeout);
      }
    };
  }, [playing]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (newVolume: number) => {
    setCurrentVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleMute = () => {
    setMuted(!muted);
  };

  const handleSeek = (seekTo: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seekTo);
    }
  };

  const handleProgress = (state: any) => {
    setPlayed(state.played);
    setPlayedSeconds(state.playedSeconds);
    onProgress?.(state);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
    onDuration?.(duration);
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleSpeedChange = (speed: number) => {
    setCurrentPlaybackSpeed(speed);
    setShowSettings(false);
  };

  const handleSkipBack = () => {
    const newTime = Math.max(0, playedSeconds - 10);
    handleSeek(newTime / duration);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(duration, playedSeconds + 10);
    handleSeek(newTime / duration);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't handle shortcuts when typing
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSkipBack();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSkipForward();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(Math.min(100, currentVolume + 5));
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(Math.max(0, currentVolume - 5));
          break;
        case 'm':
          e.preventDefault();
          handleMute();
          break;
        case 'f':
          e.preventDefault();
          handleFullscreen();
          break;
        case 'j':
          e.preventDefault();
          handleSkipBack();
          break;
        case 'l':
          e.preventDefault();
          handleSkipForward();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playing, currentVolume, playedSeconds, duration]);

  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  return (
    <div 
      ref={containerRef} 
      className="relative w-full aspect-video bg-black group cursor-pointer"
      onDoubleClick={handleFullscreen}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        volume={muted ? 0 : currentVolume / 100}
        playbackRate={currentPlaybackSpeed}
        width="100%"
        height="100%"
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={onEnded}
        onError={onError}
        onBuffer={() => setBuffering(true)}
        onBufferEnd={() => setBuffering(false)}
        config={{
          youtube: {
            playerVars: {
              showinfo: 0,
              controls: 0,
              modestbranding: 1,
              rel: 0,
            }
          }
        }}
      />

      {/* Loading indicator */}
      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Controls overlay */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        showControls || !playing ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Center play/pause button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handlePlayPause}
            className="w-16 h-16 rounded-full bg-black bg-opacity-80 flex items-center justify-center text-white hover:bg-opacity-100 transition-all"
          >
            {playing ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-4">
          {/* Progress bar */}
          <div className="w-full mb-4">
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={played}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #ff0000 0%, #ff0000 ${played * 100}%, #555 ${played * 100}%, #555 100%)`
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Left controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlayPause}
                className="text-white hover:text-red-500 transition-colors"
              >
                {playing ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <button
                onClick={handleSkipBack}
                className="text-white hover:text-red-500 transition-colors"
                title="Rewind 10s (J)"
              >
                <Rewind size={20} />
              </button>
              
              <button
                onClick={handleSkipForward}
                className="text-white hover:text-red-500 transition-colors"
                title="Forward 10s (L)"
              >
                <FastForward size={20} />
              </button>

              {/* Volume controls */}
              <div className="relative flex items-center">
                <button
                  onClick={handleMute}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  {muted || currentVolume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                
                {showVolumeSlider && (
                  <div 
                    className="absolute bottom-full left-0 mb-2 bg-black bg-opacity-90 p-2 rounded"
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={currentVolume}
                      onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                      className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Time display */}
              <span className="text-white text-sm">
                {formatTime(playedSeconds)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right controls */}
            <div className="flex items-center space-x-4">
              {/* Settings */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  <Settings size={20} />
                </button>
                
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black bg-opacity-90 p-4 rounded min-w-[200px]">
                    <div className="mb-4">
                      <h4 className="text-white text-sm font-semibold mb-2">Playback Speed</h4>
                      {speedOptions.map(speed => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedChange(speed)}
                          className={`block w-full text-left px-2 py-1 text-sm ${
                            currentPlaybackSpeed === speed 
                              ? 'text-red-500 bg-red-500 bg-opacity-20' 
                              : 'text-white hover:bg-gray-700'
                          } rounded transition-colors`}
                        >
                          {speed === 1 ? 'Normal' : `${speed}x`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={handleFullscreen}
                className="text-white hover:text-red-500 transition-colors"
                title="Fullscreen (F)"
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;