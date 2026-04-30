import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';
import { Direction, Point } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 150;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(p => p.x === newFood.x && p.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsStarted(true);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isStarted || isGameOver) return;

    const moveSnake = () => {
      const head = { ...snake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collision with walls
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return;
      }

      // Check collision with self
      if (snake.some(p => p.x === head.x && p.y === head.y)) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return;
      }

      const newSnake = [head, ...snake];

      // Check if food eaten
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [isStarted, isGameOver, snake, direction, food, score, highScore, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#020202';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff00ff';
    ctx.fillRect(
        food.x * cellSize + 4,
        food.y * cellSize + 4,
        cellSize - 8,
        cellSize - 8
    );
    ctx.shadowBlur = 0;

    // Draw snake
    snake.forEach((p, i) => {
      ctx.fillStyle = i === 0 ? '#00f3ff' : 'transparent';
      ctx.strokeStyle = i === 0 ? '#00f3ff' : '#ff00ff';
      ctx.lineWidth = 2;
      ctx.shadowBlur = i === 0 ? 15 : 0;
      ctx.shadowColor = '#00f3ff';
      
      if (i === 0) {
        ctx.fillRect(p.x * cellSize + 2, p.y * cellSize + 2, cellSize - 4, cellSize - 4);
      } else {
        ctx.strokeRect(p.x * cellSize + 4, p.y * cellSize + 4, cellSize - 8, cellSize - 8);
      }
    });
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black/40 border-2 border-[var(--neon-cyan)] shadow-[4px_4px_0_var(--neon-magenta)] relative overflow-hidden group glitch-border">
      <div className="scanline"></div>
      
      <div className="flex justify-between w-full mb-2">
        <div className="flex flex-col h-full">
          <span className="text-[10px] uppercase tracking-widest text-[var(--neon-cyan)]/60 font-mono">NODE_SIGNAL</span>
          <span 
            className="text-6xl font-bold text-[var(--neon-cyan)] neon-text-cyan glitch-text"
            data-text={score.toString().padStart(4, '0')}
          >
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-[var(--neon-magenta)]/60 font-mono">RECORD_PEAK</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[var(--neon-magenta)]" />
            <span className="text-2xl font-bold text-[var(--neon-magenta)] neon-text-magenta">{highScore.toString().padStart(4, '0')}</span>
          </div>
        </div>
      </div>

      <div className="relative p-1 bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-magenta)]/20">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black/90 border border-[var(--neon-cyan)]"
          id="snake-canvas"
        />

        <AnimatePresence>
          {!isStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <motion.button
                whileHover={{ scale: 1.05, skewX: -10 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="flex items-center gap-3 px-8 py-4 bg-[var(--neon-cyan)] text-black font-black uppercase tracking-[0.2em] shadow-[8px_8px_0_var(--neon-magenta)]"
                id="start-game-btn"
              >
                <Play className="w-5 h-5 fill-current" />
                BOOT_CORE
              </motion.button>
              <p className="mt-6 text-[10px] font-mono text-[var(--neon-cyan)] uppercase tracking-[0.3em] animate-pulse">INPUT_VECTOR_REQUIRED</p>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#ff00ff]/20 backdrop-blur-md"
            >
              <h2 
                className="text-5xl font-black text-white glitch-text uppercase tracking-tighter mb-4"
                data-text="SYSTEM_HALT"
              >
                SYSTEM_HALT
              </h2>
              <p className="text-[var(--neon-cyan)] mb-10 font-mono text-xs uppercase tracking-[0.4em]">LOG_SCORE: {score}</p>
              <motion.button
                whileHover={{ scale: 1.05, skewX: 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="flex items-center gap-3 px-8 py-4 border-2 border-white text-white font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-[4px_4px_0_var(--neon-cyan)]"
                id="retry-game-btn"
              >
                <RefreshCw className="w-5 h-5" />
                INIT_RECOVERY
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 w-full opacity-60">
        <div className="flex-1 h-[2px] bg-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)]"></div>
        <span className="text-[8px] font-mono uppercase tracking-[0.5em] text-[var(--neon-cyan)]">NEURAL_SYNC_VALIDATED</span>
        <div className="flex-1 h-[2px] bg-[var(--neon-magenta)] shadow-[0_0_10px_var(--neon-magenta)]"></div>
      </div>
    </div>
  );
}
