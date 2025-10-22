
import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="absolute inset-0 bg-slate-900 bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-t-4 border-slate-700 border-t-emerald-400 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-slate-300 font-medium">{message}</p>
    </div>
  );
};
