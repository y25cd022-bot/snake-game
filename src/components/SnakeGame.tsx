import { useEffect, useRef, useState, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 100;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 10 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const prevDirection = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: { x: number, y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 15, y: 10 });
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (prevDirection.current.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (prevDirection.current.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (prevDirection.current.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (prevDirection.current.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (isGameOver) resetGame();
          else setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { x: prevSnake[0].x + direction.x, y: prevSnake[0].y + direction.y };
        prevDirection.current = direction;

        // Check collisions
        if (
          head.x < 0 || head.x >= GRID_SIZE ||
          head.y < 0 || head.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check food
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 100);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [direction, food, isPaused, isGameOver, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#39ff14' : '#1fb30c';
      ctx.shadowBlur = i === 0 ? 15 : 5;
      ctx.shadowColor = '#39ff14';
      ctx.fillRect(segment.x * size + 1, segment.y * size + 1, size - 2, size - 2);
    });

    // Draw food
    ctx.fillStyle = '#ff0055';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff0055';
    ctx.beginPath();
    ctx.arc((food.x + 0.5) * size, (food.y + 0.5) * size, size / 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="flex gap-8 text-center mb-10">
        <div className="glass-card px-8 py-3 neon-border-blue bg-white/5">
          <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Current Score</div>
          <div className="text-3xl font-mono neon-text-green">{String(score).padStart(5, '0')}</div>
        </div>
        <div className="glass-card px-8 py-3 neon-border-purple bg-white/5">
          <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Status</div>
          <div className={`text-xl font-bold uppercase tracking-tighter ${isGameOver ? 'text-red-500' : 'text-neon-purple'}`}>
            {isGameOver ? 'Terminated' : isPaused ? 'Halted' : 'Active'}
          </div>
        </div>
      </div>

      <div className="relative p-2 glass-card neon-border-blue overflow-hidden">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="block aspect-square max-w-full bg-[#0a0a0a] rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 pointer-events-none"></div>
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
            <h2 
              className="mb-8 text-5xl font-bold tracking-tighter text-white" 
            >
              {isGameOver ? "GAME OVER" : "PAUSED"}
            </h2>
            <button
              onClick={() => isGameOver ? resetGame() : setIsPaused(false)}
              className="bg-white text-black font-bold uppercase tracking-widest px-10 py-4 rounded-full hover:scale-105 transition-transform"
            >
              {isGameOver ? "RESTART" : "CONTINUE"}
            </button>
            <p className="mt-6 text-[10px] text-white/30 uppercase tracking-[0.3em]">
              [ Press Space to Toggle ]
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
