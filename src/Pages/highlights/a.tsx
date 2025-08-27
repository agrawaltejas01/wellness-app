import React, { useRef, useState, useEffect } from 'react';

// Define prop types
interface ReelsVideoPlayerProps {
  src: string;
  username: string;
  likes: string;
  caption: string;
}

const ReelsVideoPlayer: React.FC<ReelsVideoPlayerProps> = ({ src, username, likes, caption }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = (): void => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (): void => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgress = (): void => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      const currentTime = videoRef.current.currentTime;
      setProgress((currentTime / duration) * 100);
    }
  };

  return (
    <div className="relative w-full max-w-[414px] h-screen bg-black rounded-lg overflow-hidden shadow-lg">
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        loop
        muted={isMuted}
        className="w-full h-full object-cover"
        onTimeUpdate={handleProgress}
        onClick={togglePlay}
      />

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
        <div
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Overlay Controls and Info */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
        {/* Top: Username and Follow */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white" />
            <span className="font-semibold">{username}</span>
            <button className="text-sm font-semibold border border-white rounded px-2 py-1">
              Follow
            </button>
          </div>
        </div>

        {/* Bottom: Controls and Info */}
        <div className="flex justify-between items-end">
          {/* Left: Caption */}
          <div className="max-w-[70%]">
            <p className="text-sm line-clamp-2">{caption}</p>
          </div>

          {/* Right: Interaction Buttons */}
          <div className="flex flex-col space-y-4 items-center">
            <button className="flex flex-col items-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-xs">{likes}</span>
            </button>
            <button className="flex flex-col items-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9m0-2C5.92 1 1 5.92 1 12s5.92 11 11 11 11-5.92 11-11S18.08 1 12 1zm0 16c-1.1 0-2វ0-2-.9-2-2h4c0 1.1-.9 2-2 2zm0-3c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zm0-3c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z" />
              </svg>
              <span className="text-xs">Download</span>
            </button>
            <button onClick={toggleMute} className="flex flex-col items-center">
              {isMuted ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z" />
                </svg>
              )}
              <span className="text-xs">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelsVideoPlayer;