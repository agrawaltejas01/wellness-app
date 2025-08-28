import React, { useRef, useState, useEffect } from 'react';

// Define prop types
interface ReelsVideoPlayerProps {
  src: string;
  caption: string;
}

const ReelsVideoPlayer: React.FC<ReelsVideoPlayerProps> = ({ src, caption }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Set initial muted state
      video.muted = isMuted;

      // Handle loaded metadata to get duration
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      // Handle time update for progress and current time
      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
        if (video.duration) {
          setProgress((video.currentTime / video.duration) * 100);
        }
      };

      // Handle play state changes
      const handlePlay = () => {
        setIsPlaying(true);
      };

      // Handle pause state changes
      const handlePause = () => {
        setIsPlaying(false);
      };

      // Add event listeners
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);

      // Cleanup
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    }
  }, [isMuted]);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      if (isPlaying) {
        video.play().catch(error => {
          console.error('Play failed:', error);
          setIsPlaying(false);
        });
      } else {
        video.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = (): void => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (videoRef.current) {
      const video = videoRef.current;
      const newTime = parseFloat(e.target.value);
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleShare = (): void => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this video!',
        url: src,
      }).catch(error => {
        console.error('Share failed:', error);
      });
    } else {
      // Fallback: Copy URL to clipboard
      navigator.clipboard.writeText(src).then(() => {
        alert('Video URL copied to clipboard!');
      }).catch(error => {
        console.error('Clipboard copy failed:', error);
      });
    }
  };

  const handleDownload = (): void => {
    if (videoRef.current) {
      const link = document.createElement('a');
      link.href = src;
      link.download = 'video.mp4'; // Default filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full max-w-[414px] h-screen bg-black rounded-lg overflow-hidden shadow-lg mx-auto">
      {/* Video with controls disabled */}
      <video
        ref={videoRef}
        src={src}
        loop
        playsInline
        muted={isMuted}
        className="w-full h-full object-cover"
        onClick={togglePlay}
        controls={false}
        preload="metadata"
      />

      {/* Custom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
        <div
          className="h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Custom Controls Overlay */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        {/* Progress Seek Bar */}
        {/* <div className="mb-2">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, white ${progress}%, #4b5563 ${progress}%)`
            }}
          />
        </div> */}

        {/* Time Display */}
        {/* <div className="text-white text-xs mb-2 flex justify-between">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div> */}

        {/* Caption and Interaction Buttons Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
          <div className="flex justify-between items-end">
            {/* Left: Caption */}
            <div className="max-w-[70%]">
              <p className="text-sm line-clamp-2">{caption}</p>
            </div>

            {/* Right: Interaction Buttons */}
            <div className="flex flex-col space-y-4 mb-8 items-center">
              <button
                onClick={handleShare}
                className="flex flex-col items-center"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                </svg>
                <span className="text-xs">Share</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex flex-col items-center"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                </svg>
                <span className="text-xs">Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Play/Pause Button Overlay - Centered */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button
            onClick={togglePlay}
            className="bg-black bg-opacity-50 rounded-full p-4"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReelsVideoPlayer;