import React, { useState, useEffect } from 'react';
import { GamepadIcon, RotateCcw, Trophy, Timer } from 'lucide-react';

export function StressReliefGames() {
  const [currentGame, setCurrentGame] = useState<'memory' | 'bubble' | 'coloring' | null>(null);

  const games = [
    {
      id: 'memory' as const,
      name: 'Memory Match',
      description: 'Match pairs of cards to improve focus and memory',
      emoji: '🧠',
      color: 'bg-blue-500'
    },
    {
      id: 'bubble' as const,
      name: 'Bubble Breathing',
      description: 'Pop bubbles in rhythm with your breathing',
      emoji: '🫧',
      color: 'bg-teal-500'
    },
    {
      id: 'coloring' as const,
      name: 'Digital Mandala',
      description: 'Color beautiful patterns for mindfulness',
      emoji: '🎨',
      color: 'bg-purple-500'
    }
  ];

  const renderGame = () => {
    switch (currentGame) {
      case 'memory':
        return <MemoryGame onComplete={() => setCurrentGame(null)} />;
      case 'bubble':
        return <BubbleGame onComplete={() => setCurrentGame(null)} />;
      case 'coloring':
        return <ColoringGame onComplete={() => setCurrentGame(null)} />;
      default:
        return null;
    }
  };

  if (currentGame) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <GamepadIcon className="w-5 h-5 text-purple-500" />
            {games.find(g => g.id === currentGame)?.name}
          </h3>
          <button
            onClick={() => setCurrentGame(null)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Back to Games
          </button>
        </div>
        {renderGame()}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <GamepadIcon className="w-5 h-5 text-purple-500" />
        Stress Relief Games
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => setCurrentGame(game.id)}
            className={`${game.color} text-white p-6 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{game.emoji}</div>
              <h4 className="font-semibold text-lg mb-2">{game.name}</h4>
              <p className="text-sm opacity-90">{game.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
        <p className="text-purple-800 text-sm text-center">
          🎮 Take a 5-minute game break to reduce stress and improve focus!
        </p>
      </div>
    </div>
  );
}

// Memory Game Component
function MemoryGame({ onComplete }: { onComplete: () => void }) {
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const emojis = ['🌟', '🌈', '🦋', '🌸', '🍀', '⭐', '🌺', '🌙'];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const gameEmojis = [...emojis.slice(0, 6), ...emojis.slice(0, 6)];
    const shuffled = gameEmojis.sort(() => Math.random() - 0.5);
    
    setCards(shuffled.map((emoji, index) => ({
      id: index,
      emoji,
      flipped: false,
      matched: false
    })));
    setFlippedCards([]);
    setMoves(0);
    setGameComplete(false);
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || cards[cardId].flipped || cards[cardId].matched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, flipped: true } : card
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      setTimeout(() => {
        const [first, second] = newFlippedCards;
        if (cards[first].emoji === cards[second].emoji) {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, matched: true }
              : card
          ));
        } else {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, flipped: false }
              : card
          ));
        }
        setFlippedCards([]);
      }, 1000);
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setGameComplete(true);
    }
  }, [cards]);

  return (
    <div className="text-center">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Moves: {moves}</span>
          </div>
        </div>
        <button
          onClick={initializeGame}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square flex items-center justify-center text-2xl rounded-lg cursor-pointer transition-all duration-300 ${
              card.flipped || card.matched
                ? 'bg-blue-100 border-2 border-blue-300'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {(card.flipped || card.matched) ? card.emoji : '?'}
          </div>
        ))}
      </div>

      {gameComplete && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">Congratulations!</span>
          </div>
          <p className="text-green-700 text-sm">
            You completed the game in {moves} moves! Great job improving your focus! 🎉
          </p>
          <button
            onClick={onComplete}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

// Bubble Game Component
function BubbleGame({ onComplete }: { onComplete: () => void }) {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0 && gameActive) {
        setTimeLeft(prev => prev - 1);
      } else {
        setGameActive(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const bubbleInterval = setInterval(() => {
      const newBubble = {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        size: Math.random() * 30 + 20
      };
      setBubbles(prev => [...prev, newBubble]);
    }, 1500);

    return () => clearInterval(bubbleInterval);
  }, [gameActive]);

  const popBubble = (bubbleId: number) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== bubbleId));
    setScore(prev => prev + 10);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Score: {score}</span>
          <span className="text-sm text-gray-600">Time: {timeLeft}s</span>
        </div>
      </div>

      <div className="relative bg-gradient-to-b from-blue-100 to-blue-200 rounded-xl h-80 overflow-hidden">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            onClick={() => popBubble(bubble.id)}
            className="absolute bg-blue-300 bg-opacity-60 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 animate-pulse"
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              animation: 'float 3s ease-in-out infinite'
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-transparent opacity-30"></div>
          </div>
        ))}
        
        {!gameActive && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl text-center">
              <h4 className="font-semibold text-lg mb-2">Game Over!</h4>
              <p className="text-gray-600 mb-4">Final Score: {score}</p>
              <button
                onClick={onComplete}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 mt-4">
        🫧 Pop bubbles to relax and practice mindful breathing
      </p>
    </div>
  );
}

// Coloring Game Component
function ColoringGame({ onComplete }: { onComplete: () => void }) {
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [coloredSections, setColoredSections] = useState<Record<string, string>>({});

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  const colorSection = (sectionId: string) => {
    setColoredSections(prev => ({
      ...prev,
      [sectionId]: selectedColor
    }));
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Choose a color:</h4>
        <div className="flex justify-center gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 max-w-md mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-64">
          {/* Simple mandala pattern */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill={coloredSections['outer'] || 'white'}
            stroke="#ccc"
            strokeWidth="2"
            onClick={() => colorSection('outer')}
            className="cursor-pointer hover:opacity-80"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            fill={coloredSections['middle'] || 'white'}
            stroke="#ccc"
            strokeWidth="2"
            onClick={() => colorSection('middle')}
            className="cursor-pointer hover:opacity-80"
          />
          <circle
            cx="100"
            cy="100"
            r="40"
            fill={coloredSections['inner'] || 'white'}
            stroke="#ccc"
            strokeWidth="2"
            onClick={() => colorSection('inner')}
            className="cursor-pointer hover:opacity-80"
          />
          <circle
            cx="100"
            cy="100"
            r="20"
            fill={coloredSections['center'] || 'white'}
            stroke="#ccc"
            strokeWidth="2"
            onClick={() => colorSection('center')}
            className="cursor-pointer hover:opacity-80"
          />
          
          {/* Petal shapes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
            <ellipse
              key={angle}
              cx="100"
              cy="60"
              rx="15"
              ry="30"
              fill={coloredSections[`petal-${index}`] || 'white'}
              stroke="#ccc"
              strokeWidth="1"
              transform={`rotate(${angle} 100 100)`}
              onClick={() => colorSection(`petal-${index}`)}
              className="cursor-pointer hover:opacity-80"
            />
          ))}
        </svg>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => setColoredSections({})}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={onComplete}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Finish
        </button>
      </div>

      <p className="text-sm text-gray-600 mt-4">
        🎨 Click on different sections to color them and practice mindfulness
      </p>
    </div>
  );
}