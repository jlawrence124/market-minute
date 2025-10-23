
import React, { useState } from 'react';

interface TranscriptViewerProps {
  script: string;
}

const TranscriptIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({ script }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full max-w-2xl mt-8 bg-white rounded-xl shadow-md border border-schw-gray p-6">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <h2 className="text-xl font-bold text-schw-blue flex items-center">
                    <TranscriptIcon />
                    Podcast Transcript
                </h2>
                <button 
                    aria-expanded={isOpen}
                    className="text-schw-blue font-semibold"
                >
                    {isOpen ? 'Hide' : 'Show'}
                </button>
            </div>
            {isOpen && (
                <div className="mt-4 pt-4 border-t border-schw-gray">
                    <pre className="text-schw-text-light whitespace-pre-wrap font-sans text-sm bg-schw-light-gray p-4 rounded-lg">
                        {script}
                    </pre>
                </div>
            )}
        </div>
    );
};