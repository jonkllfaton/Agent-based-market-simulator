import React, { useState, useRef, useEffect } from 'react';
import { History, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { formatCurrency, formatTimestamp } from '../utils/formatUtils';

const TradeHistory: React.FC = () => {
  const { state } = useSimulation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const historyRef = useRef<HTMLDivElement>(null);
  
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  
  // Filter trades based on selected asset
  const filteredTrades = filter === 'all' 
    ? state.trades 
    : state.trades.filter(trade => trade.asset === filter);

  // Auto-scroll to bottom when new trades appear
  useEffect(() => {
    if (historyRef.current && !isCollapsed) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [state.trades.length, isCollapsed]);
  
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg text-white overflow-hidden flex flex-col h-full">
      <div 
        className="p-3 bg-gray-800 flex justify-between items-center cursor-pointer"
        onClick={toggleCollapse}
      >
        <div className="flex items-center space-x-2">
          <History size={18} className="text-purple-400" />
          <h3 className="font-medium">Trade History</h3>
        </div>
        {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </div>
      
      {!isCollapsed && (
        <>
          <div className="p-2 bg-gray-800 border-t border-gray-700 flex items-center">
            <Filter size={16} className="text-gray-400 mr-2" />
            <select 
              className="bg-gray-700 text-white text-sm rounded-md px-2 py-1 border-none outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Assets</option>
              {state.assets.map(asset => (
                <option key={asset.id} value={asset.id}>
                  {asset.symbol}
                </option>
              ))}
            </select>
          </div>
          
          <div 
            ref={historyRef}
            className="p-3 overflow-y-auto flex-grow"
            style={{ maxHeight: '300px' }}
          >
            {filteredTrades.length > 0 ? (
              <div className="space-y-2">
                {[...filteredTrades].reverse().map((trade) => {
                  const asset = state.assets.find(a => a.id === trade.asset);
                  const buyer = state.agents.find(a => a.id === trade.buyerId);
                  const seller = state.agents.find(a => a.id === trade.sellerId);
                  
                  // Skip trades where we can't find the agents (might have been removed)
                  if (!asset || !buyer || !seller) return null;
                  
                  return (
                    <div key={trade.id} className="bg-gray-800 p-2 rounded-md border border-gray-700 text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400 text-xs">
                          {formatTimestamp(trade.timestamp)}
                        </span>
                        <span className="font-medium text-xs">{asset.symbol}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-green-400 text-xs mb-1">Buyer: {buyer.name}</div>
                          <div className="text-red-400 text-xs">Seller: {seller.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{trade.quantity} @ {formatCurrency(trade.price)}</div>
                          <div className="text-blue-400 text-xs">Total: {formatCurrency(trade.total)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                No trades recorded yet
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TradeHistory;