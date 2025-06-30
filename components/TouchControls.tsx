
import React from 'react';
import { Direction } from '../types';

interface TouchControlsProps {
  onDirectionChange: (direction: Direction) => void;
}

const ArrowIcon: React.FC<{ rotation: string }> = ({ rotation }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2.5} 
    stroke="currentColor" 
    className="w-8 h-8 sm:w-10 sm:h-10 transition-transform"
    style={{ transform: rotation }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
  </svg>
);


const TouchControls: React.FC<TouchControlsProps> = ({ onDirectionChange }) => {
  const handleInteraction = (e: React.SyntheticEvent, direction: Direction) => {
    e.preventDefault();
    onDirectionChange(direction);
  };

  const buttonClasses = "flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-slate-300/50 dark:bg-slate-700/50 rounded-full text-slate-800 dark:text-slate-200 active:bg-emerald-500/50 dark:active:bg-emerald-500/60 transition-colors duration-150 transform active:scale-95 select-none";

  return (
    <div className="mt-4 grid grid-cols-3 grid-rows-3 gap-2 w-52 h-52 sm:w-64 sm:h-64" aria-hidden="true">
      <div className="col-start-2 row-start-1 flex justify-center items-center">
        <button 
          className={buttonClasses} 
          onTouchStart={(e) => handleInteraction(e, Direction.UP)}
          onMouseDown={(e) => handleInteraction(e, Direction.UP)}
          aria-label="Move up"
        >
          <ArrowIcon rotation="rotate(0deg)" />
        </button>
      </div>
      <div className="col-start-1 row-start-2 flex justify-center items-center">
        <button 
          className={buttonClasses} 
          onTouchStart={(e) => handleInteraction(e, Direction.LEFT)}
          onMouseDown={(e) => handleInteraction(e, Direction.LEFT)}
          aria-label="Move left"
        >
          <ArrowIcon rotation="rotate(-90deg)" />
        </button>
      </div>
      <div className="col-start-3 row-start-2 flex justify-center items-center">
        <button 
          className={buttonClasses}
          onTouchStart={(e) => handleInteraction(e, Direction.RIGHT)}
          onMouseDown={(e) => handleInteraction(e, Direction.RIGHT)}
          aria-label="Move right"
        >
          <ArrowIcon rotation="rotate(90deg)" />
        </button>
      </div>
      <div className="col-start-2 row-start-3 flex justify-center items-center">
        <button 
          className={buttonClasses} 
          onTouchStart={(e) => handleInteraction(e, Direction.DOWN)}
          onMouseDown={(e) => handleInteraction(e, Direction.DOWN)}
          aria-label="Move down"
        >
          <ArrowIcon rotation="rotate(180deg)" />
        </button>
      </div>
    </div>
  );
};

export default TouchControls;
