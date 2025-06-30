
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from './types';
import { GRID_SIZE, INITIAL_GAME_SPEED_MS, MIN_CELL_SIZE_PX, BASE_CELL_SIZE_PX, MIN_GAME_SPEED_MS, SPEED_INCREMENT_FACTOR } from './constants';
import Board from './components/Board';
import StartScreen from './components/StartScreen';
import GameOverModal from './components/GameOverModal';
import TouchControls from './components/TouchControls';

// SVG Icons
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
);

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
    </svg>
);


const App: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([]);
  const [food, setFood] = useState<Point>({ x: 0, y: 0 });
  const [currentDirection, setCurrentDirection] = useState<Direction>(Direction.RIGHT);
  const [pendingDirection, setPendingDirection] = useState<Direction>(Direction.RIGHT);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    return savedHighScore ? parseInt(savedHighScore, 10) : 0;
  });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [cellSize, setCellSize] = useState<number>(BASE_CELL_SIZE_PX);
  const [gameSpeedMs, setGameSpeedMs] = useState<number>(INITIAL_GAME_SPEED_MS);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const gameIntervalRef = useRef<number | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('snakeTheme');
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  useEffect(() => {
    const touchSupported = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    setIsTouchDevice(touchSupported);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('snakeTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const goBackToStartScreen = () => {
    setGameStarted(false);
  };

  const calculateCellSize = useCallback(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const heightMultiplier = isTouch ? 0.60 : 0.75;

    const availableWidth = screenWidth * 0.95; 
    const availableHeight = screenHeight * heightMultiplier; 

    const boardPixelSize = Math.min(availableWidth, availableHeight);
    const calculatedCellSize = Math.floor(boardPixelSize / GRID_SIZE);
    setCellSize(Math.max(MIN_CELL_SIZE_PX, calculatedCellSize));
  }, []);

  useEffect(() => {
    calculateCellSize();
    window.addEventListener('resize', calculateCellSize);
    return () => window.removeEventListener('resize', calculateCellSize);
  }, [calculateCellSize]);

  const placeFood = useCallback((currentSnake: Point[]): Point => {
    let newFoodPosition: Point;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      newFoodPosition = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y)) {
        break;
      }
    }
    return newFoodPosition;
  }, []);

  const initializeGame = useCallback(() => {
    const initialSnakeHead: Point = { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) };
    const initialSnake: Point[] = [
      initialSnakeHead,
      { x: initialSnakeHead.x - 1, y: initialSnakeHead.y },
      { x: initialSnakeHead.x - 2, y: initialSnakeHead.y },
    ];
    setSnake(initialSnake);
    setFood(placeFood(initialSnake));
    setCurrentDirection(Direction.RIGHT);
    setPendingDirection(Direction.RIGHT);
    setScore(0);
    setGameOver(false);
    setGameSpeedMs(INITIAL_GAME_SPEED_MS); // Reset game speed
  }, [placeFood]);

  const startGame = () => {
    initializeGame();
    setGameStarted(true);
  };

  const gameTick = useCallback(() => {
    let effectiveDirection = currentDirection;
    if (
      pendingDirection !== currentDirection &&
      !((pendingDirection === Direction.UP && currentDirection === Direction.DOWN) ||
        (pendingDirection === Direction.DOWN && currentDirection === Direction.UP) ||
        (pendingDirection === Direction.LEFT && currentDirection === Direction.RIGHT) ||
        (pendingDirection === Direction.RIGHT && currentDirection === Direction.LEFT))
    ) {
      effectiveDirection = pendingDirection;
      setCurrentDirection(pendingDirection);
    }

    setSnake(prevSnake => {
      if (prevSnake.length === 0) return [];
      const newHead = { ...prevSnake[0] };

      switch (effectiveDirection) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }

      if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
      else if (newHead.x >= GRID_SIZE) newHead.x = 0;
      if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
      else if (newHead.y >= GRID_SIZE) newHead.y = 0;

      if (prevSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      let newSnake = [newHead, ...prevSnake];
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 1);
        if (score + 1 > highScore) {
          setHighScore(score + 1);
        }
        setFood(placeFood(newSnake));
        // Increase game speed
        setGameSpeedMs(prevSpeed => Math.max(MIN_GAME_SPEED_MS, Math.floor(prevSpeed * SPEED_INCREMENT_FACTOR)));
      } else {
        newSnake.pop();
      }
      return newSnake;
    });
  }, [currentDirection, pendingDirection, food, score, highScore, placeFood, setFood, setScore, setHighScore, setGameOver, setCurrentDirection, setGameSpeedMs]);


  useEffect(() => {
    if (gameStarted && !gameOver) {
      if (gameIntervalRef.current) { // Clear existing interval before setting a new one
        clearInterval(gameIntervalRef.current);
      }
      gameIntervalRef.current = window.setInterval(gameTick, gameSpeedMs);
    } else {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    }
    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, [gameStarted, gameOver, gameTick, gameSpeedMs]); // Add gameSpeedMs to dependencies
  
  const handleDirectionChange = (newDirection: Direction) => {
    if (!gameStarted || gameOver) return;
    setPendingDirection(newDirection);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;
      let newDirection: Direction | null = null;
      switch (event.key) {
        case 'ArrowUp': newDirection = Direction.UP; break;
        case 'ArrowDown': newDirection = Direction.DOWN; break;
        case 'ArrowLeft': newDirection = Direction.LEFT; break;
        case 'ArrowRight': newDirection = Direction.RIGHT; break;
      }
      if (newDirection !== null) {
         event.preventDefault(); 
         setPendingDirection(newDirection);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    localStorage.setItem('snakeHighScore', highScore.toString());
  }, [highScore]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 text-slate-800 dark:text-gray-100 p-2 sm:p-4 overflow-hidden select-none transition-colors duration-300">
      {!gameStarted && <StartScreen onStart={startGame} highScore={highScore} isTouchDevice={isTouchDevice} />}
      {gameOver && <GameOverModal score={score} highScore={highScore} onRestart={startGame} />}
      
      {gameStarted && (
        <div className="flex flex-col items-center w-full">
          <header className="mb-2 sm:mb-4 w-full max-w-xl">
            <div className="grid grid-cols-3 items-center">
                <div className="flex justify-start">
                    <button
                        onClick={goBackToStartScreen}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                        aria-label="Go back to start screen"
                    >
                        <BackIcon />
                    </button>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400 text-center">Snake NP</h1>
                <div className="flex justify-end">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                    >
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                </div>
            </div>
            <div className="mt-1 sm:mt-2 text-lg sm:text-xl flex justify-around w-full max-w-xs sm:max-w-sm mx-auto">
                <span className="text-slate-700 dark:text-gray-300">Score: <span className="text-yellow-500 dark:text-yellow-400 font-semibold">{score}</span></span>
                <span className="text-slate-700 dark:text-gray-300">High Score: <span className="text-yellow-500 dark:text-yellow-400 font-semibold">{highScore}</span></span>
            </div>
          </header>
          <Board snake={snake} food={food} cellSize={cellSize} gameOver={gameOver} />
           <footer className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-slate-600 dark:text-gray-400">
            {isTouchDevice ? 'Use on-screen controls to move.' : 'Use Arrow Keys to move.'} Pass through walls!
          </footer>
          {isTouchDevice && <TouchControls onDirectionChange={handleDirectionChange} />}
        </div>
      )}
    </div>
  );
};

export default App;
