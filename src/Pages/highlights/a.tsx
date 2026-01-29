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
  shareEnabled?: boolean;
  muted?: boolean;
}

const ReelsVideoPlayer: React.FC<ReelsVideoPlayerProps> = ({ src, caption = "", downloadEnabled = true, shareEnabled = false, muted = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(muted);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [downloadStatus, setDownloadStatus] = useState('idle'); // idle, downloading, completed, error
  const [statusMessage, setStatusMessage] = useState('');
  const [fileName, setFileName] = useState("highlight.mp4");
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  
  // Preload state and refs
  const preloadedBlobRef = useRef<Blob | null>(null);
  const preloadAbortControllerRef = useRef<AbortController | null>(null);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  
  // Share progress state
  const [shareProgress, setShareProgress] = useState<{
    isSharing: boolean;
    progress: number;
    bytesWritten: number;
    totalBytes: number;
  }>({
    isSharing: false,
    progress: 0,
    bytesWritten: 0,
    totalBytes: 0,
  });

  const userDetails = JSON.parse(window.localStorage["zenfitx-user-details"] || '{}');
  const userId = userDetails?.id;

  // Helper function to redirect to app store
  const redirectToAppStore = (): void => {
    const platform = window?.platformInfo?.platform;
    let appStoreUrl = '';
    
    if (platform === 'ios') {
      appStoreUrl = 'https://apps.apple.com/in/app/zenfitx/id6736351969';
    } else if (platform === 'android') {
      appStoreUrl = 'https://play.google.com/store/apps/details?id=com.zenfitx.zenfitxapp';
    } else {
      // Fallback: detect from user agent
      const userAgent = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(userAgent)) {
        appStoreUrl = 'https://apps.apple.com/in/app/zenfitx/id6736351969';
      } else if (/android/.test(userAgent)) {
        appStoreUrl = 'https://play.google.com/store/apps/details?id=com.zenfitx.zenfitxapp';
      }
    }
    
    if (appStoreUrl) {
      window.location.href = appStoreUrl;
    }
  };

  useEffect(() => {
    Mixpanel.track("viewed_highlight_video_page", {
      userId: userId,
    });
  }, []);

  // Preload video in background for instant sharing/downloading
  useEffect(() => {
    const preloadVideo = async () => {
      if (!src) return;

      // For React Native WebView, tell native to preload
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'preloadVideo',
          videoUrl: src,
          fileName: fileName,
        }));
        return;
      }

      // For web browsers, preload the blob
      try {
        setIsPreloading(true);
        preloadAbortControllerRef.current = new AbortController();
        
        const proxyURL = `${process.env.REACT_APP_BE_URL}/highlights/download?url=${encodeURIComponent(src)}`;
        const response = await fetch(proxyURL, {
          signal: preloadAbortControllerRef.current.signal
        });
        
        if (!response.ok) throw new Error('Preload failed');
        
        const blob = await response.blob();
        preloadedBlobRef.current = blob;
        setIsPreloaded(true);
        console.log('Video preloaded successfully');
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.log('Preload failed, will download on demand:', error);
        }
      } finally {
        setIsPreloading(false);
        preloadAbortControllerRef.current = null;
      }
    };

    preloadVideo();
  }, [src, fileName]);

  // Cleanup on unmount - cancel preload, clear blob, tell native to delete
  useEffect(() => {
    return () => {
      // Cancel any ongoing preload
      if (preloadAbortControllerRef.current) {
        preloadAbortControllerRef.current.abort();
        preloadAbortControllerRef.current = null;
      }
      
      // Clear the preloaded blob (for web)
      if (preloadedBlobRef.current) {
        preloadedBlobRef.current = null;
        setIsPreloaded(false);
      }
      
      // Tell React Native to delete the preloaded video
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'deletePreloadedVideo',
          fileName: fileName,
        }));
      }
    };
  }, [fileName]);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Set initial muted state
      video.muted = isMuted;

      // Handle loaded metadata to get duration
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      // Handle when video can play
      const handleCanPlay = () => {
        setIsVideoLoaded(true);
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
      video.addEventListener('canplay', handleCanPlay);

      // Cleanup
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('canplay', handleCanPlay);
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

  const handleShareInstagram = async (): Promise<void> => {
    Mixpanel.track("clicked_share_instagram_on_highlights_page", {
      userId: userId,
    });

    // Check if running in React Native WebView
    if (window.ReactNativeWebView) {
      // Use preloaded video if available (native handles this)
      window?.ReactNativeWebView?.postMessage(JSON.stringify({
        type: 'shareToInstagram',
        videoUrl: src,
        fileName: fileName,
        usePreloaded: true, // Signal to use preloaded file if available
      }));
      return;
    }
    
    // For web, try to share the actual video file
    if (navigator.share && navigator.canShare) {
      try {
        let videoBlob = preloadedBlobRef.current;
        
        // If not preloaded, download now
        if (!videoBlob) {
          message.loading({ content: 'Preparing video...', key: 'share', duration: 0 });
          const proxyURL = `${process.env.REACT_APP_BE_URL}/highlights/download?url=${encodeURIComponent(src)}`;
          const response = await fetch(proxyURL);
          if (!response.ok) throw new Error('Failed to fetch video');
          videoBlob = await response.blob();
          message.destroy('share');
        }
        
        const videoFile = new File([videoBlob], 'highlight.mp4', { type: 'video/mp4' });
        
        if (navigator.canShare({ files: [videoFile] })) {
          await navigator.share({
            title: 'Check out my game highlights!',
            files: [videoFile],
          });
          return;
        }
      } catch (error) {
        console.log('File share failed, falling back to URL:', error);
        message.destroy('share');
      }
    }
    
    // Fallback to URL share
    if (navigator.share) {
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

  const handleShare = async (): Promise<void> => {
    Mixpanel.track("clicked_share_on_highlights_page", {
      userId: userId,
    });

    // Check if running in React Native WebView
    if (window.ReactNativeWebView) {

      if(window?.platformInfo?.appVersion && window?.platformInfo?.appVersion < '1.2.7') {
        // alert('Share failed. Please update the app to the latest version.');
        redirectToAppStore();
        return;
      }

      // Use preloaded video if available (native handles this)
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'shareVideo',
        videoUrl: src,
        fileName: fileName,
        title: 'Check out this video!',
        usePreloaded: true, // Signal to use preloaded file if available
      }));
      return;
    }
    
    // For web, try to share the actual video file
    if (navigator.share && navigator.canShare) {
      try {
        let videoBlob = preloadedBlobRef.current;
        
        // If not preloaded, download now
        if (!videoBlob) {
          message.loading({ content: 'Preparing video...', key: 'share', duration: 0 });
          const proxyURL = `${process.env.REACT_APP_BE_URL}/highlights/download?url=${encodeURIComponent(src)}`;
          const response = await fetch(proxyURL);
          if (!response.ok) throw new Error('Failed to fetch video');
          videoBlob = await response.blob();
          message.destroy('share');
        }
        
        const videoFile = new File([videoBlob], 'highlight.mp4', { type: 'video/mp4' });
        
        if (navigator.canShare({ files: [videoFile] })) {
          await navigator.share({
            title: 'Check out this video!',
            files: [videoFile],
          });
          return;
        }
      } catch (error) {
        console.log('File share failed, falling back to URL:', error);
        message.destroy('share');
      }
    }
    
    // Fallback to URL share
    if (navigator.share) {
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
        
        // Handle preload status from React Native
        if (data.type === 'preloadStatus' && data.fileName === fileName) {
          if (data.status === 'completed') {
            setIsPreloaded(true);
            setIsPreloading(false);
            console.log('Video preloaded on native side');
          } else if (data.status === 'downloading') {
            setIsPreloading(true);
          } else if (data.status === 'error') {
            setIsPreloading(false);
            console.log('Native preload failed:', data.error);
          }
        }
        
        // Handle share status messages
        if (data.type === 'shareStatus') {
          if (data.status === 'downloading') {
            setShareProgress({
              isSharing: true,
              progress: data.progress || 0,
              bytesWritten: data.bytesWritten || 0,
              totalBytes: data.totalBytes || 0,
            });
          } else if (data.status === 'completed' || data.status === 'success') {
            setShareProgress(prev => ({ ...prev, progress: 100 }));
            setTimeout(() => {
              setShareProgress({
                isSharing: false,
                progress: 0,
                bytesWritten: 0,
                totalBytes: 0,
              });
            }, 500);
          } else if (data.status === 'error' || data.status === 'cancelled') {
            setShareProgress({
              isSharing: false,
              progress: 0,
              bytesWritten: 0,
              totalBytes: 0,
            });
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
      if(window?.platformInfo?.appVersion && window?.platformInfo?.appVersion < '1.2.7') {
        // alert('Download failed. Please update the app to the latest version.');
        redirectToAppStore();
        return;
      }
      // Send message to React Native - use preloaded video if available
      window?.ReactNativeWebView?.postMessage(JSON.stringify({
        type: 'downloadVideo',
        videoUrl: `${process.env.REACT_APP_BE_URL}/highlights/download?url=${encodeURIComponent(src)}`,
        fileName: fileName,
        usePreloaded: true, // Signal to use preloaded file if available
      }));
    } else {
      // Fallback for web browsers - use preloaded blob if available
      try {
        let blob = preloadedBlobRef.current;
        
        // If not preloaded, download now
        if (!blob) {
          setDownloadStatus('downloading');
          const proxyURL = `${process.env.REACT_APP_BE_URL}/highlights/download?url=${encodeURIComponent(src)}`;
          const response = await fetch(proxyURL);
          if (!response.ok) throw new Error('Network response was not ok');
          blob = await response.blob();
        }
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'highlight.mp4';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        setDownloadStatus('idle');
        message.success('Download completed');
      } catch (error) {
        console.error('Download failed:', error);
        setDownloadStatus('idle');
        navigator.clipboard.writeText(src).then(() => {
          alert('Download failed due to proxy or CDN restrictions. Video URL copied to clipboard. Please paste it into a browser or download manager to save the file manually.');
        }).catch(clipboardError => {
          console.error('Clipboard fallback failed:', clipboardError);
          alert('Download failed. Please copy the video URL manually: ' + src);
        });
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

          {/* Progress Bar and Time at Bottom of Video - Only visible when video is loaded */}
          {isVideoLoaded && (
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
          )}
        </div>
      </div>

      {/* Bottom Action Buttons - Only visible when video is loaded and share is enabled */}
      {isVideoLoaded && shareEnabled && (
        <div className="px-4 pb-12 mt-2 flex gap-3 bg-black" style={{ paddingBottom: 'max(3rem, env(safe-area-inset-bottom, 3rem))' }}>
          {shareProgress.isSharing ? (
            /* Progress Bar - shown when sharing */
            <div className="flex-1 h-14 rounded-full flex flex-col items-center justify-center px-4 bg-[#1a1a1a] border border-white/10">
              <p className="text-white text-sm font-medium mb-2">Loading...</p>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#009605] rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${shareProgress.progress}%` }}
                />
              </div>
            </div>
          ) : (
            /* Share Button */
            <button
              onClick={handleShare}
              className="w-full h-14 rounded-full flex items-center justify-center gap-2 font-semibold text-lg text-white"
              style={{ 
                backgroundColor: '#009605',
                WebkitTapHighlightColor: 'transparent' 
              }}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a3.27 3.27 0 000-1.39l7.05-4.11A2.99 2.99 0 0018 7.91 3 3 0 1015 5a2.9 2.9 0 00.09.7L8.04 9.81a3 3 0 100 4.38l7.05 4.11c-.05.23-.09.46-.09.7a3 3 0 103-2.92z" />
              </svg>
              <span>Share</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReelsVideoPlayer;
