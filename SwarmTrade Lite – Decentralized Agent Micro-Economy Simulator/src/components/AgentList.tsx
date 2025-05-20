import React, { useState } from 'react';
import { Users, ChevronDown, ChevronUp, ToggleLeft, ToggleRight, Edit, Trash2 } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { formatCurrency } from '../utils/formatUtils';
import { getAgentTypeColor, getStrategyColor } from '../utils/colorUtils';
import { Agent } from '../types';

const AgentList: React.FC = () => {
  const { state, dispatch } = useSimulation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  
  const handleToggleAgent = (agentId: string) => {
    dispatch({ type: 'TOGGLE_AGENT', payload: agentId });
  };
  
  const handleRemoveAgent = (agentId: string) => {
    dispatch({ type: 'REMOVE_AGENT', payload: agentId });
    if (selectedAgent === agentId) {
      setSelectedAgent(null);
    }
  };
  
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg text-white overflow-hidden">
      <div 
        className="p-3 bg-gray-800 flex justify-between items-center cursor-pointer"
        onClick={toggleCollapse}
      >
        <div className="flex items-center space-x-2">
          <Users size={18} className="text-blue-400" />
          <h3 className="font-medium">Agents ({state.agents.length})</h3>
        </div>
        {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </div>
      
      {!isCollapsed && (
        <div className="p-3 max-h-80 overflow-y-auto">
          <div className="grid grid-cols-1 gap-2">
            {state.agents.map((agent) => (
              <AgentItem
                key={agent.id}
                agent={agent}
                isSelected={selectedAgent === agent.id}
                onSelect={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                onToggle={() => handleToggleAgent(agent.id)}
                onRemove={() => handleRemoveAgent(agent.id)}
              />
            ))}
            {state.agents.length === 0 && (
              <div className="text-gray-400 text-center py-4">
                No agents in simulation. Add some agents to begin.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface AgentItemProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onRemove: () => void;
}

const AgentItem: React.FC<AgentItemProps> = ({ agent, isSelected, onSelect, onToggle, onRemove }) => {
  const typeColor = getAgentTypeColor(agent.type);
  const strategyColor = getStrategyColor(agent.strategy);
  
  return (
    <div className={`border border-gray-700 rounded-md overflow-hidden ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="p-2 bg-gray-800 flex items-center justify-between cursor-pointer" onClick={onSelect}>
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: agent.color }}
          />
          <span className="font-medium">{agent.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-gray-700"
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
          >
            {agent.active ? <ToggleRight size={16} className="text-green-400" /> : <ToggleLeft size={16} />}
          </button>
          <button 
            className="text-gray-400 hover:text-red-400 transition p-1 rounded-full hover:bg-gray-700"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {isSelected && (
        <div className="p-3 bg-gray-900 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <span className="text-xs text-gray-400">Type:</span>
              <div className="text-sm capitalize" style={{ color: typeColor }}>
                {agent.type}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Strategy:</span>
              <div className={`text-sm capitalize ${strategyColor}`}>
                {agent.strategy}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Capital:</span>
              <div className="text-sm font-medium">{formatCurrency(agent.capital)}</div>
            </div>
            <div>
              <span className="text-xs text-gray-400">P&L:</span>
              <div className={`text-sm font-medium ${agent.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(agent.profitLoss)}
              </div>
            </div>
          </div>
          
          <div className="mt-2">
            <span className="text-xs text-gray-400">Inventory:</span>
            {Object.keys(agent.inventory).length > 0 ? (
              <div className="grid grid-cols-2 gap-1 mt-1">
                {Object.entries(agent.inventory).map(([assetId, quantity]) => (
                  <div key={assetId} className="text-xs bg-gray-800 p-1 rounded">
                    {assetId.split('-')[1]}: {quantity}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 mt-1">No assets</div>
            )}
          </div>
          
          <div className="mt-2">
            <span className="text-xs text-gray-400">Recent Trades:</span>
            {agent.tradeHistory.length > 0 ? (
              <div className="mt-1 text-xs">
                {agent.tradeHistory.slice(-2).map((trade) => (
                  <div key={trade.id} className="bg-gray-800 p-1 rounded mb-1 text-xs">
                    {trade.buyerId === agent.id ? 'Bought' : 'Sold'} {trade.quantity} of {trade.asset.split('-')[1]} for {formatCurrency(trade.total)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 mt-1">No recent trades</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentList;