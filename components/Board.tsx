import React from 'react';
import { Point } from '../types';
import { GRID_SIZE } from '../constants';

interface BoardProps {
  snake: Point[];
  food: Point;
  cellSize: number;
  gameOver: boolean;
}

const Board: React.FC<BoardProps> = ({ snake, food, cellSize, gameOver }) => {
  const boardBaseClasses = "relative bg-gray-300 dark:bg-gray-700 overflow-hidden transition-colors duration-300";
  // Simplified border styles for a pixelated look
  const gameActiveBorder = "border-2 border-emerald-600 dark:border-emerald-500";
  const gameOverBorder = "border-2 border-red-600 dark:border-red-500";
  
  return (
    <div
      className={`${boardBaseClasses} ${gameOver ? gameOverBorder : gameActiveBorder}`}
      style={{
        width: GRID_SIZE * cellSize,
        height: GRID_SIZE * cellSize,
      }}
      aria-label="Game Board"
    >
      {/* Render Snake */}
      {snake.map((segment, index) => (
        <div
          key={index}
          className={`absolute ${
            index === 0 
            ? 'bg-green-500 dark:bg-green-400 z-10'  // Pixelated head
            : 'bg-green-700 dark:bg-green-600'     // Pixelated body
          }`}
          style={{
            width: cellSize -1, 
            height: cellSize -1,
            left: segment.x * cellSize + 0.5,
            top: segment.y * cellSize + 0.5,
          }}
          role="img"
          aria-label={index === 0 ? "Snake head" : "Snake segment"}
        />
      ))}
      {/* Render Food */}
      {!gameOver && (
        <div
          className="absolute bg-red-500 dark:bg-red-400 transition-colors duration-300" // Pixelated food
          style={{
            width: cellSize -1, // Fill cell for pixel look
            height: cellSize -1,
            left: food.x * cellSize + 0.5,
            top: food.y * cellSize + 0.5,
          }}
          role="img"
          aria-label="Food"
        />
      )}
    </div>
  );
};

export default Board;