import React from 'react';

interface PodcastPlayerProps {
  audioUrl: string;
}

export const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ audioUrl }) => {
  return (
    <div className="w-full max-w-2xl mt-8 bg-white rounded-xl shadow-md border border-schw-gray p-4">
        <h2 className="text-xl font-bold text-schw-blue mb-4">Your Podcast is Ready</h2>
        <audio controls src={audioUrl} className="w-full">
            Your browser does not support the audio element.
        </audio>
    </div>
  );
};