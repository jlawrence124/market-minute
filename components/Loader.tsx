import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-t-4 border-schw-gray border-t-schw-blue rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-schw-text-light font-medium">{message}</p>
    </div>
  );
};