
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
  isTouchDevice: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore, isTouchDevice }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/95 dark:bg-gray-900/90 backdrop-blur-sm z-20 p-8 text-center transition-colors duration-300">
      <h1 className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-6">Snake NP</h1>
      <p className="text-xl text-slate-700 dark:text-gray-300 mb-4">
        {isTouchDevice ? 'Use the on-screen controls to move.' : 'Use Arrow Keys to control the snake.'}
      </p>
      <p className="text-xl text-slate-700 dark:text-gray-300 mb-8">Eat the dots to grow and score points!</p>
      {highScore > 0 && (
        <p className="text-2xl text-yellow-500 dark:text-yellow-400 mb-8">High Score: {highScore}</p>
      )}
      <button
        onClick={onStart}
        className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white text-2xl font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-opacity-75"
      >
        Start Game
      </button>
      <p className="mt-12 text-sm text-slate-500 dark:text-gray-500">Built with React, TypeScript & TailwindCSS</p>
    </div>
  );
};

export default StartScreen;
