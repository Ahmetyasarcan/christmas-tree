import { useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

const BackgroundMusic = () => {
    const [isMuted, setIsMuted] = useState(true); // Start muted to satisfy autoplay policies often
    const [isPlaying, setIsPlaying] = useState(false);
    const [player, setPlayer] = useState<any>(null);
    const [showHint, setShowHint] = useState(false);

    // Video ID and timing
    // Video: 12 Dev Adam
    // Loop: 1:06 - 1:26
    const VIDEO_ID = '4YBGRGBj7_w';
    const START_TIME = 66; // 1:06
    const END_TIME = 86;   // 1:26

    const opts: YouTubeProps['opts'] = {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 1,
            start: START_TIME,
            end: END_TIME,
            controls: 0,
            modestbranding: 1,
            loop: 1,
            playlist: VIDEO_ID, // Required for loop to work
            playsinline: 1, // iOS
        },
    };

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        console.log('Music Player Ready', event);
        setPlayer(event.target);
        
        // Try to play
        event.target.playVideo();
        
        // Try to unmute after a short delay, but if it fails/blocks, we stay muted
        setTimeout(() => {
            try {
                // Determine if we can unmute
                // Note: YouTube API doesn't throw easily on mute/unmute, 
                // but real autoplay with sound usually blocks unless user interacted.
                // We'll trust the user to unmute if they want to hear it.
                // However, we can TRY to unmute if the browser allows.
                // event.target.unMute(); 
                // setIsMuted(false);
                
                // Better strategy: Start muted (state=true), show hint to user
                setShowHint(true);
            } catch (e) {
                console.warn("Autoplay with sound blocked", e);
            }
        }, 1000);
    };

    const onError: YouTubeProps['onError'] = (error) => {
        console.error('YouTube Player Error:', error);
        // Try to recover by reloading or muting
        if (player) {
            player.mute();
            player.playVideo();
        }
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
        // 2 = PAUSED
        if (event.data === 2) {
           setIsPlaying(false);
           // Force resume if it wasn't a user action (hard to detect, but we want bg music)
           // event.target.playVideo(); 
        }
    };





    const toggleMute = () => {
        if (player) {
            if (isMuted) {
                player.unMute();
                player.setVolume(50); // Fixed medium volume
                player.playVideo(); // Ensure it plays if it was paused/blocked
                setIsMuted(false);
                setShowHint(false); // Hide hint once interacted
            } else {
                player.mute();
                setIsMuted(true);
            }
        }
    };

    // Auto-hide hint after 10 seconds
    if (showHint) {
        setTimeout(() => setShowHint(false), 10000);
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 group">
            {/* Hint Bubble */}
            {showHint && (
                <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm border border-white/20 animate-fade-in mb-2 shadow-lg">
                    🎵 Müzik için tıklayın
                </div>
            )}



            <div className={`bg-gray-800/80 backdrop-blur-md p-2 rounded-full border border-gray-600 shadow-xl flex items-center gap-2 transition-all duration-300 ${isMuted || !isPlaying ? 'opacity-75 hover:opacity-100' : 'opacity-100'}`}>
                <button
                    onClick={toggleMute}
                    className="p-2 text-white hover:bg-gray-700 rounded-full transition-colors relative"
                    title={isMuted ? "Sesi Aç" : "Sesi Kapat"}
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

            <div className="absolute w-0 h-0 opacity-0 pointer-events-none">
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
