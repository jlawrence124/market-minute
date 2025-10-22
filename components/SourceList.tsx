
import React from 'react';
import { Source } from '../types';

interface SourceListProps {
  sources: Source[];
}

const SourceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 inline-block text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

export const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mt-8 bg-slate-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-emerald-400 mb-4">Intelligence Sources</h2>
      <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {sources.map((source, index) => (
          <li key={index}>
            <a
              href={source.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-emerald-400 transition-colors duration-200 flex items-center group"
            >
              <SourceIcon />
              <span className="group-hover:underline truncate">{source.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
