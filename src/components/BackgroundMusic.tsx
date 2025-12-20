import { useState, useRef } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

const BackgroundMusic = () => {
    const [isMuted, setIsMuted] = useState(false); // Start unmuted as requested
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef<any>(null);

    // Video ID and timing
    // Video: 12 Dev Adam
    // Loop: 1:06 - 1:26
    const VIDEO_ID = '4YBGRGBj7_w';
    const START_TIME = 66; // 1:06
    const END_TIME = 86;   // 1:26

    const opts: YouTubeProps['opts'] = {
        height: '1',
        width: '1',
        playerVars: {
            autoplay: 1,
            start: START_TIME,
            end: END_TIME,
            controls: 0,
            modestbranding: 1,
            loop: 1,
            playlist: VIDEO_ID,
        },
    };

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        console.log('Music Player Ready', event);
        playerRef.current = event.target;
        // Attempt to play immediately
        event.target.playVideo();

        if (isMuted) {
            event.target.mute();
        } else {
            event.target.unMute();
            event.target.setVolume(50);
        }
    };

    const onError: YouTubeProps['onError'] = (error) => {
        console.error('YouTube Player Error:', error);
    };

    const onStateChange: YouTubeProps['onStateChange'] = (event) => {
        // 0 = ENDED
        if (event.data === 0) {
            event.target.seekTo(START_TIME);
            event.target.playVideo();
        }
        // 1 = PLAYING
        if (event.data === 1) {
            setIsPlaying(true);
        }
    };

    const toggleMute = () => {
        if (playerRef.current) {
            if (isMuted) {
                playerRef.current.unMute();
                playerRef.current.setVolume(50);
            } else {
                playerRef.current.mute();
            }
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-gray-800/80 backdrop-blur-md p-2 rounded-full border border-gray-600 shadow-xl flex items-center gap-2">
                <button
                    onClick={toggleMute}
                    className="p-2 text-white hover:bg-gray-700 rounded-full transition-colors relative group"
                    title={isMuted ? "Unmute Music" : "Mute Music"}
                >
                    {isMuted ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                    )}

                    {/* Tooltip */}
                    <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {isMuted ? "Sesi Aç" : "Sesi Kapat"}
                    </span>
                </button>

                {/* Simple visualizer bars */}
                {!isMuted && isPlaying && (
                    <div className="flex items-end gap-1 h-4 w-8">
                        <div className="w-1 bg-green-500 animate-[bounce_1s_infinite] h-full" />
                        <div className="w-1 bg-red-500 animate-[bounce_1.2s_infinite] h-3" />
                        <div className="w-1 bg-green-500 animate-[bounce_0.8s_infinite] h-2" />
                        <div className="w-1 bg-red-500 animate-[bounce_1.1s_infinite] h-4" />
                    </div>
                )}
            </div>

            <div className="absolute opacity-0 pointer-events-none top-0 left-0">
                <YouTube
                    videoId={VIDEO_ID}
                    opts={opts}
                    onReady={onPlayerReady}
                    onStateChange={onStateChange}
                    onError={onError}
                />
            </div>
        </div>
    );
};

export default BackgroundMusic;
