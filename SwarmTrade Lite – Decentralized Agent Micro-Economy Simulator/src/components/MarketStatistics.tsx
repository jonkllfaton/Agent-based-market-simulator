import React, { useState } from 'react';
import { BarChart, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatUtils';
import { getMarketHealthColor } from '../utils/colorUtils';

const MarketStatistics: React.FC = () => {
  const { state } = useSimulation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  
  // Calculate market statistics
  const buyerCount = state.agents.filter(a => a.type === 'buyer').length;
  const sellerCount = state.agents.filter(a => a.type === 'seller').length;
  const arbitrageurCount = state.agents.filter(a => a.type === 'arbitrageur').length;
  const activeAgents = state.agents.filter(a => a.active).length;
  const avgTradeValue = state.trades.length > 0
    ? state.trades.reduce((sum, trade) => sum + trade.total, 0) / state.trades.length
    : 0;
  
  const marketHealthColor = getMarketHealthColor(state.marketHealth);
  
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg text-white overflow-hidden">
      <div 
        className="p-3 bg-gray-800 flex justify-between items-center cursor-pointer"
        onClick={toggleCollapse}
      >
        <div className="flex items-center space-x-2">
          <BarChart size={18} className="text-amber-400" />
          <h3 className="font-medium">Market Statistics</h3>
        </div>
        {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </div>
      
      {!isCollapsed && (
        <div className="p-3">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-400">Market Health</span>
              <span className="text-sm">{formatPercent(state.marketHealth)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${marketHealthColor}`}
                style={{ width: `${state.marketHealth * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-gray-800 p-2 rounded border border-gray-700">
              <div className="text-xs text-gray-400">Trade Volume</div>
              <div className="text-lg font-medium">{formatCurrency(state.totalVolume)}</div>
            </div>
            <div className="bg-gray-800 p-2 rounded border border-gray-700">
              <div className="text-xs text-gray-400">Trades</div>
              <div className="text-lg font-medium">{state.trades.length}</div>
            </div>
            <div className="bg-gray-800 p-2 rounded border border-gray-700">
              <div className="text-xs text-gray-400">Avg. Trade Value</div>
              <div className="text-lg font-medium">{formatCurrency(avgTradeValue)}</div>
            </div>
            <div className="bg-gray-800 p-2 rounded border border-gray-700">
              <div className="text-xs text-gray-400">Active Agents</div>
              <div className="text-lg font-medium">{activeAgents} / {state.agents.length}</div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-2 rounded border border-gray-700 mb-3">
            <div className="text-xs text-gray-400 mb-1">Agent Distribution</div>
            <div className="flex h-4 w-full rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all"
                style={{ width: `${state.agents.length ? (buyerCount / state.agents.length) * 100 : 0}%` }}
              ></div>
              <div 
                className="bg-red-500 h-full transition-all"
                style={{ width: `${state.agents.length ? (sellerCount / state.agents.length) * 100 : 0}%` }}
              ></div>
              <div 
                className="bg-blue-500 h-full transition-all"
                style={{ width: `${state.agents.length ? (arbitrageurCount / state.agents.length) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 mr-1 rounded-full"></div>
                <span>Buyers: {buyerCount}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 mr-1 rounded-full"></div>
                <span>Sellers: {sellerCount}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 mr-1 rounded-full"></div>
                <span>Arbitrageurs: {arbitrageurCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketStatistics;