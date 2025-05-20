import React from 'react';
import { Play, Pause, RotateCcw, Plus, UserPlus, Clock, Zap } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { formatTime, formatDay } from '../utils/formatUtils';
import { SimulationSpeed } from '../types';

const SimulationControls: React.FC = () => {
  const { state, dispatch, addRandomAgent, generateRandomTrade } = useSimulation();
  
  const handleSpeedChange = (speed: SimulationSpeed) => {
    dispatch({ type: 'SET_SPEED', payload: speed });
  };
  
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Clock size={18} className="text-blue-400" />
          <div className="text-xl font-medium">
            {formatTime(state.time)} | {formatDay(state.day)}
          </div>
        </div>
        
        <div className="flex items-center">
          <Zap size={18} className="text-yellow-400 mr-2" />
          <span className="mr-2">Speed:</span>
          {[1, 2, 5, 10].map((speed) => (
            <button
              key={speed}
              className={`px-2 py-1 rounded-md text-sm mr-1 ${
                state.speed === speed
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => handleSpeedChange(speed as SimulationSpeed)}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <div className="flex space-x-2">
          {state.isRunning ? (
            <button
              className="flex items-center space-x-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-md transition"
              onClick={() => dispatch({ type: 'PAUSE_SIMULATION' })}
            >
              <Pause size={16} />
              <span>Pause</span>
            </button>
          ) : (
            <button
              className="flex items-center space-x-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-md transition"
              onClick={() => dispatch({ type: 'START_SIMULATION' })}
            >
              <Play size={16} />
              <span>Start</span>
            </button>
          )}
          
          <button
            className="flex items-center space-x-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition"
            onClick={() => dispatch({ type: 'RESET_SIMULATION' })}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            className="flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition"
            onClick={() => addRandomAgent()}
          >
            <UserPlus size={16} />
            <span>Add Agent</span>
          </button>
          
          <button
            className="flex items-center space-x-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition"
            onClick={generateRandomTrade}
            disabled={state.agents.length < 2}
          >
            <Plus size={16} />
            <span>Generate Trade</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;