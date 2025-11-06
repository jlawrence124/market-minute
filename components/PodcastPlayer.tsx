import React, { useRef, useState, useEffect } from 'react';

interface PodcastPlayerProps {
  audioUrl: string;
}

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ audioUrl }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [speed, setSpeed] = useState(1);

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [audioUrl, speed]);

  return (
    <div className="w-full max-w-2xl mt-8 bg-white rounded-xl shadow-md border border-schw-gray p-6">
        <h2 className="text-xl font-bold text-schw-blue mb-4">Your Podcast is Ready</h2>
        <audio controls src={audioUrl} ref={audioRef} className="w-full">
            Your browser does not support the audio element.
        </audio>
        <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
                <label htmlFor="speed-control" className="text-sm font-medium text-schw-text-light mr-2">
                  Speed:
                </label>
                <select 
                    id="speed-control" 
                    value={speed} 
                    onChange={handleSpeedChange}
                    className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-schw-blue focus:border-schw-blue focus:outline-none transition-colors"
                    aria-label="Playback speed"
                >
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                </select>
            </div>

            <a
                href={audioUrl}
                download="schwab-flash-cast.mp3"
                className="bg-schw-green text-white font-bold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 text-sm flex items-center shadow-sm hover:shadow-md"
                aria-label="Download podcast as MP3"
            >
              <DownloadIcon />
              Download MP3
            </a>
        </div>
    </div>
  );
};
