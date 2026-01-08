import React, { useRef, useState, useEffect } from 'react';
import { ReactComponent as BackButton } from '../../images/utils/back-button.svg';
import { navigate } from '@reach/router';
import { message } from 'antd';
import { Mixpanel } from '../../mixpanel/init';

// Define prop types
interface ReelsVideoPlayerProps {
  src: string;
  caption?: string;
  downloadEnabled?: boolean;
  muted?: boolean;
}

const ReelsVideoPlayer: React.FC<ReelsVideoPlayerProps> = ({ src, caption = "", downloadEnabled = true, muted = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(muted);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [downloadStatus, setDownloadStatus] = useState('idle'); // idle, downloading, completed, error
  const [statusMessage, setStatusMessage] = useState('');
  const [fileName, setFileName] = useState("highlight.mp4");

  const userDetails = JSON.parse(window.localStorage["zenfitx-user-details"] || '{}');
  const userId = userDetails?.id;

  useEffect(() => {
    Mixpanel.track("viewed_highlight_video_page", {
      userId: userId,
    });
  }, []);

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

  const toggleMute = (): void => {
    Mixpanel.track("clicked_mute_on_highlights_page", {
      userId: userId,
    });
    if (videoRef.current) {
      const video = videoRef.current;
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleShareInstagram = (): void => {
    Mixpanel.track("clicked_share_instagram_on_highlights_page", {
      userId: userId,
    });

    // Check if running in React Native WebView
    if (window.ReactNativeWebView) {
      window?.ReactNativeWebView?.postMessage(JSON.stringify({
        type: 'shareToInstagram',
        videoUrl: src,
      }));
    } else if (navigator.share) {
      navigator.share({
        title: 'Check out my game highlights!',
        url: src,
      }).catch(error => {
        console.error('Share failed:', error);
      });
    } else {
      navigator.clipboard.writeText(src).then(() => {
        message.success('Video URL copied to clipboard!');
      }).catch(error => {
        console.error('Clipboard copy failed:', error);
      });
    }
  };

  const handleShare = (): void => {
    Mixpanel.track("clicked_share_on_highlights_page", {
      userId: userId,
    });

    // Check if running in React Native WebView on Android
    if (window.ReactNativeWebView && window.platformInfo?.platform === "android") {
      // Send message to React Native to open native share modal
      window?.ReactNativeWebView?.postMessage(JSON.stringify({
        type: 'shareVideo',
        title: 'Check out this video!',
        url: src,
      }));
    } else if (navigator.share) {
      // Use Web Share API for browsers that support it (including iOS WebView)
      navigator.share({
        title: 'Check out this video!',
        url: src,
      }).catch(error => {
        console.error('Share failed:', error);
      });
    } else {
      navigator.clipboard.writeText(src).then(() => {
        message.success('Video URL copied to clipboard!');
      }).catch(error => {
        console.error('Clipboard copy failed:', error);
      });
    }
  };


  useEffect(() => {
    // Listen for messages from React Native
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'downloadStatus' && data.fileName === fileName) {
          setDownloadStatus(data.status);
          setStatusMessage(data.message || data.error || '');

          if(data.status === 'completed') {
            message.success('Download completed');
          }
          
          // Reset status after a delay for completed/error states
          if (data.status === 'completed' || data.status === 'error') {
            setTimeout(() => {
              setDownloadStatus('idle');
              setStatusMessage('');
            }, 1000);
          }
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    // Check if running in WebView
    if (window.ReactNativeWebView) {
      window.addEventListener('message', handleMessage);
      document.addEventListener('message', handleMessage as EventListener);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('message', handleMessage as EventListener);
    };
  }, [fileName]);

    const handleDownload = async (): Promise<void> => {
      Mixpanel.track("clicked_download_on_highlights_page", {
        userId: userId,
      });

    if (window.ReactNativeWebView) {

        if(window.platformInfo?.platform === "ios" && window?.platformInfo?.appVersion && window?.platformInfo?.appVersion < '1.2.4') {
            alert('Download failed. Please update the app to the latest version.');
            return;
        }
        // Send message to React Native
        window?.ReactNativeWebView?.postMessage(JSON.stringify({
          type: 'downloadVideo',
          videoUrl: `${process.env.REACT_APP_BE_URL}/highlights/download?url=${encodeURIComponent(src)}`,
          fileName: "highlight.mp4",
        }));
      } else {
        // Fallback for web browsers
        if (videoRef.current) {
          try {
            const proxyURL = `${process.env.REACT_APP_BE_URL}/highlights/download?url=${encodeURIComponent(src)}`;
            const response = await fetch(proxyURL);
            if (!response.ok) throw new Error('Network response was not ok');
      
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'highlight.mp4';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.error('Download failed:', error);
            navigator.clipboard.writeText(src).then(() => {
              alert('Download failed due to proxy or CDN restrictions. Video URL copied to clipboard. Please paste it into a browser or download manager to save the file manually.');
            }).catch(clipboardError => {
              console.error('Clipboard fallback failed:', clipboardError);
              alert('Download failed. Please copy the video URL manually: ' + src);
            });
          }
        }
      }
      };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (videoRef.current) {
      const video = videoRef.current;
      const newTime = parseFloat(e.target.value);
      video.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress((newTime / video.duration) * 100);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full min-h-screen bg-black flex flex-col" style={{ backgroundColor: '#000000' }}>
      {/* Video Container */}
      <div className="flex-1 flex items-start justify-center relative bg-black">
        <div className="relative w-full h-full max-w-[414px] overflow-hidden bg-black">
          {/* Back Button - Overlaid on Video */}
          <div className="absolute top-2 left-2 z-30" onClick={() => navigate(-1)}>
            <span className="font-semibold text-lg text-white cursor-pointer"><BackButton /></span>
          </div>

          {/* Video */}
          <video
            ref={videoRef}
            src={src}
            loop
            playsInline
            muted={isMuted}
            className="w-full h-full object-cover bg-black"
            onClick={togglePlay}
            controls={false}
            preload="metadata"
          />

          {/* Play/Pause Button Overlay - Centered */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <button
                onClick={togglePlay}
                className="bg-black/50 rounded-full p-4"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          {/* Progress Bar and Time at Bottom of Video */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 z-20 bg-gradient-to-t from-black/60 to-transparent pt-8">
            {/* Mute and Download Buttons */}
            <div className="flex flex-col items-end gap-2 mb-3">
              {/* Mute/Unmute Button */}
              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {isMuted ? (
                  <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </button>

              {/* Download Button */}
              {downloadEnabled && (
                <button
                  onClick={handleDownload}
                  className={`w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20 ${downloadStatus !== 'idle' && downloadStatus !== 'error' ? 'pointer-events-none' : ''}`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {downloadStatus === 'downloading' ? (
                    <svg 
                      className="w-5 h-5 animate-spin" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="3"
                        fill="none"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="40, 100"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                  )}
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-600 rounded-full mb-2">
              <div
                className="h-full bg-white rounded-full transition-all duration-200 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Time Display */}
            <div className="text-white text-xs flex justify-between">
              <span className="font-semibold">{formatTime(currentTime)}</span>
              <span className="font-semibold">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="px-4 pb-12 flex gap-3 bg-black" style={{ paddingBottom: 'max(3rem, env(safe-area-inset-bottom, 3rem))' }}>
        {/* Share on Instagram Button */}
        <button
          onClick={handleShareInstagram}
          className="flex-1 h-14 rounded-full flex items-center justify-center gap-2 font-semibold text-lg text-white"
          style={{ 
            backgroundColor: '#4CAF50',
            WebkitTapHighlightColor: 'transparent' 
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v8M8 12h8"/>
          </svg>
          <span>Share on Instagram</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: '#4CAF50',
            WebkitTapHighlightColor: 'transparent' 
          }}
        >
          <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ReelsVideoPlayer;
