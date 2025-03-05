import React, { useState } from 'react';

interface GameLevelProps {
  onLevelSelect: (level: string) => void;
  batchId?: string;
  gymId?: string;
  isVisible: boolean;
}

const GameLevelSelector: React.FC<GameLevelProps> = ({ 
  onLevelSelect, 
  batchId, 
  gymId, 
  isVisible 
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('beginner');

  const levels = [
    {
      id: 'beginner',
      letter: 'B',
      title: 'Beginner',
      description: 'No game played before',
      color: '#68E39C',
      bgColor: 'rgba(104, 227, 156, 0.15)'
    },
    {
      id: 'amaeture',
      letter: 'A',
      title: 'Amaeture',
      description: '1 or >1 games played before',
      color: '#FFC75B',
      bgColor: 'rgba(255, 199, 91, 0.15)'
    },
    {
      id: 'intermediate',
      letter: 'I',
      title: 'Intermediate',
      description: '>3 games played before',
      color: '#6CA0DC',
      bgColor: 'rgba(108, 160, 220, 0.15)'
    },
    {
      id: 'advanced',
      letter: 'A',
      title: 'Advanced',
      description: '>15 games played before',
      color: '#9C6ADE',
      bgColor: 'rgba(156, 106, 222, 0.15)'
    }
  ];

  const handleSelect = (levelId: string) => {
    setSelectedLevel(levelId);
  };

  const handleConfirm = () => {
    // Just pass the selection to the parent component
    onLevelSelect(selectedLevel);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="w-full bg-white rounded-t-lg overflow-hidden">
        {/* Blue header */}
        <div className="bg-blue-600 p-4">
          <div className="text-white text-xl font-semibold">Game Level</div>
          <div className="text-white/80 text-sm">Select your experience level</div>
        </div>
        
        <div className="px-4 py-6">
          <h2 className="text-gray-800 text-xl font-bold mb-6">First tell us your game level</h2>
          
          <div className="space-y-4">
            {levels.map((level) => (
              <div 
                key={level.id}
                className="rounded-lg cursor-pointer transition-all duration-200"
                style={{ backgroundColor: level.bgColor }}
                onClick={() => handleSelect(level.id)}
              >
                <div className="flex items-center p-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-medium mr-4"
                    style={{ backgroundColor: level.color }}
                  >
                    {level.letter}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="font-medium text-base">{level.title}</div>
                    <div className="text-sm text-gray-600">{level.description}</div>
                  </div>
                  
                  <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    {selectedLevel === level.id && (
                      <div className="w-5 h-5 rounded-full bg-green-500"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom button with appropriate padding */}
        <div className="p-4">
          <button
            className="w-full bg-black text-white py-4 rounded-md font-medium text-lg"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameLevelSelector;
