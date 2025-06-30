import React from 'react';

interface GameOverModalProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, highScore, onRestart }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/95 dark:bg-gray-900/95 backdrop-blur-sm z-20 p-8 text-center transition-colors duration-300">
      <h2 className="text-6xl font-extrabold text-red-600 dark:text-red-500 mb-6">Game Over!</h2>
      <p className="text-3xl text-slate-700 dark:text-gray-200 mb-4">Your Score: {score}</p>
      <p className="text-2xl text-yellow-500 dark:text-yellow-400 mb-10">High Score: {highScore}</p>
      <button
        onClick={onRestart}
        className="px-10 py-5 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-2xl font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-opacity-75"
      >
        Restart Game
      </button>
    </div>
  );
};

export default GameOverModal;